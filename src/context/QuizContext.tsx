"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AnswerValue, RelevanceValue } from "@/types/content";
import type { UserAnswers, UserRelevances } from "@/types/quiz";
import { loadState, saveState, clearState } from "@/lib/storage";

interface QuizContextValue {
  answers: UserAnswers;
  relevances: UserRelevances;
  currentQuestion: number;
  completed: boolean;
  completedAt?: string;
  setAnswer: (questionId: string, answer: AnswerValue) => void;
  setRelevance: (questionId: string, relevance: RelevanceValue) => void;
  setCurrentQuestion: (index: number) => void;
  markCompleted: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [relevances, setRelevances] = useState<UserRelevances>({});
  const [currentQuestion, setCurrentQuestionState] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadState();
    setAnswers(stored.answers);
    setRelevances(stored.relevances);
    setCurrentQuestionState(stored.currentQuestion);
    setCompleted(stored.completed);
    setCompletedAt(stored.completedAt);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({ answers, relevances, currentQuestion, completed, completedAt });
  }, [answers, relevances, currentQuestion, completed, completedAt, hydrated]);

  const setAnswer = useCallback((questionId: string, answer: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const setRelevance = useCallback((questionId: string, relevance: RelevanceValue) => {
    setRelevances((prev) => ({ ...prev, [questionId]: relevance }));
  }, []);

  const setCurrentQuestion = useCallback((index: number) => {
    setCurrentQuestionState(index);
  }, []);

  const markCompleted = useCallback(() => {
    setCompleted(true);
    setCompletedAt(new Date().toISOString());
  }, []);

  const resetQuiz = useCallback(() => {
    clearState();
    setAnswers({});
    setRelevances({});
    setCurrentQuestionState(0);
    setCompleted(false);
    setCompletedAt(undefined);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        answers,
        relevances,
        currentQuestion,
        completed,
        completedAt,
        setAnswer,
        setRelevance,
        setCurrentQuestion,
        markCompleted,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
