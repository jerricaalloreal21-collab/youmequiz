import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { QUESTIONS } from "@/lib/quiz/questions";
import { scoreAnswers, type Answers } from "@/lib/quiz/score";
import { buildReport, DISCLAIMER } from "@/lib/quiz/report";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title: "The 20-question pattern questionnaire — YouMeQuiz" },
      {
        name: "description",
        content:
          "Twenty everyday scenarios, one honest answer each. Get a detailed pattern report on how you handle emotion, conflict, closeness and decisions.",
      },
      { property: "og:title", content: "The 20-question pattern questionnaire" },
      {
        property: "og:description",
        content: "Twenty scenarios. One pattern report about how you actually operate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const question = QUESTIONS[Math.min(index, total - 1)]!;

  const report = useMemo(() => (done ? buildReport(scoreAnswers(answers)) : null), [done, answers]);

  function choose(optionId: string) {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    if (index + 1 >= total) setDone(true);
    else setIndex(index + 1);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setDone(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  if (done && report) return <Report report={report} onRestart={restart} />;

  const pct = Math.round((index / total) * 100);

  return (
    <AppShell>
      <section className="rise-in pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>{pct}%</span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-card"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Question ${index + 1} of ${total}`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${Math.max(pct, 4)}%` }}
          />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent">
          {question.scene}
        </p>
        <h1 className="mt-2 text-[1.65rem] font-extrabold leading-tight">{question.prompt}</h1>

        <div className="mt-6 space-y-3">
          {question.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              className="card-soft tap-scale w-full px-4 py-4 text-left text-[15px] leading-snug hover:border-primary"
            >
              {o.text}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </button>
          <span className="text-xs text-muted-foreground">
            No account. Answers stay in your browser.
          </span>
        </div>
      </section>
    </AppShell>
  );
}

function Report({
  report,
  onRestart,
}: {
  report: ReturnType<typeof buildReport>;
  onRestart: () => void;
}) {
  return (
    <AppShell>
      <section className="rise-in pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Your pattern</p>
        <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.08]">{report.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{report.subtitle}</p>

        <Block title="Core traits">
          <ul className="space-y-3">
            {report.coreTraits.map((t) => (
              <li key={t.label}>
                <p className="font-display text-base font-bold">{t.label}</p>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Questionnaire scale scores">
          <p className="mb-3 text-xs text-muted-foreground">
            These are questionnaire scale scores from 0–100 based only on the 20 answers you gave.
            They are not clinical measurements or test results.
          </p>
          <ul className="space-y-3">
            {report.topScores.map((s) => (
              <li key={s.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold">{s.label}</span>
                  <span className="text-xs font-bold text-primary">{s.value}/100</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-card">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(s.value, 2)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.blurb}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Strengths">
          <Bullets items={report.strengths} />
        </Block>
        <Block title="Blind spots">
          <Bullets items={report.blindSpots} />
        </Block>

        <Block title="Emotional pattern">
          <Para>{report.emotionalPattern}</Para>
        </Block>
        <Block title="Communication style">
          <Para>{report.communicationStyle}</Para>
        </Block>
        <Block title="Conflict response">
          <Para>{report.conflictResponse}</Para>
        </Block>
        <Block title="Under stress">
          <Para>{report.underStress}</Para>
        </Block>
        <Block title="Relationship tendencies">
          <Para>{report.relationshipTendencies}</Para>
        </Block>
        <Block title="Decision making">
          <Para>{report.decisionMaking}</Para>
        </Block>
        <Block title="Worth noticing">
          <Bullets items={report.worthNoticing} />
        </Block>
        <Block title="Where there's room to grow">
          <Bullets items={report.growth} />
        </Block>

        <div className="mt-8 flex flex-col gap-3">
          <Button variant="hero" size="xl" className="w-full" onClick={onRestart}>
            <RotateCcw aria-hidden="true" />
            Take it again
          </Button>
          <Button asChild variant="soft" size="xl" className="w-full">
            <Link to="/">Back to home</Link>
          </Button>
        </div>

        <p className="mt-8 rounded-2xl border border-border bg-card/60 p-4 text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
      </section>
    </AppShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="card-soft p-3.5 text-sm leading-relaxed text-muted-foreground">
          {t}
        </li>
      ))}
    </ul>
  );
}
