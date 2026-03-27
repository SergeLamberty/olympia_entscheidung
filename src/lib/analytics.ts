import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const ANALYTICS_COOKIE_NAME = "olympia_visitor_id";

interface VisitorRecord {
  firstSeenAt: string;
  lastSeenAt: string;
  visits: number;
}

interface CompletionRecord {
  completedAt: string;
  score: number;
}

interface AnalyticsStore {
  uniqueVisitors: Record<string, VisitorRecord>;
  completedVisitors: Record<string, CompletionRecord>;
}

export interface AnalyticsStats {
  uniqueVisitors: number;
  completedVisitors: number;
  averageScore: number | null;
  completionRate: number | null;
}

const DATA_DIR = process.env.ANALYTICS_DATA_DIR ?? "/data";
const DATA_FILE = path.join(DATA_DIR, "analytics.json");

const EMPTY_STORE: AnalyticsStore = {
  uniqueVisitors: {},
  completedVisitors: {},
};

let writeQueue: Promise<unknown> = Promise.resolve();

function normalizeScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function sanitizeStore(raw: unknown): AnalyticsStore {
  if (!raw || typeof raw !== "object") return structuredClone(EMPTY_STORE);

  const candidate = raw as Partial<AnalyticsStore>;
  return {
    uniqueVisitors:
      candidate.uniqueVisitors && typeof candidate.uniqueVisitors === "object"
        ? candidate.uniqueVisitors
        : {},
    completedVisitors:
      candidate.completedVisitors && typeof candidate.completedVisitors === "object"
        ? candidate.completedVisitors
        : {},
  };
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readStore(): Promise<AnalyticsStore> {
  await ensureDataDir();

  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return sanitizeStore(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(EMPTY_STORE);
    }
    throw error;
  }
}

async function writeStore(store: AnalyticsStore) {
  await ensureDataDir();
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function withStoreLock<T>(mutate: (store: AnalyticsStore) => Promise<T> | T): Promise<T> {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    const result = await mutate(store);
    await writeStore(store);
    return result;
  });

  writeQueue = operation.then(
    () => undefined,
    () => undefined
  );

  return operation;
}

export async function trackVisit(visitorId: string) {
  await withStoreLock((store) => {
    const now = new Date().toISOString();
    if (store.uniqueVisitors[visitorId]) return;

    store.uniqueVisitors[visitorId] = {
      firstSeenAt: now,
      lastSeenAt: now,
      visits: 1,
    };
  });
}

export async function trackCompletion(visitorId: string, score: number) {
  await withStoreLock((store) => {
    const now = new Date().toISOString();

    if (!store.uniqueVisitors[visitorId]) {
      store.uniqueVisitors[visitorId] = {
        firstSeenAt: now,
        lastSeenAt: now,
        visits: 1,
      };
    }

    store.completedVisitors[visitorId] = {
      completedAt: now,
      score: normalizeScore(score),
    };
  });
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const store = await readStore();
  const completionScores = Object.values(store.completedVisitors).map((entry) => entry.score);
  const uniqueVisitors = Object.keys(store.uniqueVisitors).length;
  const completedVisitors = completionScores.length;

  return {
    uniqueVisitors,
    completedVisitors,
    averageScore:
      completedVisitors > 0
        ? Math.round(
            completionScores.reduce((sum, score) => sum + score, 0) / completedVisitors
          )
        : null,
    completionRate:
      uniqueVisitors > 0 ? Math.round((completedVisitors / uniqueVisitors) * 100) : null,
  };
}
