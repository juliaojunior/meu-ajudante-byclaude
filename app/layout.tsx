import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import ServiceWorkerRegister from "@/components/ui/ServiceWorkerRegister";
import TextScaleProvider from "@/contexts/TextScaleProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meu Ajudante",
  description: "Lembretes de medicamentos para o dia a dia",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meu Ajudante",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#C2410C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${plusJakartaSans.variable} h-full`}
    >
      <body className="h-full">
        <TextScaleProvider>
          {children}
        </TextScaleProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
