"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { buildQuizResult } from "@/lib/matching";
import { sendAnalyticsEvent } from "@/lib/analytics-client";
import { Button } from "@/components/ui/Button";
import type { QuestionsContent } from "@/types/content";
import type { QuizResult } from "@/types/quiz";

interface ResultsViewProps {
  questionsContent: QuestionsContent;
}

function ScoreGauge({ percent }: { percent: number }) {
  // Clamp to 0-100
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="my-8" aria-label={`Score: ${p} von 100`}>
      {/* Big number */}
      <div className="text-center mb-4">
        <span className="text-7xl font-extrabold text-neutral-900 tabular-nums tracking-tight">
          {p}
        </span>
        <span className="text-2xl font-semibold text-neutral-300 ml-1">/ 100</span>
      </div>

      {/* Scale bar */}
      <div className="relative h-5 bg-neutral-100 rounded-full overflow-hidden">
        <div className="absolute inset-0 score-gradient opacity-30 rounded-full" />
        <div
          className="h-full rounded-full score-gradient transition-all duration-700 ease-out"
          style={{ width: `${p}%` }}
        />
        {/* Midpoint marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/70"
          style={{ left: "50%" }}
          aria-hidden="true"
        />
      </div>
      <div className="flex justify-between text-xs text-neutral-400 mt-2 px-0.5 font-medium">
        <span>dagegen</span>
        <span>neutral</span>
        <span>dafür</span>
      </div>
    </div>
  );
}

export function ResultsView({ questionsContent }: ResultsViewProps) {
  const { answers, relevances, completed, resetQuiz } = useQuiz();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const lastReportedScore = useRef<number | null>(null);

  useEffect(() => {
    if (!completed) {
      router.replace("/fragen");
      return;
    }
    const r = buildQuizResult(answers, relevances, questionsContent.questions);
    setResult(r);
  }, [completed, answers, relevances, questionsContent, router]);

  useEffect(() => {
    if (!result) return;

    const score = result.breakdown.normalizedPercent;
    if (lastReportedScore.current === score) return;

    lastReportedScore.current = score;
    sendAnalyticsEvent({ type: "complete", score });
  }, [result]);

  if (!result) {
    return (
      <div className="text-center py-20" aria-live="polite">
        <p className="text-neutral-500">Ergebnis wird berechnet…</p>
      </div>
    );
  }

  const { breakdown } = result;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Dein Ergebnis</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Auf Basis deiner Antworten haben wir eine Einordnung berechnet.
      </p>

      {/* Score card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm mb-6">
        <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide text-center mb-1">
          Deine Haltung zur Olympia-Bewerbung
        </p>

        <ScoreGauge percent={breakdown.normalizedPercent} />

        <p className="text-center text-lg font-semibold text-neutral-800 capitalize">
          {breakdown.label}
        </p>

        <div className="flex justify-center gap-6 mt-4 text-sm text-neutral-500">
          <span>{breakdown.answeredCount} Fragen beantwortet</span>
          {breakdown.skippedCount > 0 && <span>{breakdown.skippedCount} übersprungen</span>}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 mb-6">
        <span className="font-semibold">Hinweis: </span>
        Dieses Ergebnis ist eine Orientierungshilfe und stellt keine Wahlempfehlung dar. Die
        Berechnung basiert auf deinen Antworten und Gewichtungen.{" "}
        <a href="/methodik" className="underline hover:text-neutral-900">
          Mehr zur Methodik
        </a>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" href="/fragen" className="flex-1">
          Antworten anpassen
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetQuiz();
            router.push("/");
          }}
          className="flex-1"
        >
          Von vorne beginnen
        </Button>
      </div>
    </div>
  );
}
