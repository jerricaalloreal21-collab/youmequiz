import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { questionnaireBySlug, scoreQuestionnaire, type Questionnaire } from "@/lib/questionnaires";

export const Route = createFileRoute("/quiz/$slug")({
  loader: ({ params }) => {
    const quiz = questionnaireBySlug(params.slug);
    if (!quiz) throw notFound();
    return quiz;
  },
  head: ({ params, loaderData }) => {
    const title = `${loaderData?.title ?? "Questionnaire"} — 20 Questions — YouMeQuiz`;
    const description =
      loaderData?.short ??
      "A free 20-question YouMeQuiz questionnaire with an instant pattern report.";
    const url = `https://youmequiz.lovable.app/quiz/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: loaderData?.title ?? "Questionnaire",
            description,
            url,
            numberOfQuestions: loaderData?.questions?.length ?? 20,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://youmequiz.lovable.app/",
              },
              { "@type": "ListItem", position: 2, name: loaderData?.title ?? "Questionnaire", item: url },
            ],
          }),
        },
      ],
    };
  },
  component: QuestionnairePage,
});

function QuestionnairePage() {
  const quiz = Route.useLoaderData();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const result = useMemo(
    () => (done ? scoreQuestionnaire(quiz, answers) : null),
    [done, quiz, answers],
  );
  function choose(category: string) {
    const next = { ...answers, [index]: category };
    setAnswers(next);
    if (index === quiz.questions.length - 1) setDone(true);
    else setIndex(index + 1);
  }
  function restart() {
    setAnswers({});
    setIndex(0);
    setDone(false);
    window.scrollTo({ top: 0 });
  }
  if (done && result) return <Result quiz={quiz} result={result} restart={restart} />;
  const question = quiz.questions[index]!;
  const pct = Math.round((index / quiz.questions.length) * 100);
  return (
    <AppShell>
      <section className="rise-in pt-2">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" /> All questionnaires
        </Link>
        <div className="mt-5 flex justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Question {index + 1} of {quiz.questions.length}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-card">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.max(pct, 4)}%` }}
          />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent">
          {quiz.emoji} {quiz.title}
        </p>
        {index === 0 && <p className="mt-2 text-sm text-muted-foreground">{quiz.intro}</p>}
        <h1 className="mt-3 text-[1.65rem] font-extrabold leading-tight">{question.prompt}</h1>
        <div className="mt-6 space-y-3">
          {question.choices.map((c, i) => (
            <button
              key={`${c.category}-${i}`}
              onClick={() => choose(c.category)}
              className="card-soft tap-scale w-full px-4 py-4 text-left text-[15px] leading-snug hover:border-primary"
            >
              {c.text}
            </button>
          ))}
        </div>
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-40"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
      </section>
    </AppShell>
  );
}

function Result({
  quiz,
  result,
  restart,
}: {
  quiz: Questionnaire;
  result: ReturnType<typeof scoreQuestionnaire>;
  restart: () => void;
}) {
  const max = quiz.questions.length;
  return (
    <AppShell>
      <section className="rise-in pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {quiz.emoji} Your result
        </p>
        <h1 className="mt-2 text-[2.15rem] font-extrabold leading-tight">{result.primary.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          {result.primary.summary}
        </p>
        <section className="mt-8">
          <h2 className="text-lg">Your strongest patterns</h2>
          <div className="mt-3 space-y-3">
            {Object.entries(result.totals)
              .sort((a, b) => b[1] - a[1])
              .map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{quiz.categories[key]?.title ?? key}</span>
                    <span className="text-primary">
                      {value}/{max}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-card">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
        <Block title="What this gives you">
          <ul className="space-y-2">
            {(result.primary.strengths ?? []).map((x) => (
              <li key={x} className="card-soft p-3.5 text-sm text-muted-foreground">
                {x}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Your secondary pattern">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <b>{result.secondary.title}:</b> {result.secondary.summary} Your result is a blend, so
            this pattern may show up in certain people or situations.
          </p>
        </Block>
        <Block title="Worth watching">
          <p className="text-sm leading-relaxed text-muted-foreground">{result.primary.watch}</p>
        </Block>
        <Block title="Try this">
          <p className="card-soft p-4 text-sm leading-relaxed text-muted-foreground">
            {result.primary.tip}
          </p>
        </Block>
        <div className="mt-8 flex flex-col gap-3">
          <Button variant="hero" size="xl" onClick={restart}>
            <RotateCcw /> Take it again
          </Button>
          <Button asChild variant="soft" size="xl">
            <Link to="/">Choose another questionnaire</Link>
          </Button>
        </div>
        <p className="mt-8 rounded-2xl border border-border bg-card/60 p-4 text-xs leading-relaxed text-muted-foreground">
          YouMeQuiz is for self-reflection and entertainment. Results describe only your answers and
          are not a diagnosis, clinical assessment, or compatibility guarantee.
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
