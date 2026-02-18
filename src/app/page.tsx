import { FadeIn } from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm text-white/70 hover:text-white transition"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <a href="#" className="font-semibold tracking-widest text-white">
            NEON<span className="text-white/60">LAB</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="#work">Work</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#process">Process</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>

          <a
            href="#contact"
            className="rounded-2xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all duration-200"
          >
            Get a quote
          </a>
        </div>
      </header>

      {/* Page */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">
              <span className="h-2 w-2 rounded-full bg-cyan-300/80" />
              Neon • Cyber • Luxury • Dark
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white">
              Premium websites that convert visitors into clients.
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-2xl text-lg text-white/70">
              I design and build modern landing pages for startups, freelancers,
              and small businesses — focused on clarity, performance, and a
              high-end look that builds trust instantly.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#work"
                className="rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all duration-200"
              >
                See examples
              </a>
              <a
                href="#contact"
                className="rounded-2xl px-5 py-3 bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 border border-white/15 text-white hover:opacity-90 transition-all duration-200"
              >
                Get a quote
              </a>
            </div>
          </FadeIn>

          {/* Work / Services cards */}
          <FadeIn delay={0.32}>
            <section id="work" className="mt-16">
              <h2 className="text-white text-xl font-semibold">Work</h2>
              <p className="mt-2 text-white/70">
                A few examples of what I build (landing pages, redesigns, motion
                UI).
              </p>

              <div id="services" className="mt-6 grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "Landing Pages",
                    desc: "High-converting pages with premium visuals.",
                  },
                  {
                    title: "Motion UI",
                    desc: "Fade-ins, transitions, and micro-interactions.",
                  },
                  {
                    title: "Modern Redesign",
                    desc: "Upgrade old sites to a luxury dark style.",
                  },
                ].map((c, i) => (
                  <FadeIn key={c.title} delay={0.36 + i * 0.08}>
                    <div className="glass neon-border glow-hover rounded-3xl p-6">
                      <div className="text-white font-semibold">{c.title}</div>
                      <div className="mt-2 text-white/70">{c.desc}</div>
                      <div className="mt-4 text-sm text-white/60">
                        Next.js • Tailwind • Motion
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* Process */}
          <FadeIn delay={0.52}>
            <section id="process" className="mt-16">
              <h2 className="text-white text-xl font-semibold">Process</h2>
              <p className="mt-2 text-white/70 max-w-2xl">
                Clear steps, fast communication, and a clean handover.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {[
                  {
                    t: "1) Discovery",
                    d: "Goals, references, and content checklist.",
                  },
                  { t: "2) Build", d: "Design system + components + motion." },
                  {
                    t: "3) Launch",
                    d: "QA, performance checks, deploy + handover.",
                  },
                ].map((x, i) => (
                  <FadeIn key={x.t} delay={0.56 + i * 0.08}>
                    <div className="glass neon-border rounded-3xl p-6">
                      <div className="text-white font-semibold">{x.t}</div>
                      <div className="mt-2 text-white/70">{x.d}</div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* Contact */}
          <FadeIn delay={0.72}>
            <section
              id="contact"
              className="mt-16 glass neon-border rounded-3xl p-7"
            >
              <h2 className="text-white text-xl font-semibold">Contact</h2>

              <p className="mt-2 text-white/70 max-w-xl">
                Tell me briefly what you want to build and I’ll get back to you
                with a clear plan and timeline.
              </p>

              <ContactForm />

              <p className="mt-4 text-xs text-white/50">
                Typical response time: within 24 hours.
              </p>
            </section>
          </FadeIn>

          {/* Footer */}
          <footer className="mt-10 pb-10 text-white/40 text-xs">
            © {new Date().getFullYear()} NEONLAB. Built with Next.js.
          </footer>
        </div>
      </div>
    </main>
  );
}
