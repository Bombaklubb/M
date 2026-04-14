"use client";

import { useEffect } from "react";
import { trackPageView, startSession } from "@/services/analyticsService";

/**
 * Initierar GDPR-säker analytics vid sidladdning.
 * Spårar pageview + session-tid. Renderar inget synligt.
 */
export default function AnalyticsInit() {
  useEffect(() => {
    trackPageView();
    startSession();
  }, []);

  return null;
}
