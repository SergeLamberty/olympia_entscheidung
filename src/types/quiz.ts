import type { AnswerValue, RelevanceValue } from "./content";

export type UserAnswers = Record<string, AnswerValue>;
export type UserRelevances = Record<string, RelevanceValue>;

export interface ScoreBreakdown {
  /** Raw weighted sum of answer scores */
  rawScore: number;
  /** Maximum possible score given answered questions */
  maxPossible: number;
  /** Minimum possible score given answered questions */
  minPossible: number;
  /** Normalised to 0–100. 50 = neutral, 0 = fully against, 100 = fully for */
  normalizedPercent: number;
  /** Descriptive label (neutral, no recommendation) */
  label: string;
  answeredCount: number;
  skippedCount: number;
}

export interface QuizResult {
  answers: UserAnswers;
  relevances: UserRelevances;
  breakdown: ScoreBreakdown;
  completedAt: string;
}

// Kept for backward compatibility with ResultCard / info pages
export interface PositionScore {
  positionId: string;
  label: string;
  score: number;
  matchPercent: number;
  color: string;
}
