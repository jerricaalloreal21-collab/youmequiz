import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — YouMeQuiz" },
      {
        name: "description",
        content: "How YouMeQuiz handles questionnaire answers, cookies and advertising data.",
      },
      { property: "og:title", content: "Privacy Policy — YouMeQuiz" },
      {
        property: "og:description",
        content: "How YouMeQuiz handles answers, cookies and advertising data.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://youmequiz.lovable.app/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://youmequiz.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <AppShell>
      <article className="space-y-5 pt-2 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="text-xs">Last updated: September 4, 2026</p>
        <h2 className="text-xl text-foreground">Questionnaire answers</h2>
        <p>
          You do not need an account to take a questionnaire. Your selections are processed to
          display your result and are not intended to identify you.
        </p>
        <h2 className="text-xl text-foreground">Advertising and cookies</h2>
        <p>
          We may use Google AdSense on eligible content pages. Google and its partners may use
          cookies or similar technologies to deliver, measure and personalize ads, subject to your
          consent choices and applicable law. You can manage personalized advertising through
          Google’s advertising settings.
        </p>
        <h2 className="text-xl text-foreground">Technical information</h2>
        <p>
          Our hosting and service providers may process standard technical data such as IP address,
          browser type, device information, requested pages and timestamps to operate, secure and
          improve the site.
        </p>
        <h2 className="text-xl text-foreground">Your choices</h2>
        <p>
          You may block or delete cookies through your browser. Doing so can affect advertising or
          some site functions.
        </p>
        <h2 className="text-xl text-foreground">Contact</h2>
        <p>
          For privacy questions or requests, visit the{" "}
          <Link to="/contact" className="font-semibold text-primary">
            Contact page
          </Link>
          .
        </p>
      </article>
    </AppShell>
  );
}
