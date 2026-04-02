import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ANALYTICS_COOKIE_NAME,
  getAnalyticsStats,
  trackCompletion,
  trackVisit,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_VISITORS = 100_000;

// In-memory rate limiter: max requests per IP within a sliding window
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = ipHits.get(ip) ?? [];
  const recent = hits.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  ipHits.set(ip, recent);

  // Periodically prune stale IPs to prevent memory growth
  if (ipHits.size > 10_000) {
    for (const [key, timestamps] of ipHits) {
      if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipHits.delete(key);
      }
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

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

function isStatsEnabled(): boolean {
  return process.env.INTERNAL_STATS_ENABLED === "true";
}

export async function GET() {
  if (!isStatsEnabled()) {
    return new NextResponse(null, { status: 404 });
  }
  const stats = await getAnalyticsStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(ANALYTICS_COOKIE_NAME);
  const visitorCookie = existingCookie ?? buildVisitorCookie();

  if (!UUID_RE.test(visitorCookie.value)) {
    return NextResponse.json({ error: "Invalid visitor ID" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || !("type" in payload)) {
    return NextResponse.json({ error: "Invalid analytics event" }, { status: 400 });
  }

  const event = payload as { type?: unknown; score?: unknown };

  if (event.type === "visit") {
    await trackVisit(visitorCookie.value, MAX_VISITORS);
  } else if (event.type === "complete") {
    if (typeof event.score !== "number" || !Number.isFinite(event.score)) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }
    await trackCompletion(visitorCookie.value, event.score, MAX_VISITORS);
  } else {
    return NextResponse.json({ error: "Unknown analytics event" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  if (!existingCookie) {
    response.cookies.set(visitorCookie);
  }
  return response;
}
