export type AnalyticsEvent = { type: "visit" } | { type: "complete"; score: number };

export function sendAnalyticsEvent(event: AnalyticsEvent) {
  const body = JSON.stringify(event);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const sent = navigator.sendBeacon(
      "/api/analytics",
      new Blob([body], { type: "application/json" })
    );

    if (sent) return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  });
}
