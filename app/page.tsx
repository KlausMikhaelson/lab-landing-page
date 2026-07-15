import Link from "next/link";
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
          <span className="text-base leading-tight sm:text-lg">General Simulation</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/80 sm:gap-6">
          <Link
            href="/how-it-works"
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            How it works
          </Link>
          <a
            href="#access"
            className="whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-medium backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-4"
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
          Backtested on a real 64,000-customer experiment
          <span className="text-emerald-300">94%&nbsp;accurate</span>
        </p>

        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-6xl">
          Run the experiment
          <br />
          before your users do.
        </h1>

        <p className="mt-6 max-w-md text-pretty text-base leading-7 text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-lg">
          Swarms of grounded agents reveal which version wins, and why.
        </p>

        <div id="access" className="mt-9">
          <WaitlistForm />
          {/* the control-group stat is the credibility claim: grounded vs scrambled */}
          <p className="mt-5 max-w-md font-mono text-xs leading-6 text-white/65 [text-shadow:0_1px_5px_rgba(0,0,0,0.85)]">
            <span className="text-emerald-300">94%</span> right about which
            variant wins. <span className="text-white/85">35%</span> when we
            scramble the behavioral data it learns from.
            <br />
            That gap is the product.
          </p>
        </div>
      </section>

      {/* footer */}
      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 py-4 text-xs text-white/70 sm:px-10">
        <span>© {new Date().getFullYear()} General Simulation</span>
        <span className="hidden sm:inline">
          Simulated users, grounded in real behavior.
        </span>
      </footer>
    </main>
  );
}
