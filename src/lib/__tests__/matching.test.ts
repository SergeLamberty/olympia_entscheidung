import {
  calculateScoreBreakdown,
  buildQuizResult,
} from "../matching";

const QUESTIONS = [
  { id: "q1", weight: 1 },
  { id: "q2", weight: 1 },
  { id: "q3", weight: 2 },
];

const QUESTIONS_WITH_DIRECTION = [
  { id: "q1", weight: 1, direction: "pro" as const },
  { id: "q2", weight: 1, direction: "contra" as const },
  { id: "q3", weight: 1, direction: "pro" as const },
];

describe("calculateScoreBreakdown", () => {
  it("calculates a mixed weighted scenario with exact raw, min, max, and percent values", () => {
    const answers = {
      q1: "agree" as const,
      q2: "disagree" as const,
      q3: "lean-agree" as const,
    };
    const relevances = {
      q1: "important" as const,
      q2: "low" as const,
      q3: "normal" as const,
    };

    const result = calculateScoreBreakdown(answers, relevances, QUESTIONS);

    // q1: +2 * 1 * 2   = +4
    // q2: -2 * 1 * 0.5 = -1
    // q3: +1 * 2 * 1   = +2
    // raw = +5, max = 4 + 1 + 4 = 9, min = -9
    // normalized = (5 - (-9)) / (9 - (-9)) * 100 = 14/18 * 100 = 77.78 -> 78
    expect(result.rawScore).toBe(5);
    expect(result.maxPossible).toBe(9);
    expect(result.minPossible).toBe(-9);
    expect(result.normalizedPercent).toBe(78);
  });

  it("calculates the exact midpoint for a balanced mixed scenario", () => {
    const answers = {
      q1: "agree" as const,
      q2: "disagree" as const,
      q3: "neutral" as const,
    };
    const relevances = {
      q1: "low" as const,
      q2: "low" as const,
      q3: "important" as const,
    };

    const result = calculateScoreBreakdown(answers, relevances, QUESTIONS);

    // q1: +2 * 1 * 0.5 = +1
    // q2: -2 * 1 * 0.5 = -1
    // q3:  0 * 2 * 2   =  0
    // raw = 0, max = 1 + 1 + 8 = 10, min = -10
    expect(result.rawScore).toBe(0);
    expect(result.maxPossible).toBe(10);
    expect(result.minPossible).toBe(-10);
    expect(result.normalizedPercent).toBe(50);
  });

  it("returns 50 when all questions are skipped", () => {
    const result = calculateScoreBreakdown({}, {}, QUESTIONS);
    expect(result.normalizedPercent).toBe(50);
    expect(result.answeredCount).toBe(0);
    expect(result.skippedCount).toBe(3);
  });

  it("returns 100 when all answers are 'agree' with normal relevance", () => {
    const answers = { q1: "agree" as const, q2: "agree" as const, q3: "agree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS);
    expect(result.normalizedPercent).toBe(100);
  });

  it("returns 0 when all answers are 'disagree' with normal relevance", () => {
    const answers = { q1: "disagree" as const, q2: "disagree" as const, q3: "disagree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS);
    expect(result.normalizedPercent).toBe(0);
  });

  it("returns 50 when all answers are 'neutral'", () => {
    const answers = { q1: "neutral" as const, q2: "neutral" as const, q3: "neutral" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS);
    expect(result.normalizedPercent).toBe(50);
  });

  it("doubles the contribution of 'important' questions", () => {
    const answers = { q1: "agree" as const, q2: "skip" as const, q3: "skip" as const };
    const normalResult = calculateScoreBreakdown(answers, { q1: "normal" }, QUESTIONS);
    const importantResult = calculateScoreBreakdown(answers, { q1: "important" }, QUESTIONS);
    // Both should be 100% since it's the only answered question
    expect(normalResult.normalizedPercent).toBe(100);
    expect(importantResult.normalizedPercent).toBe(100);
    // But raw score should differ
    expect(importantResult.rawScore).toBe(normalResult.rawScore * 2);
  });

  it("halves the contribution of 'low' questions", () => {
    const answers = { q1: "agree" as const, q2: "skip" as const, q3: "skip" as const };
    const normalResult = calculateScoreBreakdown(answers, { q1: "normal" }, QUESTIONS);
    const lowResult = calculateScoreBreakdown(answers, { q1: "low" }, QUESTIONS);
    expect(normalResult.normalizedPercent).toBe(100);
    expect(lowResult.normalizedPercent).toBe(100);
    expect(lowResult.rawScore).toBe(normalResult.rawScore / 2);
  });

  it("handles mixed answers correctly", () => {
    const answers = { q1: "agree" as const, q2: "disagree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS);
    // q1: +2*1=+2, q2: -2*1=-2 → raw=0, max=4, min=-4 → (0-(-4))/(4-(-4))=4/8=50%
    expect(result.normalizedPercent).toBe(50);
    expect(result.rawScore).toBe(0);
  });

  it("applies question weight correctly (q3 has weight 2)", () => {
    const answers = { q3: "agree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS);
    // q3: +2 * weight(2) * relevance(1) = +4, max=+4, min=-4 → (4-(-4))/(4-(-4))=100%
    expect(result.normalizedPercent).toBe(100);
    expect(result.rawScore).toBe(4);
    expect(result.answeredCount).toBe(1);
    expect(result.skippedCount).toBe(2);
  });

  it("lean-agree and lean-disagree are halfway points", () => {
    const allLeanAgree = { q1: "lean-agree" as const, q2: "lean-agree" as const, q3: "lean-agree" as const };
    const result = calculateScoreBreakdown(allLeanAgree, {}, QUESTIONS);
    // All lean-agree: +1 each (weighted), normalized = 75%
    expect(result.normalizedPercent).toBe(75);
  });

  it("result label is descriptive and not empty", () => {
    const result = calculateScoreBreakdown(
      { q1: "agree" as const },
      {},
      QUESTIONS
    );
    expect(result.label).toBeTruthy();
    expect(typeof result.label).toBe("string");
  });

  it("buildQuizResult includes completedAt timestamp", () => {
    const result = buildQuizResult({}, {}, QUESTIONS);
    expect(result.completedAt).toBeTruthy();
    expect(new Date(result.completedAt).getTime()).not.toBeNaN();
  });

  it("score is always between 0 and 100", () => {
    const extremes = [
      { q1: "agree" as const, q2: "agree" as const, q3: "agree" as const },
      { q1: "disagree" as const, q2: "disagree" as const, q3: "disagree" as const },
    ];
    for (const answers of extremes) {
      const r = calculateScoreBreakdown(answers, {}, QUESTIONS);
      expect(r.normalizedPercent).toBeGreaterThanOrEqual(0);
      expect(r.normalizedPercent).toBeLessThanOrEqual(100);
    }
  });

  // --- Direction tests ---

  it("contra question with agree should decrease score (not increase)", () => {
    // q2 is contra: agree on contra should invert to -2, giving 0%
    const answers = { q2: "agree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS_WITH_DIRECTION);
    // contra agree: baseScore=2, directed=-2, raw=-2, max=2, min=-2 → (-2-(-2))/(2-(-2))=0/4=0%
    expect(result.normalizedPercent).toBe(0);
  });

  it("mixed pro/contra questions cancel out correctly", () => {
    // q1 (pro) agree = +2, q2 (contra) agree = -2 → raw=0 → 50%
    const answers = { q1: "agree" as const, q2: "agree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS_WITH_DIRECTION);
    expect(result.normalizedPercent).toBe(50);
    expect(result.rawScore).toBe(0);
  });

  it("all-contra agree should give 0%", () => {
    const allContra = [
      { id: "c1", weight: 1, direction: "contra" as const },
      { id: "c2", weight: 1, direction: "contra" as const },
    ];
    const answers = { c1: "agree" as const, c2: "agree" as const };
    const result = calculateScoreBreakdown(answers, {}, allContra);
    // Both contra agree: directed = -2 each, raw=-4, max=4, min=-4 → (-4-(-4))/(4-(-4))=0/8=0%
    expect(result.normalizedPercent).toBe(0);
  });

  it("handles mixed pro and contra questions with different relevances exactly", () => {
    const answers = {
      q1: "lean-agree" as const,
      q2: "lean-disagree" as const,
      q3: "disagree" as const,
    };
    const relevances = {
      q1: "important" as const,
      q2: "low" as const,
      q3: "normal" as const,
    };

    const result = calculateScoreBreakdown(answers, relevances, QUESTIONS_WITH_DIRECTION);

    // q1 pro:    +1 * 1 * 2   = +2
    // q2 contra: -1 -> invert = +1; +1 * 1 * 0.5 = +0.5
    // q3 pro:    -2 * 1 * 1   = -2
    // raw = 0.5, max = 4 + 1 + 2 = 7, min = -7
    // normalized = (0.5 - (-7)) / (7 - (-7)) * 100 = 7.5/14 * 100 = 53.57 -> 54
    expect(result.rawScore).toBe(0.5);
    expect(result.maxPossible).toBe(7);
    expect(result.minPossible).toBe(-7);
    expect(result.normalizedPercent).toBe(54);
  });

  it("direction undefined defaults to pro behavior", () => {
    // QUESTIONS has no direction field → should default to pro
    const answers = { q1: "agree" as const };
    const result = calculateScoreBreakdown(answers, {}, QUESTIONS);
    expect(result.normalizedPercent).toBe(100);
  });
});
