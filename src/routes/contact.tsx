import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact YouMeQuiz" },
      {
        name: "description",
        content: "Contact YouMeQuiz with questions, feedback, privacy requests or site issues.",
      },
      { property: "og:title", content: "Contact YouMeQuiz" },
      {
        property: "og:description",
        content: "Get in touch with YouMeQuiz about feedback, privacy requests or site issues.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://youmequiz.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://youmequiz.lovable.app/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <AppShell>
      <article className="space-y-5 pt-2 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-3xl font-extrabold text-foreground">Contact YouMeQuiz</h1>
        <p>Questions, feedback, privacy requests and reports about a site problem are welcome.</p>
        <section className="card-soft space-y-2 p-5">
          <h2 className="text-xl text-foreground">Email</h2>
          <p>
            <a
              href="mailto:jerricaalloreal21@gmail.com"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              jerricaalloreal21@gmail.com
            </a>
          </p>
          <p className="text-xs">
            Please do not send questionnaire answers or sensitive medical information.
          </p>
        </section>
      </article>
    </AppShell>
  );
}
