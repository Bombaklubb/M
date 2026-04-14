import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsInit from "@/components/AnalyticsInit";

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
        <div className="fixed bottom-2 left-3 z-40 pointer-events-none select-none">
          <span className="text-sm text-slate-600 dark:text-slate-400 opacity-90 hover:opacity-100 transition-opacity pointer-events-auto">
            Kontakt: martin.akdogan@enkoping.se
          </span>
        </div>
        {/* Signatur – höger nedre hörn */}
        <div className="fixed bottom-2 right-3 z-40 pointer-events-none select-none">
          <span className="text-sm text-slate-600 dark:text-slate-400 opacity-90 hover:opacity-100 transition-opacity">
            Engelskajakten av Martin Akdogan
          </span>
        </div>
      </body>
    </html>
  );
}
