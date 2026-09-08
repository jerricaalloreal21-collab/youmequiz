import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — YouMeQuiz" },
      {
        name: "description",
        content: "Terms governing use of the YouMeQuiz website and questionnaire results.",
      },
      { property: "og:title", content: "Terms of Use — YouMeQuiz" },
      {
        property: "og:description",
        content: "The terms that govern use of YouMeQuiz and its questionnaire results.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://youmequiz.lovable.app/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://youmequiz.lovable.app/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <AppShell>
      <article className="space-y-5 pt-2 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-3xl font-extrabold text-foreground">Terms of Use</h1>
        <p className="text-xs">Last updated: September 4, 2026</p>
        <h2 className="text-xl text-foreground">Informational use</h2>
        <p>
          YouMeQuiz provides questionnaires for personal reflection, education and entertainment.
          Results are not professional advice, diagnoses, treatment recommendations or guarantees.
        </p>
        <h2 className="text-xl text-foreground">Your responsibility</h2>
        <p>
          You are responsible for how you interpret and use a result. Seek an appropriately
          qualified professional for medical, mental-health, legal or other professional guidance.
        </p>
        <h2 className="text-xl text-foreground">Acceptable use</h2>
        <p>
          Do not misuse the site, attempt to disrupt its operation, access it unlawfully, or
          reproduce substantial parts of its original questions and results without permission.
        </p>
        <h2 className="text-xl text-foreground">Availability</h2>
        <p>
          We may revise questionnaires, results or these terms and may change or discontinue
          features. The site is provided as available without a promise that every feature will
          always be uninterrupted or error-free.
        </p>
        <h2 className="text-xl text-foreground">Contact</h2>
        <p>
          Questions about these terms can be sent through the{" "}
          <Link to="/contact" className="font-semibold text-primary">
            Contact page
          </Link>
          .
        </p>
      </article>
    </AppShell>
  );
}
