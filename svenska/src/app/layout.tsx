import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Svenskajakten – Lär dig svenska",
  description:
    "En gratis svenskträningsapp för åk 1–gymnasiet. Grammatikövningar och läsförståelse i fyra spännande världar.",
  keywords: ["svenska", "skola", "övningar", "grammatik", "läsförståelse", "gratis"],
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
        {children}
        <div className="fixed bottom-2 left-3 z-40 pointer-events-none select-none">
          <span className="text-xs text-slate-400 dark:text-slate-600 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
            Kontakt: martin.akdogan@enkoping.se
          </span>
        </div>
        <div className="fixed bottom-2 right-3 z-40 pointer-events-none select-none">
          <span className="text-xs text-slate-400 dark:text-slate-600 opacity-60 hover:opacity-100 transition-opacity">
            Svenskajakten av Martin Akdogan
          </span>
        </div>
      </body>
    </html>
  );
}
