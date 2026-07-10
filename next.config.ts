import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The WebGL canvas holds a long-lived GL context; React's dev-only double
  // mount (Strict Mode) creates/tears it down twice, churning contexts and
  // tripping Safari's context limit. Off here; production never double-mounts.
  reactStrictMode: false,
};

export default nextConfig;
