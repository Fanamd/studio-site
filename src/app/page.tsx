import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">
            <span className="h-2 w-2 rounded-full bg-cyan-300/80" />
            Neon • Cyber • Luxury • Dark
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white">
            Premium websites with motion and code.
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            I build modern landing pages and high-end web experiences using
            Next.js, Tailwind, and clean animation — designed to look expensive
            and load fast.
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all duration-200"
            >
              View work
            </a>
            <a
              href="#contact"
              className="rounded-2xl px-5 py-3 bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 border border-white/15 text-white hover:opacity-90 transition-all duration-200"
            >
              Contact
            </a>
          </div>
        </FadeIn>

        {/* Services / Work cards */}
        <FadeIn delay={0.32}>
          <section id="work" className="mt-16 grid gap-5 md:grid-cols-3">
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
                <div className="glass neon-border glow-hover transition-all duration-200 rounded-3xl p-6">
                  <div className="text-white font-semibold">{c.title}</div>
                  <div className="mt-2 text-white/70">{c.desc}</div>
                  <div className="mt-4 text-sm text-white/60">
                    Next.js • Tailwind • Motion
                  </div>
                </div>
              </FadeIn>
            ))}
          </section>
        </FadeIn>

        {/* Contact block */}
        <FadeIn delay={0.6}>
          <section
            id="contact"
            className="mt-16 glass neon-border rounded-3xl p-7"
          >
            <h2 className="text-white text-xl font-semibold">Contact</h2>
            <p className="mt-2 text-white/70">
              Send a message and I’ll reply with a clear plan.
            </p>

            <div className="mt-5 flex flex-col md:flex-row gap-3">
              <input
                className="w-full rounded-2xl bg-black/30 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                placeholder="Your email"
              />
              <button className="rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all duration-200">
                Send
              </button>
            </div>
          </section>
        </FadeIn>
      </div>
    </main>
  );
}
