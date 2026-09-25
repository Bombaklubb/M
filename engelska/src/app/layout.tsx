import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsInit from "@/components/AnalyticsInit";
import JakterMenu from "@/components/ui/JakterMenu";
import ThemedBackdrop from "@/components/ui/ThemedBackdrop";

export const metadata: Metadata = {
  title: "Engelskajakten – Lär dig engelska",
  description:
    "En gratis engelskträningsapp för åk 1–gymnasiet. Grammatikövningar och läsförståelse i fyra spännande världar.",
  keywords: ["engelska", "skola", "övningar", "grammatik", "läsförståelse", "gratis"],
  icons: {
    icon: "/union-jack.svg",
    apple: "/union-jack.svg",
  },
  openGraph: {
    images: [
      {
        url: "https://engelskajakten.vercel.app/engelskajakten-logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemedBackdrop />
        <AnalyticsInit />
        {children}
        {/* Hörnen längst ned. Ljusa knappar i stället för vit text direkt på
            sidan: den vita texten försvann på ljusa sidor som Om och Affären,
            och på ljusa teman. */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-3 pb-2 select-none pointer-events-none">
          <a
            href="mailto:martin.akdogan@enkoping.se"
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-white/85 backdrop-blur-sm shadow-md border border-black/5 hover:text-slate-900 hover:bg-white transition-colors dark:bg-gray-900/80 dark:text-slate-200 dark:border-white/10 dark:hover:text-white"
          >
            <span aria-hidden="true">✉️</span>
            Kontakta Martin
          </a>
          <JakterMenu />
        </div>
      </body>
    </html>
  );
}
