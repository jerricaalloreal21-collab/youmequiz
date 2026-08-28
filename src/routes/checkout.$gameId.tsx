import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CreditCard, Loader2, RotateCcw, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { EDITIONS } from "@/lib/game/copy";
import { createSquareCheckout } from "@/lib/payments/square.functions";
import type { CheckoutResult } from "@/lib/payments/square.handlers";

export const Route = createFileRoute("/checkout/$gameId")({
  head: () => ({
    meta: [
      { title: "Checkout — YouMeQuiz" },
      {
        name: "description",
        content:
          "Unlock the Full Game or Memory Edition for your personalized quiz with a secure one-time payment.",
      },
      { property: "og:title", content: "Unlock your quiz — YouMeQuiz" },
      { property: "og:description", content: "One-time payment. No account. Instant unlock." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { gameId } = Route.useParams();
  const navigate = useNavigate();
  const start = useServerFn(createSquareCheckout);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    start({ data: { gameId } })
      .then((res) => {
        if (cancelled) return;
        setResult(res);
        if (res.status === "unlocked") {
          navigate({ to: "/share/$gameId", params: { gameId } });
        } else if (res.status === "redirect") {
          window.location.href = res.url;
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error", message: "Checkout is unavailable right now." });
      });
    return () => {
      cancelled = true;
    };
  }, [gameId, attempt, start, navigate]);

  return (
    <AppShell>
      <div className="mt-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/share/$gameId" params={{ gameId }}>
            <ArrowLeft aria-hidden="true" /> Back to your quiz
          </Link>
        </Button>
      </div>

      {(!result || result.status === "redirect" || result.status === "unlocked") && (
        <div className="card-soft mt-6 p-6 text-center" aria-live="polite">
          <Loader2 className="mx-auto size-6 animate-spin text-primary" aria-hidden="true" />
          <h1 className="mt-3 text-2xl">Opening secure checkout…</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Square handles the payment. We never see or store your card details.
          </p>
          {result?.status === "redirect" && (
            <Button asChild variant="hero" size="pill" className="mt-4 w-full">
              <a href={result.url}>
                <CreditCard aria-hidden="true" /> Continue to Square
              </a>
            </Button>
          )}
        </div>
      )}

      {result?.status === "not-configured" && (
        <div className="card-soft mt-6 p-6">
          <h1 className="text-2xl">Checkout isn't switched on yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Square sandbox credentials haven't been added to this project yet, so payments can't run.
            Your quiz is saved and still playable as the free edition.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {result.missing.map((name) => (
              <li key={name}>
                <code className="text-xs font-semibold">{name}</code>
              </li>
            ))}
          </ul>
          <Button asChild variant="hero" size="pill" className="mt-4 w-full">
            <Link to="/share/$gameId" params={{ gameId }}>
              Share the free version
            </Link>
          </Button>
        </div>
      )}

      {result?.status === "error" && (
        <div className="card-soft mt-6 p-6">
          <h1 className="text-2xl">We couldn't start checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
          <Button
            variant="soft"
            size="pill"
            className="mt-4 w-full"
            onClick={() => setAttempt((a) => a + 1)}
          >
            <RotateCcw aria-hidden="true" /> Try again
          </Button>
          <Button asChild variant="ghost" size="pill" className="mt-2 w-full">
            <Link to="/share/$gameId" params={{ gameId }}>
              Continue with the free edition
            </Link>
          </Button>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Sandbox mode: payments are simulated with Square test cards. Editions unlock only after our
        server confirms the payment with Square — {EDITIONS.full.label} {EDITIONS.full.price} ·{" "}
        {EDITIONS.memory.label} {EDITIONS.memory.price}.
      </p>
    </AppShell>
  );
}
