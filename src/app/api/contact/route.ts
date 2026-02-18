import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email").max(254),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
  website: z.string().optional(), // honeypot
});

/**
 * Simple in-memory rate limiter: max 5 requests per 10 minutes per IP.
 * ✅ Great for learning/local dev
 * ⚠️ Not reliable for serverless multi-instance production (use Redis/Upstash later)
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const requestsByIp = new Map<string, number[]>();

function getClientIp(req: Request) {
  // In production behind a proxy (Vercel/NGINX), x-forwarded-for is common.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  // Sometimes you may see x-real-ip
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const timestamps = requestsByIp.get(ip) ?? [];

  // Keep only timestamps in the active window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    // How long until the oldest request falls out of the window?
    const retryAfterMs = WINDOW_MS - (now - recent[0]);
    return {
      allowed: false as const,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  recent.push(now);
  requestsByIp.set(ip, recent);
  return { allowed: true as const, retryAfterSeconds: 0 };
}

// Very small HTML escape to avoid breaking the email HTML if user types "<" etc.
function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(ip);

    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfterSeconds),
          },
        },
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, message, website } = parsed.data;

    // Honeypot triggered → pretend success, but do nothing
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!process.env.RESEND_API_KEY || !to || !from) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing env vars (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)",
        },
        { status: 500 },
      );
    }

    const subject = `Studio Site — New message from ${name}`;

    // Plain text fallback
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    // HTML version
    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5;">
        <h2 style="margin:0 0 12px;">New message via Studio Site</h2>
        <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 12px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <div style="padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb;">
          <p style="margin:0; white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
        <p style="margin:12px 0 0; color:#6b7280; font-size:12px;">
          Reply to this email to respond to ${escapeHtml(name)}.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email,
      text,
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
