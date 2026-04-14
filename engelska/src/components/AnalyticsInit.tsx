"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackPageView, startSession } from "@/services/analyticsService";

/**
 * Initierar GDPR-säker analytics vid sidladdning.
 * Spårar pageview + session-tid. Renderar inget synligt.
 * Ctrl+Shift+P → /larare
 */
export default function AnalyticsInit() {
  const router = useRouter();

  useEffect(() => {
    trackPageView();
    startSession();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        router.push("/larare");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
