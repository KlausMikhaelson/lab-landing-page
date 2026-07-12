/**
 * Central site metadata. Set NEXT_PUBLIC_SITE_URL in production so canonical
 * URLs, sitemap, robots, and Open Graph images resolve to your real domain.
 */
export const SITE = {
  name: "Understudy",
  // TODO: set NEXT_PUBLIC_SITE_URL to your real domain before launch
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://understudy.com",
  title: "Understudy — Run the experiment before your users do",
  tagline: "Run the experiment before your users do.",
  description:
    "Understudy runs swarms of behavior-grounded agents through your real product flows to predict which version wins, who abandons, and why — before a single real user sees it. Backtested on real behavioral data.",
  // TODO: set your handle
  twitter: "@understudy",
  brand: "#6ee7b7",
  bg: "#141728",
} as const;
