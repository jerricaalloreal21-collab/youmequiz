import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Questionnaire Methodology — YouMeQuiz" },
      {
        name: "description",
        content: "How YouMeQuiz questions, pattern scores and results are created and interpreted.",
      },
    ],
  }),
  component: Methodology,
});

function Methodology() {
  return (
    <AppShell>
      <article className="space-y-5 pt-2 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-3xl font-extrabold text-foreground">How our questionnaires work</h1>
        <p>
          Each questionnaire contains 20 original, scenario-based questions. Every answer
          contributes to one or more descriptive categories related to the topic. When you finish,
          the site totals those selections and explains the strongest and secondary patterns in your
          responses.
        </p>
        <h2 className="text-xl text-foreground">Reading your result</h2>
        <p>
          A higher category score means you chose more answers associated with that pattern in this
          questionnaire. It is not a percentage of your personality, a clinical measurement, or a
          comparison with other people.
        </p>
        <h2 className="text-xl text-foreground">Limits and responsible use</h2>
        <p>
          Results depend entirely on the responses you select and may change with context, mood or
          life experience. Use them as prompts for reflection and conversation. Do not use a result
          to diagnose yourself or another person or to replace advice from a qualified professional.
        </p>
        <h2 className="text-xl text-foreground">Editorial approach</h2>
        <p>
          We aim for clear, constructive language and avoid presenting any pattern as universally
          good or bad. Questionnaires are reviewed for understandable wording, consistent scoring
          and a complete path from the first question to the result.
        </p>
      </article>
    </AppShell>
  );
}
