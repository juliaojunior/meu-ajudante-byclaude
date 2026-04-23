import type { MetadataRoute } from "next";

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
    icons: [
      {
        src: "/icon",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
