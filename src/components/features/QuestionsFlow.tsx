"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionCard } from "@/components/features/QuestionCard";
import { Button } from "@/components/ui/Button";
import type { QuestionsContent, AnswerValue, RelevanceValue } from "@/types/content";

interface QuestionsFlowProps {
  questionsContent: QuestionsContent;
}

export function QuestionsFlow({ questionsContent }: QuestionsFlowProps) {
  const { questions } = questionsContent;
  const {
    answers,
    relevances,
    currentQuestion,
    setAnswer,
    setRelevance,
    setCurrentQuestion,
    markCompleted,
  } = useQuiz();
  const router = useRouter();

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 text-lg">Keine Fragen verfügbar.</p>
        <p className="text-sm text-neutral-400 mt-2">
          Bitte prüfe die Datei content/questions.json.
        </p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === questions.length - 1;
  const currentAnswer = answers[question.id] as AnswerValue | undefined;
  const currentRelevance = (relevances[question.id] as RelevanceValue | undefined) ?? "normal";
  const hasAnswer = currentAnswer !== undefined;

  function handleAnswer(answer: AnswerValue) {
    setAnswer(question.id, answer);
  }

  function handleRelevance(relevance: RelevanceValue) {
    setRelevance(question.id, relevance);
  }

  function handleNext() {
    if (isLast) {
      markCompleted();
      router.push("/ergebnis");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function handleBack() {
    if (!isFirst) setCurrentQuestion(currentQuestion - 1);
  }

  return (
    <div>
      <ProgressBar
        current={currentQuestion + 1}
        total={questions.length}
        className="mb-6"
      />

      <QuestionCard
        question={question}
        currentAnswer={currentAnswer}
        currentRelevance={currentRelevance}
        onAnswer={handleAnswer}
        onRelevance={handleRelevance}
      />

      <div className="flex gap-3 mt-4">
        {!isFirst && (
          <Button variant="secondary" onClick={handleBack} className="flex-1">
            ← Zurück
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!hasAnswer}
          className="flex-1"
        >
          {isLast ? "Ergebnis anzeigen" : "Weiter →"}
        </Button>
      </div>

      <p className="text-center text-xs text-neutral-400 mt-3">
        Deine Antworten werden nur lokal in deinem Browser gespeichert.
      </p>
    </div>
  );
}
