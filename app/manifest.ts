import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meu Ajudante",
    short_name: "Ajudante",
    description: "Lembretes de medicamentos para o dia a dia",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF6EE",
    theme_color: "#C2410C",
    lang: "pt-BR",
    dir: "ltr",
    categories: ["medical", "lifestyle", "health"],
    icons: [
      {
        src: "/icon",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Adicionar remédio",
        short_name: "Adicionar",
        description: "Cadastrar um novo remédio",
        url: "/adicionar",
        icons: [
          {
            src: "/icon",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
