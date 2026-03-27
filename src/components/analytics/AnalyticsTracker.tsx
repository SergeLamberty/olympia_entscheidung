"use client";

import { useEffect } from "react";
import { sendAnalyticsEvent } from "@/lib/analytics-client";

const VISIT_SENT_KEY = "olympia-analytics-visit-sent";
const VISIT_PERSISTED_KEY = "olympia-analytics-visit-persisted";

export function AnalyticsTracker() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem(VISIT_PERSISTED_KEY) === "1") return;
      if (window.sessionStorage.getItem(VISIT_SENT_KEY) === "1") return;

      window.sessionStorage.setItem(VISIT_SENT_KEY, "1");
      window.localStorage.setItem(VISIT_PERSISTED_KEY, "1");
    } catch {
      // Fall back to best-effort sending if sessionStorage is unavailable.
    }

    sendAnalyticsEvent({ type: "visit" });
  }, []);

  return null;
}
