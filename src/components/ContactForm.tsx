"use client";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "sending" | "sent" | "error";

type FieldErrors = Partial<{
  name: string[];
  email: string[];
  message: string[];
}>;

type ApiErrorResponse = {
  ok?: boolean;
  error?: string;
  issues?: {
    fieldErrors?: FieldErrors;
  };
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // honeypot (hidden)
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>("");

  // Trigger a shake when we hit an error
  const [shakeKey, setShakeKey] = useState(0);

  type FieldName = keyof FieldErrors;
  type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function resetErrors(field: FieldName) {
    clearFieldError(field);
    if (formError) setFormError("");
    if (status === "error") setStatus("idle");
  }

  function handleFieldChange(
    field: FieldName,
    setter: Dispatch<SetStateAction<string>>,
  ) {
    return (e: InputEvent) => {
      setter(e.target.value);
      resetErrors(field);
    };
  }

  // Basic client-side checks (server still validates with Zod)
  const isClientValid = useMemo(() => {
    const n = name.trim();
    const e = email.trim();
    const m = message.trim();
    const emailLooksOk = e.includes("@") && e.includes(".");
    return (
      n.length >= 2 && emailLooksOk && m.length >= 10 && status !== "sending"
    );
  }, [name, email, message, status]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (status !== "sent") return;
    const t = setTimeout(() => setStatus("idle"), 5000);
    return () => clearTimeout(t);
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // If client invalid, gently nudge + shake (don’t call API)
    if (!isClientValid) {
      setStatus("error");
      setFormError("Please complete the form correctly before sending.");
      setShakeKey((k) => k + 1);
      return;
    }

    setStatus("sending");
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      const data = (await res.json()) as ApiErrorResponse;

      if (!res.ok || !data.ok) {
        const fe = data?.issues?.fieldErrors;

        // Zod field errors (400)
        if (fe && Object.keys(fe).length > 0) {
          setFieldErrors(fe);
          setFormError("");
        } else {
          setFieldErrors({});
          // Rate limit (429) or other server errors
          if (res.status === 429) {
            const retryAfter = res.headers.get("Retry-After");
            setFormError(
              retryAfter
                ? `Too many messages. Try again in ${retryAfter} seconds.`
                : "Too many messages. Try again in a moment.",
            );
          } else {
            setFormError(data?.error || "Couldn’t send. Please try again.");
          }
        }

        setStatus("error");
        setShakeKey((k) => k + 1);
        return;
      }

      // Success
      setStatus("sent");
      setFieldErrors({});
      setFormError("");
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
    } catch {
      setStatus("error");
      setFormError("Network error. Check your connection and try again.");
      setShakeKey((k) => k + 1);
    }
  }

  const inputBase =
    "w-full rounded-2xl bg-black/30 border px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors";
  const inputOk = "border-white/15 focus:border-white/30";
  const inputBad = "border-red-400/60 focus:border-red-300";

  return (
    <motion.form
      key={shakeKey}
      onSubmit={onSubmit}
      className="mt-6 flex flex-col gap-3"
      // subtle shake when status is error (key forces replay)
      initial={false}
      animate={status === "error" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Honeypot (hidden) */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex flex-col gap-1">
        <input
          value={name}
          onChange={handleFieldChange("name", setName)}
          type="text"
          required
          minLength={2}
          placeholder="Your name"
          className={`${inputBase} ${fieldErrors.name ? inputBad : inputOk}`}
        />
        {fieldErrors.name?.[0] && (
          <p className="text-sm text-red-300">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          value={email}
          onChange={handleFieldChange("email", setEmail)}
          type="email"
          required
          placeholder="Your email"
          className={`${inputBase} ${fieldErrors.email ? inputBad : inputOk}`}
        />
        {fieldErrors.email?.[0] && (
          <p className="text-sm text-red-300">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          value={message}
          onChange={handleFieldChange("message", setMessage)}
          required
          minLength={10}
          rows={4}
          placeholder="What do you need built?"
          className={`${inputBase} resize-none ${
            fieldErrors.message ? inputBad : inputOk
          }`}
        />
        {fieldErrors.message?.[0] && (
          <p className="text-sm text-red-300">{fieldErrors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isClientValid}
        className="mt-2 rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center gap-2">
          {status === "sending" && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden="true"
            />
          )}
          {status === "sending" ? "Sending..." : "Send message"}
        </span>
      </button>

      {status === "sent" && (
        <p className="text-sm text-white/70">Sent. I’ll reply soon.</p>
      )}

      {/* Form-level errors (rate limit, server errors, etc.) */}
      {status === "error" && formError && (
        <p className="text-sm text-red-300">{formError}</p>
      )}
    </motion.form>
  );
}
