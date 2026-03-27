import fs from "fs";
import path from "path";
import type {
  OverviewContent,
  ProcessContent,
  ArgumentsContent,
  InfoFaqContent,
  SourcesContent,
} from "@/types/info";

const INFO_DIR = path.join(process.cwd(), "content", "info");

function readInfoJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(INFO_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[info-loader] Could not load info/${filename}:`, err);
    return fallback;
  }
}

const DISCLAIMER =
  "Diese Seite dient der neutralen Information und stellt keine Wahlempfehlung dar.";

export function loadOverviewContent(): OverviewContent {
  return readInfoJson<OverviewContent>("overview.json", {
    pageTitle: "Informationen zur Abstimmung",
    pageIntro: "",
    disclaimer: DISCLAIMER,
    sections: [],
  });
}

export function loadProcessContent(): ProcessContent {
  return readInfoJson<ProcessContent>("process.json", {
    pageTitle: "Ablauf der Abstimmung",
    pageIntro: "",
    steps: [],
  });
}

export function loadArgumentsContent(): ArgumentsContent {
  return readInfoJson<ArgumentsContent>("arguments.json", {
    pageTitle: "Argumente aus der öffentlichen Debatte",
    pageIntro: "",
    debateNote: "",
    pro: { headline: "Argumente für eine Beteiligung", arguments: [] },
    contra: { headline: "Argumente gegen eine Beteiligung", arguments: [] },
  });
}

export function loadInfoFaqContent(): InfoFaqContent {
  return readInfoJson<InfoFaqContent>("faq.json", {
    pageTitle: "Häufige Fragen",
    pageIntro: "",
    items: [],
  });
}

export function loadSourcesContent(): SourcesContent {
  return readInfoJson<SourcesContent>("sources.json", {
    pageTitle: "Quellen",
    pageIntro: "",
    sources: [],
  });
}
