import { QUESTIONNAIRES, questionnaireBySlug, scoreQuestionnaire } from "@/lib/questionnaires";
import { QUESTIONS } from "@/lib/quiz/questions";
import { DIMENSIONS, DIMENSION_ORDER } from "@/lib/quiz/dimensions";
import { scoreAnswers } from "@/lib/quiz/score";
import { buildReport, DISCLAIMER } from "@/lib/quiz/report";

export const PERSONALITY_SLUG = "personality-patterns";

export interface CatalogEntry {
  slug: string;
  title: string;
  summary: string;
  questionCount: number;
  path: string;
}

export function listQuestionnaires(): CatalogEntry[] {
  return [
    {
      slug: PERSONALITY_SLUG,
      title: "Personality Patterns",
      summary:
        "20 scenario questions scored across 14 non-clinical behaviour dimensions, producing a detailed pattern report.",
      questionCount: QUESTIONS.length,
      path: "/quiz",
    },
    ...QUESTIONNAIRES.map((q) => ({
      slug: q.slug,
      title: q.title,
      summary: q.short,
      questionCount: q.questions.length,
      path: `/quiz/${q.slug}`,
    })),
  ];
}

export function getQuestions(slug: string) {
  if (slug === PERSONALITY_SLUG) {
    return {
      slug,
      title: "Personality Patterns",
      intro: "Pick the option closest to what you would actually do, not what sounds best.",
      answerFormat:
        "Answers are a map of question id -> option id, e.g. { \"q1\": \"a\", \"q2\": \"c\" }.",
      questions: QUESTIONS.map((q) => ({
        id: q.id,
        scene: q.scene,
        prompt: q.prompt,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      })),
    };
  }
  const quiz = questionnaireBySlug(slug);
  if (!quiz) return null;
  return {
    slug: quiz.slug,
    title: quiz.title,
    intro: quiz.intro,
    answerFormat:
      "Answers are a map of question index (0-based, as a string) -> chosen option category key.",
    questions: quiz.questions.map((q, i) => ({
      id: String(i),
      prompt: q.prompt,
      options: q.choices.map((c) => ({ id: c.category, text: c.text })),
    })),
  };
}

export function scoreQuestionnaireBySlug(slug: string, answers: Record<string, string>) {
  if (slug === PERSONALITY_SLUG) {
    const scores = scoreAnswers(answers);
    const report = buildReport(scores);
    return {
      slug,
      answered: Object.keys(answers).length,
      totalQuestions: QUESTIONS.length,
      scaleScores: DIMENSION_ORDER.map((k) => ({
        key: k,
        label: DIMENSIONS[k].label,
        scaleScore: scores[k].value,
        band: scores[k].band,
      })),
      report,
      disclaimer: DISCLAIMER,
    };
  }
  const quiz = questionnaireBySlug(slug);
  if (!quiz) return null;
  const indexed: Record<number, string> = {};
  for (const [k, v] of Object.entries(answers)) {
    const i = Number(k);
    if (Number.isInteger(i)) indexed[i] = v;
  }
  const result = scoreQuestionnaire(quiz, indexed);
  return {
    slug: quiz.slug,
    answered: Object.keys(indexed).length,
    totalQuestions: quiz.questions.length,
    scaleScores: Object.entries(result.totals).map(([key, value]) => ({
      key,
      label: quiz.categories[key]?.title ?? key,
      scaleScore: value,
      outOf: quiz.questions.length,
    })),
    primary: result.primary,
    secondary: result.secondary,
    disclaimer: DISCLAIMER,
  };
}

export function listDimensions() {
  return DIMENSION_ORDER.map((k) => ({
    key: k,
    label: DIMENSIONS[k].label,
    describes: DIMENSIONS[k].blurb,
  }));
}
