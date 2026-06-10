import type { NextConfig } from "next";

const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  ...(isCapacitorBuild && { output: "export" }),
  images: {
    unoptimized: true,
  },
  headers: async () => [
    {
      source: "/manifest.webmanifest",
      headers: [{ key: "Content-Type", value: "application/manifest+json" }],
    },
  ],
};

export default nextConfig;
