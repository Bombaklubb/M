import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsInit from "@/components/AnalyticsInit";
import JaktlankarMenu from "@/components/JaktlankarMenu";

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
        <AnalyticsInit />
        {children}
        {/* Kontakt – vänster nedre hörn */}
        <div className="fixed bottom-2 left-3 z-40 select-none">
          <a
            href="mailto:martin.akdogan@enkoping.se"
            className="text-sm font-medium text-white/80 dark:text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] hover:text-white dark:hover:text-white transition-colors"
          >
            Kontakt: martin.akdogan@enkoping.se
          </a>
        </div>
        <JaktlankarMenu />
      </body>
    </html>
  );
}
