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
              className="rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white transition"
            >
              View work
            </a>
            <a
              href="#contact"
              className="rounded-2xl px-5 py-3 bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 border border-white/15 text-white hover:opacity-90 transition"
            >
              Contact
            </a>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
