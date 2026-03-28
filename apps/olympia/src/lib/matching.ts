import type { AnswerValue, RelevanceValue } from "@/types/content";
import type { UserAnswers, UserRelevances, ScoreBreakdown, QuizResult } from "@/types/quiz";

/** Numerical value assigned to each answer option */
const ANSWER_SCORE: Record<AnswerValue, number> = {
  agree: 2,
  "lean-agree": 1,
  neutral: 0,
  "lean-disagree": -1,
  disagree: -2,
  skip: 0,
};

/** Weight multiplier for relevance */
const RELEVANCE_WEIGHT: Record<RelevanceValue, number> = {
  important: 2,
  normal: 1,
  low: 0.5,
};

/** Descriptive label bands (neutral, non-recommending) */
function scoreLabel(percent: number): string {
  if (percent >= 70) return "deutlich zustimmend";
  if (percent >= 57) return "eher zustimmend";
  if (percent >= 43) return "ausgewogen";
  if (percent >= 30) return "eher ablehnend";
  return "deutlich ablehnend";
}

export function calculateScoreBreakdown(
  userAnswers: UserAnswers,
  userRelevances: UserRelevances,
  questions: Array<{ id: string; weight: number; direction?: "pro" | "contra" }>
): ScoreBreakdown {
  let rawScore = 0;
  let maxPossible = 0;
  let minPossible = 0;
  let answeredCount = 0;
  let skippedCount = 0;

  for (const q of questions) {
    const answer = userAnswers[q.id] ?? "skip";
    const relevance: RelevanceValue = userRelevances[q.id] ?? "normal";
    const weight = (q.weight ?? 1) * RELEVANCE_WEIGHT[relevance];

    if (answer === "skip") {
      skippedCount++;
      continue;
    }

    answeredCount++;
    const baseScore = ANSWER_SCORE[answer];
    const directedScore = q.direction === "contra" ? -baseScore : baseScore;
    rawScore += directedScore * weight;
    maxPossible += 2 * weight;
    minPossible -= 2 * weight;
  }

  // Guard: no answered questions → neutral
  if (maxPossible === minPossible) {
    return {
      rawScore: 0,
      maxPossible: 0,
      minPossible: 0,
      normalizedPercent: 50,
      label: "ausgewogen",
      answeredCount,
      skippedCount,
    };
  }

  const normalizedPercent = Math.round(
    ((rawScore - minPossible) / (maxPossible - minPossible)) * 100
  );

  return {
    rawScore,
    maxPossible,
    minPossible,
    normalizedPercent,
    label: scoreLabel(normalizedPercent),
    answeredCount,
    skippedCount,
  };
}

export function buildQuizResult(
  userAnswers: UserAnswers,
  userRelevances: UserRelevances,
  questions: Array<{ id: string; weight: number; direction?: "pro" | "contra" }>
): QuizResult {
  return {
    answers: userAnswers,
    relevances: userRelevances,
    breakdown: calculateScoreBreakdown(userAnswers, userRelevances, questions),
    completedAt: new Date().toISOString(),
  };
}

// Keep getScoreLabel exported for backward compat
export function getScoreLabel(percent: number): string {
  return scoreLabel(percent);
}
