import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Play, RotateCcw, Share2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { verifySquarePayment } from "@/lib/payments/square.functions";
import type { VerifyResult } from "@/lib/payments/square.handlers";

export const Route = createFileRoute("/pay/$gameId")({
  head: () => ({
    meta: [
      { title: "Payment status — YouMeQuiz" },
      {
        name: "description",
        content: "Confirming your YouMeQuiz payment and unlocking your premium edition.",
      },
      { property: "og:title", content: "Payment status — YouMeQuiz" },
      { property: "og:description", content: "Verifying your one-time payment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PayReturnPage,
});

function PayReturnPage() {
  const { gameId } = Route.useParams();
  const verify = useServerFn(verifySquarePayment);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [checking, setChecking] = useState(true);

  const run = useCallback(async () => {
    setChecking(true);
    let last: VerifyResult = { status: "pending" };
    for (let i = 0; i < 4; i++) {
      try {
        last = await verify({ data: { gameId } });
      } catch {
        last = { status: "error", message: "We couldn't reach the payment service." };
      }
      if (last.status !== "pending") break;
      await new Promise((r) => setTimeout(r, 1500));
    }
    setResult(last);
    setChecking(false);
  }, [gameId, verify]);

  useEffect(() => {
    void run();
  }, [run]);

  if (checking) {
    return (
      <AppShell>
        <div className="card-soft mt-10 p-6 text-center" aria-live="polite">
          <Loader2 className="mx-auto size-6 animate-spin text-primary" aria-hidden="true" />
          <h1 className="mt-3 text-2xl">Confirming your payment…</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We're checking with Square before unlocking anything. This takes a few seconds.
          </p>
        </div>
      </AppShell>
    );
  }

  const unlocked = result?.status === "paid" || result?.status === "free";

  return (
    <AppShell>
      <div className="card-soft mt-8 p-6 text-center">
        {unlocked ? (
          <>
            <CheckCircle2 className="mx-auto size-8 text-primary" aria-hidden="true" />
            <h1 className="mt-3 text-2xl">
              {result?.status === "paid" ? "Payment confirmed" : "Your quiz is ready"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {result?.status === "paid"
                ? "Your premium edition is unlocked. Send the link whenever you're ready."
                : "This quiz is on the free edition — nothing to pay."}
            </p>
          </>
        ) : result?.status === "not-configured" ? (
          <>
            <h1 className="text-2xl">Checkout isn't switched on yet</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Square sandbox credentials are missing, so nothing was charged or verified. Your quiz
              is saved as the free edition.
            </p>
          </>
        ) : result?.status === "error" ? (
          <>
            <h1 className="text-2xl">We couldn't confirm the payment</h1>
            <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl">No payment came through</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Looks like checkout was cancelled or is still processing. Nothing was charged. Your
              quiz is saved and playable as the free edition.
            </p>
          </>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          {!unlocked && (
            <>
              <Button variant="hero" size="pill" className="w-full" onClick={() => void run()}>
                <RotateCcw aria-hidden="true" /> Check again
              </Button>
              <Button asChild variant="soft" size="pill" className="w-full">
                <Link to="/checkout/$gameId" params={{ gameId }}>
                  Try the payment again
                </Link>
              </Button>
            </>
          )}
          <Button asChild variant={unlocked ? "hero" : "ghost"} size="pill" className="w-full">
            <Link to="/share/$gameId" params={{ gameId }}>
              <Share2 aria-hidden="true" /> Go to your share link
            </Link>
          </Button>
          <Button asChild variant="ghost" size="pill" className="w-full">
            <Link to="/game/$gameId" params={{ gameId }}>
              <Play aria-hidden="true" /> Preview the quiz
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
