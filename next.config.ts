import type { NextConfig } from "next";

const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  // trailingSlash: gera adicionar/index.html em vez de só adicionar.html,
  // para o servidor local do Capacitor resolver navegações diretas sem
  // cair no fallback SPA (que devolvia a home)
  ...(isCapacitorBuild && { output: "export", trailingSlash: true }),
  // Rotas de API usam a extensão route.web.ts: entram no build web (Vercel),
  // ficam fora do build estático do Capacitor
  pageExtensions: isCapacitorBuild ? ["tsx", "ts"] : ["web.tsx", "web.ts", "tsx", "ts"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
