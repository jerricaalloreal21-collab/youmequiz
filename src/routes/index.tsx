import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Lock, ShieldCheck, Sparkles } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

const COMING_SOON = [
  { emoji: "💗", title: "How Do You Feel Most Loved?", blurb: "The signals that actually land for you." },
  { emoji: "🌩️", title: "What Triggers Your Stress Response?", blurb: "Your personal pressure points, mapped." },
  { emoji: "🧷", title: "What's Your Attachment Style?", blurb: "How you move toward and away from closeness." },
  { emoji: "🚧", title: "How Strong Are Your Boundaries?", blurb: "Where you hold the line — and where you don't." },
  { emoji: "🧭", title: "Which Personality Type Fits You Best?", blurb: "A grounded type read, no horoscope energy." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YouMeQuiz — How well do you really know yourself?" },
      {
        name: "description",
        content:
          "Take the 20-question Personality Patterns questionnaire and get a detailed, non-clinical report on how you handle emotion, conflict, closeness and decisions.",
      },
      { property: "og:title", content: "YouMeQuiz — How well do you really know yourself?" },
      {
        property: "og:description",
        content: "20 scenario questions. One substantive personality pattern report. No login.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://youmequiz.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://youmequiz.lovable.app/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <AppShell>
      <section className="rise-in pt-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          Self-discovery questionnaires
        </div>
        <h1 className="text-[2.5rem] font-extrabold leading-[1.06]">
          How well do you
          <br />
          really <span className="text-warm">know yourself?</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Twenty everyday scenarios. One honest answer each. YouMeQuiz turns your full response
          pattern into a detailed report on how you feel, communicate, handle conflict and decide.
        </p>

        <div className="mt-6">
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to="/quiz">
              Discover My Patterns
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" /> ~4 minutes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" aria-hidden="true" /> 20 questions
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" /> No account
          </span>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Live now</h2>
        <div className="card-soft mt-3 bg-warm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
            Flagship questionnaire
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-primary-foreground">
            Personality Patterns
          </p>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
            20 scenario-based questions scored across 14 behaviour dimensions — empathy, social
            energy, assertiveness, boundaries, regulation and more. You get a pattern title, core
            traits, strengths, blind spots and practical growth notes.
          </p>
          <Button asChild variant="soft" size="pill" className="mt-4 w-full">
            <Link to="/quiz">Start the 20 questions</Link>
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">What you get</h2>
        <div className="mt-3 space-y-2.5">
          {[
            { e: "🧠", t: "A pattern, not a label", d: "Your report comes from all 20 answers together — never one." },
            { e: "📊", t: "Clear scale scores", d: "0–100 questionnaire scale scores per dimension, plainly explained." },
            { e: "🌱", t: "Constructive language", d: "Self-reflection only. No diagnoses, no pathologising." },
          ].map((r, i) => (
            <div
              key={r.t}
              className="card-soft rise-in flex items-start gap-3 p-4"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="text-xl" aria-hidden="true">
                {r.e}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base font-bold">{r.t}</p>
                <p className="text-sm text-muted-foreground">{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Coming soon</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          More self-discovery questionnaires are in the works.
        </p>
        <ul className="mt-3 space-y-2.5">
          {COMING_SOON.map((c) => (
            <li key={c.title} className="card-soft flex items-start gap-3 p-4 opacity-80">
              <span className="text-xl" aria-hidden="true">
                {c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                <Lock className="size-3" aria-hidden="true" />
                Soon
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-soft mt-10 p-5 text-center">
        <p className="font-display text-xl font-bold">Ready to meet your patterns?</p>
        <Button asChild variant="hero" size="pill" className="mt-3 w-full">
          <Link to="/quiz">Discover My Patterns</Link>
        </Button>
      </section>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        YouMeQuiz is for self-reflection and entertainment. It is not a psychological or medical
        assessment.
      </footer>
    </AppShell>
  );
}
