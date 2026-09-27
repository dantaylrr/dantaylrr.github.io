import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1", "192.168.1.136"],
  poweredByHeader: false,
  // Static HTML export for GitHub Pages (no Node server at runtime).
  output: "export",
  // GitHub Pages can't run Next's image optimizer, so serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
