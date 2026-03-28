import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ANALYTICS_COOKIE_NAME,
  getAnalyticsStats,
  trackCompletion,
  trackVisit,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

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

export async function GET() {
  const stats = await getAnalyticsStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const existingCookie = cookieStore.get(ANALYTICS_COOKIE_NAME);
  const visitorCookie = existingCookie ?? buildVisitorCookie();

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
    await trackVisit(visitorCookie.value);
  } else if (event.type === "complete") {
    if (typeof event.score !== "number" || !Number.isFinite(event.score)) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }
    await trackCompletion(visitorCookie.value, event.score);
  } else {
    return NextResponse.json({ error: "Unknown analytics event" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  if (!existingCookie) {
    response.cookies.set(visitorCookie);
  }
  return response;
}
