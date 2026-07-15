/**
 * Central site metadata. Set NEXT_PUBLIC_SITE_URL in production so canonical
 * URLs, sitemap, robots, and Open Graph images resolve to your real domain.
 */
export const SITE = {
  name: "General Simulation",
  // TODO: set NEXT_PUBLIC_SITE_URL to your real domain before launch
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://generalsimulation.com",
  title: "General Simulation: Run the experiment before your users do",
  tagline: "Run the experiment before your users do.",
  description:
    "General Simulation runs swarms of behavior-grounded agents through your real product flows to predict which version wins, who abandons, and why, before a single real user sees it. Backtested on a real 64,000-customer experiment: 94% accurate at picking the winning variant per segment, versus 35% when the behavioral grounding is scrambled.",
  // TODO: set your handle
  twitter: "@generalsimulation",
  brand: "#6ee7b7",
  bg: "#141728",
} as const;
