import fs from "fs";
import path from "path";
import type { SiteContent, QuestionsContent, ResultsContent, FaqContent } from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[content-loader] Could not load ${filename}:`, err);
    return fallback;
  }
}

const SITE_FALLBACK: SiteContent = {
  meta: {
    title: "Wahl-Check",
    description: "Ihr Orientierungshilfe zur Abstimmung",
    siteUrl: "http://localhost:3000",
    locale: "de",
  },
  hero: {
    headline: "Welche Position passt zu dir?",
    subheadline: "Beantworte die Fragen und finde es heraus.",
    ctaLabel: "Jetzt starten",
  },
  howItWorks: { headline: "So funktioniert's", steps: [] },
  about: { headline: "Über das Projekt", text: "" },
  footer: { copyright: "© 2025 Wahl-Check", links: [] },
  navigation: { links: [] },
};

const QUESTIONS_FALLBACK: QuestionsContent = {
  version: "1.0",
  totalQuestions: 0,
  questions: [],
};

const RESULTS_FALLBACK: ResultsContent = {
  version: "1.0",
  positions: [],
  scoreLabels: {
    high: "Hohe Übereinstimmung",
    medium: "Mittlere Übereinstimmung",
    low: "Geringe Übereinstimmung",
  },
};

const FAQ_FALLBACK: FaqContent = {
  headline: "FAQ",
  intro: "",
  items: [],
};

export function loadSiteContent(): SiteContent {
  return readJson<SiteContent>("site.json", SITE_FALLBACK);
}

export function loadQuestionsContent(): QuestionsContent {
  return readJson<QuestionsContent>("questions.json", QUESTIONS_FALLBACK);
}

export function loadResultsContent(): ResultsContent {
  return readJson<ResultsContent>("results.json", RESULTS_FALLBACK);
}

export function loadFaqContent(): FaqContent {
  return readJson<FaqContent>("faq.json", FAQ_FALLBACK);
}
