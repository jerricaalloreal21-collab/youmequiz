import { DIMENSION_ORDER, DIMENSIONS, type DimensionKey } from "./dimensions";
import { QUESTIONS, type QuizQuestion } from "./questions";

export type Answers = Record<string, string>;

export interface DimensionScore {
  key: DimensionKey;
  label: string;
  blurb: string;
  /** 0-100 questionnaire scale score, normalized by the items that touch it. */
  value: number;
  band: "low" | "mid" | "high";
  items: number;
}

export type ScoreMap = Record<DimensionKey, DimensionScore>;

function bandFor(value: number): DimensionScore["band"] {
  if (value >= 66) return "high";
  if (value <= 34) return "low";
  return "mid";
}

/**
 * Each dimension is normalized against the minimum and maximum total it could
 * have received from the questions that actually contribute to it, so
 * dimensions covered by few items are not under- or over-weighted.
 */
export function scoreAnswers(answers: Answers, questions: QuizQuestion[] = QUESTIONS): ScoreMap {
  const raw = {} as Record<
    DimensionKey,
    { actual: number; min: number; max: number; items: number }
  >;
  for (const key of DIMENSION_ORDER) raw[key] = { actual: 0, min: 0, max: 0, items: 0 };

  for (const question of questions) {
    const chosen = question.options.find((o) => o.id === answers[question.id]);
    if (!chosen) continue;
    for (const key of DIMENSION_ORDER) {
      const values = question.options.map((o) => o.scores[key] ?? 0);
      const max = Math.max(...values);
      const min = Math.min(...values);
      if (max === 0 && min === 0) continue;
      raw[key].items += 1;
      raw[key].max += max;
      raw[key].min += min;
      raw[key].actual += chosen.scores[key] ?? 0;
    }
  }

  const out = {} as ScoreMap;
  for (const key of DIMENSION_ORDER) {
    const { actual, min, max, items } = raw[key];
    const span = max - min;
    const value = span > 0 ? Math.round(((actual - min) / span) * 100) : 50;
    out[key] = {
      key,
      label: DIMENSIONS[key].label,
      blurb: DIMENSIONS[key].blurb,
      value: Math.max(0, Math.min(100, value)),
      band: bandFor(value),
      items,
    };
  }
  return out;
}

export function sortedByStrength(scores: ScoreMap): DimensionScore[] {
  return DIMENSION_ORDER.map((k) => scores[k]).sort((a, b) => b.value - a.value);
}

/** Dimensions furthest from the middle, i.e. most defining of the pattern. */
export function mostDistinctive(scores: ScoreMap): DimensionScore[] {
  return DIMENSION_ORDER.map((k) => scores[k]).sort(
    (a, b) => Math.abs(b.value - 50) - Math.abs(a.value - 50),
  );
}

export function isComplete(answers: Answers, questions: QuizQuestion[] = QUESTIONS): boolean {
  return questions.every((q) => Boolean(answers[q.id]));
}
