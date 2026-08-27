import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, PartyPopper, Play, Share2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { EDITIONS, RELATIONSHIPS } from "@/lib/game/copy";
import { allQuestions } from "@/lib/game/generate";
import { fetchGame, shareUrl } from "@/lib/game/storage";
import { copy, shareOrCopy } from "@/lib/share";
import type { GameConfig } from "@/lib/game/types";

export const Route = createFileRoute("/share/$gameId")({
  head: () => ({
    meta: [
      { title: "Your quiz is ready — YouMeQuiz" },
      {
        name: "description",
        content: "Copy the link and send your personalized game to the one person it's about.",
      },
      { property: "og:title", content: "Your quiz is ready — YouMeQuiz" },
      { property: "og:description", content: "One link. One very specific person." },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const { gameId } = Route.useParams();
  const [game, setGame] = useState<GameConfig | null>(null);
  const [url, setUrl] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setUrl(shareUrl(gameId));
    fetchGame(gameId).then((res) => {
      if (cancelled) return;
      setGame(res.status === "found" ? res.game : null);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  if (!ready) {
    return (
      <AppShell>
        <div className="card-soft mt-10 p-6 text-center" aria-live="polite">
          <p className="text-sm text-muted-foreground">Wrapping it up…</p>
        </div>
      </AppShell>
    );
  }

  if (!game) {
    return (
      <AppShell>
        <div className="card-soft mt-10 p-6 text-center">
          <h1 className="text-2xl">Game not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find a game with that link. Check the link, or make a new one.
          </p>
          <Button asChild variant="hero" size="pill" className="mt-4 w-full">
            <Link to="/create">Create a game</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const count = allQuestions(game).length;

  return (
    <AppShell>
      <div className="pop-in mt-4 text-center">
        <span className="float-slow inline-block text-5xl" aria-hidden="true">
          🎁
        </span>
        <h1 className="mt-3 text-3xl">It's ready.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {count} personalized questions about {game.creatorName}, built for {game.recipientName}.
        </p>
      </div>

      <div className="card-soft mt-6 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Shareable link
        </p>
        <p className="mt-1.5 break-all text-sm font-semibold">{url}</p>
        <div className="mt-4 flex flex-col gap-2.5">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() =>
              shareOrCopy(
                url,
                "YouMeQuiz",
                `${game.recipientName}, how well do you actually know ${game.creatorName}?`,
              )
            }
          >
            <Share2 aria-hidden="true" /> Send it to {game.recipientName}
          </Button>
          <Button variant="soft" size="pill" className="w-full" onClick={() => copy(url)}>
            <Copy aria-hidden="true" /> Copy link
          </Button>
        </div>
      </div>

      <div className="card-soft mt-4 p-4">
        <p className="text-sm font-semibold">
          {RELATIONSHIPS[game.relationship].emoji} {RELATIONSHIPS[game.relationship].label} ·{" "}
          {EDITIONS[game.edition].label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {game.photos.length} memory card{game.photos.length === 1 ? "" : "s"} · secret ending{" "}
          {game.edition === "memory" ? "included" : "hidden on this tier"}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <Button asChild variant="soft" size="xl" className="w-full">
          <Link to="/game/$gameId" params={{ gameId: game.id }}>
            <Play aria-hidden="true" /> Preview the quiz
          </Link>
        </Button>
        <Button asChild variant="ghost" size="pill" className="w-full">
          <Link to="/create">
            <PartyPopper aria-hidden="true" /> Make another one
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
