import NatureDither from "@/components/NatureDither";
import WaitlistForm from "@/components/WaitlistForm";

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
        <div className="flex items-center gap-2.5 font-semibold tracking-tight">
          {/* pixel dot-matrix "swarm" mark, echoes the dithered dots */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 14 14"
            aria-hidden
            className="shrink-0 drop-shadow-[0_0_7px_rgba(110,231,183,0.55)]"
          >
            <g fill="#6ee7b7">
              <rect x="0.6" y="0.6" width="3.2" height="3.2" />
              <rect x="10.2" y="0.6" width="3.2" height="3.2" />
              <rect x="5.4" y="5.4" width="3.2" height="3.2" />
              <rect x="0.6" y="10.2" width="3.2" height="3.2" />
              <rect x="10.2" y="10.2" width="3.2" height="3.2" />
              <rect x="5.4" y="0.6" width="3.2" height="3.2" opacity="0.3" />
              <rect x="0.6" y="5.4" width="3.2" height="3.2" opacity="0.3" />
              <rect x="10.2" y="5.4" width="3.2" height="3.2" opacity="0.3" />
              <rect x="5.4" y="10.2" width="3.2" height="3.2" opacity="0.3" />
            </g>
          </svg>
          <span className="text-lg">Understudy</span>
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

      {/* hero, kept in the upper (sky) region so the flowers stay visible */}
      <section className="relative z-10 mx-auto mt-[10vh] max-w-3xl px-6 sm:mt-[13vh] sm:px-10">
        <p className="mb-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs tracking-tight text-white/80 [text-shadow:0_1px_5px_rgba(0,0,0,0.85)]">
          <span
            aria-hidden
            className="inline-block h-2 w-2 shrink-0 bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]"
          />
          Backtested on real behavioral data
          <span className="text-emerald-300">p&nbsp;&lt;&nbsp;0.01</span>
        </p>

        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-6xl">
          Run the experiment
          <br />
          before your users do.
        </h1>

        <p className="mt-6 max-w-md text-pretty text-base leading-7 text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-lg">
          Swarms of grounded agents reveal which version wins, and why.
        </p>

        <div className="mt-9">
          <WaitlistForm />
          <a
            id="how"
            href="#"
            className="mt-4 inline-flex items-center text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            See the proof →
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 py-4 text-xs text-white/70 sm:px-10">
        <span>© {new Date().getFullYear()} Understudy</span>
        <span className="hidden sm:inline">
          Simulated users, grounded in real behavior.
        </span>
      </footer>
    </main>
  );
}
