import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsInit from "@/components/AnalyticsInit";
import JaktlankarMenu from "@/components/JaktlankarMenu";
import JakterMenu from "@/components/ui/JakterMenu";

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
        {/* Credits strip – full-width frosted bar at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-3.5 py-1.5 select-none pointer-events-none"
          style={{ background: "rgba(0,0,0,0.05)", backdropFilter: "blur(4px)" }}>
          <a
            href="mailto:martin.akdogan@enkoping.se"
            className="text-[11px] font-bold text-white/80 dark:text-white/70 pointer-events-auto hover:text-white transition-colors"
          >
            Kontakt: martin.akdogan@enkoping.se
          </a>
        </div>
        <JaktlankarMenu />
          <JakterMenu />
        </div>
      </body>
    </html>
  );
}
