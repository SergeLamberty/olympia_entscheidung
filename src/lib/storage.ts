"use client";

import type { UserAnswers, UserRelevances } from "@/types/quiz";

const STORAGE_KEY = "wahl-check-state-v2";

export interface StoredState {
  answers: UserAnswers;
  relevances: UserRelevances;
  currentQuestion: number;
  completed: boolean;
  completedAt?: string;
}

const DEFAULT_STATE: StoredState = {
  answers: {},
  relevances: {},
  currentQuestion: 0,
  completed: false,
};

function isAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = "__storage_test__";
    window.localStorage.setItem(k, k);
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function loadState(): StoredState {
  if (!isAvailable()) return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      answers: parsed.answers ?? {},
      relevances: parsed.relevances ?? {},
      currentQuestion: parsed.currentQuestion ?? 0,
      completed: parsed.completed ?? false,
      completedAt: parsed.completedAt,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: StoredState): void {
  if (!isAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("[storage] Could not save state.");
  }
}

export function clearState(): void {
  if (!isAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    // Also clear old key from previous versions
    window.localStorage.removeItem("wahl-check-state");
  } catch {
    console.warn("[storage] Could not clear state.");
  }
}
