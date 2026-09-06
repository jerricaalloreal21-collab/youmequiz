import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Sparkles } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

import { QUESTIONNAIRES } from "@/lib/questionnaires";

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
            {
              e: "🧠",
              t: "A pattern, not a label",
              d: "Your report comes from all 20 answers together — never one.",
            },
            {
              e: "📊",
              t: "Clear scale scores",
              d: "0–100 questionnaire scale scores per dimension, plainly explained.",
            },
            {
              e: "🌱",
              t: "Constructive language",
              d: "Self-reflection only. No diagnoses, no pathologising.",
            },
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
        <h2 className="text-xl">More questionnaires</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Five more ways to understand what makes you tick.
        </p>
        <ul className="mt-3 space-y-2.5">
          {QUESTIONNAIRES.map((c) => (
            <li key={c.title} className="card-soft flex items-start gap-3 p-4">
              <span className="text-xl" aria-hidden="true">
                {c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.short}</p>
              </div>
              <Button asChild variant="soft" size="sm">
                <Link to="/quiz/$slug" params={{ slug: c.slug }}>
                  Start
                </Link>
              </Button>
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

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-xl text-foreground">How YouMeQuiz works</h2>
        <p>
          Each questionnaire presents 20 everyday situations with several possible responses. Your
          choices are grouped into clearly named patterns, then summarized in plain language so you
          can reflect on habits that may be easy to miss in the moment.
        </p>
        <p>
          Results are educational and personal to the answers you select. They are not medical
          advice, a mental-health diagnosis, or a guarantee about relationships or compatibility.
          There are no right or wrong results, and you can retake any questionnaire as your
          perspective changes.
        </p>
      </section>

      <footer className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <nav
          className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2"
          aria-label="Site information"
        >
          <Link to="/about">About</Link>
          <Link to="/methodology">Methodology</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        YouMeQuiz is for self-reflection and entertainment. It is not a psychological or medical
        assessment.
      </footer>
    </AppShell>
  );
}
