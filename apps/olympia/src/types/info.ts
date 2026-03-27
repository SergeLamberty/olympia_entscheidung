// ---------------------------------------------------------------------------
// Types for the neutral information section (/info/*)
// All content is loaded from /content/info/*.json
// ---------------------------------------------------------------------------

export interface InfoFact {
  id: string;
  label: string;
  value: string;
  /** Short citation or reference label shown inline */
  sourceRef?: string;
}

export interface InfoSection {
  id: string;
  headline: string;
  intro?: string;
  facts: InfoFact[];
}

export interface OverviewContent {
  pageTitle: string;
  pageIntro: string;
  /** Shown on every info page – legal/editorial notice */
  disclaimer: string;
  sections: InfoSection[];
}

// ---------------------------------------------------------------------------

export interface ProcessStep {
  id: string;
  order: number;
  title: string;
  description: string;
  sourceRef?: string;
}

export interface ProcessContent {
  pageTitle: string;
  pageIntro: string;
  steps: ProcessStep[];
}

// ---------------------------------------------------------------------------

export interface Argument {
  id: string;
  text: string;
  sourceRef?: string;
}

export interface ArgumentsContent {
  pageTitle: string;
  pageIntro: string;
  /** Editorial note clarifying that arguments are from public debate */
  debateNote: string;
  pro: {
    headline: string;
    arguments: Argument[];
  };
  contra: {
    headline: string;
    arguments: Argument[];
  };
}

// ---------------------------------------------------------------------------

export interface InfoFaqItem {
  id: string;
  question: string;
  answer: string;
  sourceRef?: string;
}

export interface InfoFaqContent {
  pageTitle: string;
  pageIntro: string;
  items: InfoFaqItem[];
}

// ---------------------------------------------------------------------------

export type SourceType = "official" | "media" | "document" | "other";

export interface Source {
  id: string;
  title: string;
  description: string;
  url: string;
  type: SourceType;
  /** ISO date string – when the link was last verified */
  accessedAt?: string;
}

export interface SourcesContent {
  pageTitle: string;
  pageIntro: string;
  sources: Source[];
}
