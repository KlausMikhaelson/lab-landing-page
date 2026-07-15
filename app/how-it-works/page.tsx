import type { Metadata } from "next";
import Link from "next/link";
import NatureDither from "@/components/NatureDither";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Know what your next product change will do before you build it. Understand your users, then predict which version wins.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How General Simulation works",
    description:
      "Know what your next change will do before you build it.",
    url: "/how-it-works",
  },
};

const EMERALD = "#6ee7b7";

type Dot = {
  x: number;
  y: number;
  /** static opacity */
  o?: number;
  /** emerald accent dot */
  c?: boolean;
  /** animate along the pipeline */
  pulse?: boolean;
  /** animation stagger, seconds */
  d?: number;
};

function Glyph({
  dots,
  w,
  h,
  children,
}: {
  dots: Dot[];
  w: number;
  h: number;
  children?: React.ReactNode;
}) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-auto" aria-hidden>
      {dots.map((dot, i) => (
        <rect
          key={i}
          x={dot.x}
          y={dot.y}
          width="4"
          height="4"
          fill={dot.c ? EMERALD : "#ffffff"}
          opacity={dot.o ?? 1}
          className={dot.pulse ? "us-pulse" : undefined}
          style={dot.pulse ? { animationDelay: `${dot.d ?? 0}s` } : undefined}
        />
      ))}
      {children}
    </svg>
  );
}

/* 01 - a real session: a wandering journey, a rage-click knot, an exit */
const watchDots: Dot[] = [
  { x: 0, y: 26, o: 0.35, pulse: true, d: 0 },
  { x: 7, y: 21, o: 0.45, pulse: true, d: 0.18 },
  { x: 14, y: 17, o: 0.5, pulse: true, d: 0.36 },
  { x: 21, y: 15, o: 0.55, pulse: true, d: 0.54 },
  { x: 28, y: 17, o: 0.5, pulse: true, d: 0.72 },
  { x: 34, y: 22, o: 0.5, pulse: true, d: 0.9 },
  { x: 39, y: 28, o: 0.5, pulse: true, d: 1.08 },
  // friction: the rage-click knot the session gets stuck on
  { x: 46, y: 34, c: true },
  { x: 52, y: 34, c: true },
  { x: 46, y: 40, c: true },
  { x: 52, y: 40, c: true },
  // ...and the quiet exit
  { x: 62, y: 28, o: 0.22 },
];

/* 02 - behavior organized into persona clusters (echoes the logo mark) */
const groundDots: Dot[] = [
  { x: 12, y: 4, o: 0.4 },
  { x: 6, y: 10, o: 0.4 },
  { x: 12, y: 10, c: true, pulse: true, d: 0 },
  { x: 18, y: 10, o: 0.4 },
  { x: 12, y: 16, o: 0.4 },
  { x: 44, y: 2, o: 0.4 },
  { x: 38, y: 8, o: 0.4 },
  { x: 44, y: 8, c: true, pulse: true, d: 0.5 },
  { x: 50, y: 8, o: 0.4 },
  { x: 44, y: 14, o: 0.4 },
  { x: 28, y: 26, o: 0.4 },
  { x: 22, y: 32, o: 0.4 },
  { x: 28, y: 32, c: true, pulse: true, d: 1 },
  { x: 34, y: 32, o: 0.4 },
  { x: 28, y: 38, o: 0.4 },
];

/* 03 - the simulated A/B: dot bar chart, the winner glows and climbs */
const predictDots: Dot[] = [
  { x: 10, y: 38, o: 0.3 },
  { x: 16, y: 38, o: 0.3 },
  { x: 10, y: 32, o: 0.3 },
  { x: 16, y: 32, o: 0.3 },
  { x: 10, y: 26, o: 0.3 },
  { x: 16, y: 26, o: 0.3 },
  { x: 36, y: 38, c: true },
  { x: 42, y: 38, c: true },
  { x: 36, y: 32, c: true },
  { x: 42, y: 32, c: true },
  { x: 36, y: 26, c: true },
  { x: 42, y: 26, c: true },
  { x: 36, y: 20, c: true },
  { x: 42, y: 20, c: true },
  { x: 36, y: 14, c: true, pulse: true, d: 0 },
  { x: 42, y: 14, c: true, pulse: true, d: 0.3 },
  { x: 36, y: 8, c: true, pulse: true, d: 0.6 },
  { x: 42, y: 8, c: true, pulse: true, d: 0.9 },
];

const STEPS = [
  {
    n: "01",
    title: "See",
    body: "Understand where your users struggle and drop off.",
    glyph: <Glyph dots={watchDots} w={70} h={50} />,
  },
  {
    n: "02",
    title: "Understand",
    body: "Learn how your real users think and behave.",
    glyph: <Glyph dots={groundDots} w={58} h={44} />,
  },
  {
    n: "03",
    title: "Predict",
    body: "Know which change wins before you ship it.",
    glyph: (
      <Glyph dots={predictDots} w={56} h={56}>
        <text
          x="10"
          y="53"
          fontSize="9"
          fill="rgba(255,255,255,0.55)"
          fontFamily="var(--font-geist-mono)"
        >
          A
        </text>
        <text x="36" y="53" fontSize="9" fill={EMERALD} fontFamily="var(--font-geist-mono)">
          B
        </text>
      </Glyph>
    ),
  },
];

// pixel dot-matrix "swarm" mark, echoes the dithered dots (same as home nav)
function SwarmMark() {
  return (
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
  );
}

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-[100svh] w-full bg-[#141728] text-white">
      {/* same living dot scene as the homepage, fixed behind the content */}
      <div className="fixed inset-0 z-0">
        <NatureDither />
      </div>
      {/* legibility scrims, fixed so they cover the viewport as the page scrolls */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-2/3 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-80 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <SwarmMark />
          <span className="text-base leading-tight sm:text-lg">General Simulation</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-white/80 sm:gap-6">
          <Link
            href="/"
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/#access"
            className="whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-medium backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-4"
          >
            Early access
          </Link>
        </div>
      </nav>

      {/* content */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-[6vh] sm:px-10 sm:pt-[9vh]">
        <p className="font-mono text-xs tracking-tight text-emerald-300 [text-shadow:0_1px_5px_rgba(0,0,0,0.85)]">
          How it works
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-5xl">
          Test on your users,
          <br />
          without your users.
        </h1>
        <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
          Know what your next change will do, before you build it.
        </p>

        {/* the pipeline: three dot glyphs on a square-dotted wire */}
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-4 right-4 top-8 hidden h-[3px] sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.20) 0 3px, transparent 3px 12px)",
            }}
          />
          <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="flex h-16 items-center">{s.glyph}</div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  <span className="mr-2 font-mono text-xs font-normal text-emerald-300">
                    {s.n}
                  </span>
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/75 drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* proof + CTA */}
        <div className="mt-16 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md font-mono text-xs leading-6 text-white/65 [text-shadow:0_1px_5px_rgba(0,0,0,0.85)]">
            Backtested on a real 64,000-customer experiment:{" "}
            <span className="text-emerald-300">94%</span> right about the winning
            variant, versus <span className="text-white/85">35%</span> when the
            behavior is scrambled.
            <br />
            <span className="text-white/45">
              The method stays ours. The predictions are yours.
            </span>
          </p>
          <Link
            href="/#access"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#141728] transition-transform hover:scale-[1.02] hover:bg-white/90"
          >
            Request early access
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 flex items-center justify-between px-6 py-4 text-xs text-white/70 sm:px-10">
        <span>© {new Date().getFullYear()} General Simulation</span>
        <span className="hidden sm:inline">
          Simulated users, grounded in real behavior.
        </span>
      </footer>
    </main>
  );
}
