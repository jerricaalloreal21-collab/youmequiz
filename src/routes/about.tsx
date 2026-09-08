import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About YouMeQuiz — Self-reflection questionnaires" },
      {
        name: "description",
        content:
          "Learn what YouMeQuiz creates and how its self-reflection questionnaires are designed.",
      },
      { property: "og:title", content: "About YouMeQuiz — Self-reflection questionnaires" },
      {
        property: "og:description",
        content: "Who makes YouMeQuiz and how the questionnaires are designed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://youmequiz.lovable.app/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://youmequiz.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  return (
    <AppShell>
      <article className="space-y-5 pt-2 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-3xl font-extrabold text-foreground">About YouMeQuiz</h1>
        <p>
          YouMeQuiz creates approachable questionnaires for people who want to notice their everyday
          patterns more clearly. Our questions focus on familiar choices involving communication,
          stress, closeness, boundaries, conflict and decision-making.
        </p>
        <h2 className="text-xl text-foreground">What we believe</h2>
        <p>
          Self-reflection should feel useful without forcing people into rigid labels. A result is a
          snapshot of the answers you selected today, not a permanent definition of who you are.
        </p>
        <h2 className="text-xl text-foreground">What we are not</h2>
        <p>
          YouMeQuiz is an independent entertainment and educational website. It does not provide
          medical or psychological diagnosis, treatment, professional counseling, or compatibility
          guarantees.
        </p>
        <p>
          <Link to="/methodology" className="font-semibold text-primary">
            Read how the questionnaires work
          </Link>
        </p>
      </article>
    </AppShell>
  );
}
