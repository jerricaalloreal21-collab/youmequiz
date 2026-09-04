import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — YouMeQuiz" },
      {
        name: "description",
        content: "Terms governing use of the YouMeQuiz website and questionnaire results.",
      },
    ],
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
      </article>
    </AppShell>
  );
}
