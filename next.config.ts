import type { NextConfig } from "next";

const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  ...(isCapacitorBuild && { output: "export" }),
  // Rotas de API usam a extensão route.web.ts: entram no build web (Vercel),
  // ficam fora do build estático do Capacitor
  pageExtensions: isCapacitorBuild ? ["tsx", "ts"] : ["web.tsx", "web.ts", "tsx", "ts"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
