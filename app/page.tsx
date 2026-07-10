import NatureDither from "@/components/NatureDither";

export default function Home() {
  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[#141728] text-white">
      {/* dotted nature scene */}
      <NatureDither controls />

      {/* legibility scrims: darken top (nav/hero) and bottom (footer) only */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
          <span className="text-lg">SAC lab</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/80">
          <a
            href="#how"
            className="hidden transition-colors hover:text-white sm:inline"
          >
            How it works
          </a>
          <a
            href="#access"
            className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Early access
          </a>
        </div>
      </nav>

      {/* hero — kept in the upper (sky) region so the flowers stay visible */}
      <section className="relative z-10 mx-auto mt-[10vh] max-w-3xl px-6 sm:mt-[13vh] sm:px-10">
        <p className="mb-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs tracking-tight text-white/80 [text-shadow:0_1px_5px_rgba(0,0,0,0.85)]">
          <span
            aria-hidden
            className="inline-block h-2 w-2 shrink-0 bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]"
          />
          Grounded predictions beat shuffled controls on real behavioral data
          <span className="text-emerald-300">p&nbsp;&lt;&nbsp;0.01</span>
        </p>

        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-6xl">
          Run the experiment
          <br />
          before your users do.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-lg">
          SAC lab runs swarms of behavior-grounded agents through your real
          product flows — predicting which variant wins, who abandons, and
          exactly why, before a single real user sees it.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            id="access"
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#141728] transition-transform hover:scale-[1.02] hover:bg-white/90"
          >
            Request early access
          </a>
          <a
            id="how"
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            See the validation →
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 py-4 text-xs text-white/70 sm:px-10">
        <span>© {new Date().getFullYear()} SAC lab</span>
        <span className="hidden sm:inline">
          Simulated users, grounded in real behavior.
        </span>
      </footer>
    </main>
  );
}
