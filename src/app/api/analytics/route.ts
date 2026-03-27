import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ANALYTICS_COOKIE_NAME,
  trackCompletion,
  trackVisit,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

const ANALYTICS_RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
} as const;
const MAX_REQUEST_BODY_BYTES = 256;
const BURST_WINDOW_MS = 60_000;
const MAX_EVENTS_PER_WINDOW = 120;
const EVENT_COOLDOWN_MS: Record<AnalyticsEventType, number> = {
  visit: 30_000,
  complete: 10_000,
};

type AnalyticsEventType = "visit" | "complete";
type AnalyticsEvent = { type?: unknown; score?: unknown };

interface RateBucket {
  count: number;
  resetAt: number;
}

const ipBuckets = new Map<string, RateBucket>();
const recentEventTimestamps = new Map<string, number>();

function buildVisitorCookie() {
  return {
    name: ANALYTICS_COOKIE_NAME,
    value: crypto.randomUUID(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getExpectedOrigin(request: Request): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");

  const requestUrl = new URL(request.url);
  return requestUrl.origin;
}

function hasAllowedOrigin(request: Request): boolean {
  const expectedOrigin = getExpectedOrigin(request);
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "") === expectedOrigin;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === expectedOrigin;
    } catch {
      return false;
    }
  }

  return request.headers.get("sec-fetch-site") !== "cross-site";
}

function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.toLowerCase().startsWith("application/json");
}

function isRequestTooLarge(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;

  const parsedLength = Number.parseInt(contentLength, 10);
  return Number.isFinite(parsedLength) && parsedLength > MAX_REQUEST_BODY_BYTES;
}

function shouldThrottleIp(ip: string): boolean {
  const now = Date.now();
  const current = ipBuckets.get(ip);

  if (!current || current.resetAt <= now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + BURST_WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_EVENTS_PER_WINDOW) {
    return true;
  }

  current.count += 1;
  return false;
}

function isDuplicateEvent(
  eventType: AnalyticsEventType,
  visitorKey: string,
  ip: string
): boolean {
  const now = Date.now();
  const key = `${eventType}:${visitorKey}:${ip}`;
  const previousSeenAt = recentEventTimestamps.get(key);

  recentEventTimestamps.set(key, now);
  return (
    typeof previousSeenAt === "number" &&
    now - previousSeenAt < EVENT_COOLDOWN_MS[eventType]
  );
}

function acceptedResponse() {
  return NextResponse.json({ ok: true }, { headers: ANALYTICS_RESPONSE_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: ANALYTICS_RESPONSE_HEADERS }
  );
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403, headers: ANALYTICS_RESPONSE_HEADERS }
    );
  }

  if (!isJsonRequest(request)) {
    return NextResponse.json(
      { error: "Unsupported media type" },
      { status: 415, headers: ANALYTICS_RESPONSE_HEADERS }
    );
  }

  if (isRequestTooLarge(request)) {
    return NextResponse.json(
      { error: "Payload too large" },
      { status: 413, headers: ANALYTICS_RESPONSE_HEADERS }
    );
  }

  const clientIp = getClientIp(request);
  if (shouldThrottleIp(clientIp)) {
    return acceptedResponse();
  }

  const cookieStore = cookies();
  const existingCookie = cookieStore.get(ANALYTICS_COOKIE_NAME);
  const visitorCookie = existingCookie ?? buildVisitorCookie();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers: ANALYTICS_RESPONSE_HEADERS }
    );
  }

  if (!payload || typeof payload !== "object" || !("type" in payload)) {
    return NextResponse.json(
      { error: "Invalid analytics event" },
      { status: 400, headers: ANALYTICS_RESPONSE_HEADERS }
    );
  }

  const event = payload as AnalyticsEvent;

  if (event.type === "visit") {
    if (isDuplicateEvent("visit", visitorCookie.value, clientIp)) {
      return acceptedResponse();
    }
    await trackVisit(visitorCookie.value);
  } else if (event.type === "complete") {
    if (typeof event.score !== "number" || !Number.isFinite(event.score)) {
      return NextResponse.json(
        { error: "Invalid score" },
        { status: 400, headers: ANALYTICS_RESPONSE_HEADERS }
      );
    }

    if (isDuplicateEvent("complete", visitorCookie.value, clientIp)) {
      return acceptedResponse();
    }
    await trackCompletion(visitorCookie.value, event.score);
  } else {
    return NextResponse.json(
      { error: "Unknown analytics event" },
      { status: 400, headers: ANALYTICS_RESPONSE_HEADERS }
    );
  }

  const response = acceptedResponse();
  if (!existingCookie) {
    response.cookies.set(visitorCookie);
  }
  return response;
}
