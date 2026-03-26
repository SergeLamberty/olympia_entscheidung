/** 5-point answer scale for quiz questions */
export type AnswerValue =
  | "agree"         // Dafür         (+2)
  | "lean-agree"    // Eher dafür    (+1)
  | "neutral"       // Egal           (0)
  | "lean-disagree" // Eher dagegen  (-1)
  | "disagree"      // Dagegen        (-2)
  | "skip";         // Überspringen   (0, not counted)

/** How important this topic is to the user */
export type RelevanceValue = "important" | "normal" | "low";

export interface SiteNavLink {
  label: string;
  href: string;
}

export interface SiteHero {
  headline: string;
  subheadline: string;
  ctaLabel: string;
}

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
}

export interface SiteMeta {
  title: string;
  description: string;
  siteUrl: string;
  locale: string;
}

export interface SiteContent {
  meta: SiteMeta;
  hero: SiteHero;
  howItWorks: {
    headline: string;
    steps: HowItWorksStep[];
  };
  about: {
    headline: string;
    text: string;
  };
  footer: {
    copyright: string;
    links: SiteNavLink[];
  };
  navigation: {
    links: SiteNavLink[];
  };
}

export interface Question {
  id: string;
  order: number;
  category: string;
  /** The thesis statement shown to the user */
  text: string;
  /** Neutral background context (1–2 sentences) */
  explanation: string;
  /** Which real-world argument underlies this question */
  source_hint: string;
  skippable: boolean;
  /** Relative weight in scoring (default 1) */
  weight: number;
  /** Topic tags for filtering/grouping */
  tags: string[];
  /** How "agree" maps to the score: pro = agree is positive, contra = agree is negative */
  direction: "pro" | "contra";
}

export interface QuestionsContent {
  version: string;
  totalQuestions: number;
  questions: Question[];
}

export interface Position {
  id: string;
  label: string;
  shortDescription: string;
  fullDescription: string;
  color: string;
  answers: Record<string, AnswerValue>;
}

export interface ResultsContent {
  version: string;
  positions: Position[];
  scoreLabels: {
    high: string;
    medium: string;
    low: string;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqContent {
  headline: string;
  intro: string;
  items: FaqItem[];
}
