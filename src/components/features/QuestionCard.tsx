"use client";

import { Card } from "@/components/ui/Card";
import type { Question, AnswerValue, RelevanceValue } from "@/types/content";

interface QuestionCardProps {
  question: Question;
  currentAnswer?: AnswerValue;
  currentRelevance?: RelevanceValue;
  onAnswer: (answer: AnswerValue) => void;
  onRelevance: (relevance: RelevanceValue) => void;
}

const ANSWER_OPTIONS: Array<{
  value: AnswerValue;
  label: string;
  icon: string;
  activeClass: string;
}> = [
  { value: "agree",         label: "Dafür",        icon: "👍", activeClass: "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm" },
  { value: "lean-agree",    label: "Eher dafür",   icon: "🤔", activeClass: "border-emerald-400 bg-emerald-50 text-emerald-800" },
  { value: "neutral",       label: "Egal",         icon: "😐", activeClass: "border-neutral-400 bg-neutral-100 text-neutral-800" },
  { value: "lean-disagree", label: "Eher dagegen", icon: "🤨", activeClass: "border-rose-400 bg-rose-50 text-rose-800" },
  { value: "disagree",      label: "Dagegen",      icon: "👎", activeClass: "border-rose-600 bg-rose-50 text-rose-900 shadow-sm" },
];

const RELEVANCE_OPTIONS: Array<{
  value: RelevanceValue;
  label: string;
  activeClass: string;
}> = [
  { value: "low",       label: "Unwichtig",  activeClass: "border-sky-400 bg-sky-50 text-sky-800 shadow-sm" },
  { value: "normal",    label: "Neutral",    activeClass: "border-neutral-400 bg-neutral-100 text-neutral-700" },
  { value: "important", label: "Wichtig",    activeClass: "border-primary-500 bg-primary-50 text-primary-800" },
];

export function QuestionCard({
  question,
  currentAnswer,
  currentRelevance = "normal",
  onAnswer,
  onRelevance,
}: QuestionCardProps) {
  return (
    <Card className="mb-4">
      {/* Category */}
      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
        {question.category}
      </p>

      {/* Thesis */}
      <p className="text-base sm:text-lg font-semibold text-neutral-900 leading-snug mb-4">
        {question.text}
      </p>

      {/* Background context (collapsible) */}
      {question.explanation && (
        <details className="mb-5 group">
          <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700 list-none flex items-center gap-1 select-none">
            <span className="group-open:hidden">▶</span>
            <span className="hidden group-open:inline">▼</span>
            Hintergrund
          </summary>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed border-l-2 border-neutral-200 pl-3">
            {question.explanation}
          </p>
        </details>
      )}

      {/* ── Answer options ── */}
      <fieldset>
        <legend className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
          Deine Haltung zu dieser Aussage
        </legend>
        <div className="flex flex-col gap-2">
          {ANSWER_OPTIONS.map((opt) => {
            const isActive = currentAnswer === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAnswer(opt.value)}
                className={[
                  "w-full min-h-[48px] px-4 py-3 rounded-xl border-2 text-sm font-medium",
                  "transition-all duration-150 text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                  isActive
                    ? opt.activeClass
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <span className="mr-2" aria-hidden="true">{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}

          {question.skippable && (
            <button
              type="button"
              onClick={() => onAnswer("skip")}
              className={[
                "text-sm text-neutral-400 hover:text-neutral-600 text-center py-2 rounded",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                currentAnswer === "skip" ? "text-neutral-600 underline" : "",
              ].join(" ")}
              aria-pressed={currentAnswer === "skip"}
            >
              Überspringen
            </button>
          )}
        </div>
      </fieldset>

      {/* ── Relevance selector ── */}
      <div className="mt-5 pt-4 border-t border-neutral-100">
        <fieldset>
          <legend className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            Wie wichtig ist dir dieses Thema?
          </legend>
          <div className="flex gap-2">
            {RELEVANCE_OPTIONS.map((opt) => {
              const isActive = currentRelevance === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onRelevance(opt.value)}
                  className={[
                    "flex-1 min-h-[40px] px-2 py-2 rounded-lg border-2 text-xs font-semibold",
                    "transition-all duration-150 text-center",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                    isActive
                      ? opt.activeClass
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </Card>
  );
}
