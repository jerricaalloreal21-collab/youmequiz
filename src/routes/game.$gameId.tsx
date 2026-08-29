import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Heart, Lock, RotateCcw, Share2, X } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { EDITIONS, RELATIONSHIPS, tierFor } from "@/lib/game/copy";
import { buildRounds } from "@/lib/game/generate";
import { effectiveEdition } from "@/lib/game/entitlement";
import { fetchGame, saveResult, shareUrl, type FetchState } from "@/lib/game/storage";
import { shareOrCopy } from "@/lib/share";
import type { GameConfig, Question, Round } from "@/lib/game/types";

export const Route = createFileRoute("/game/$gameId")({
  head: () => ({
    meta: [
      { title: "Play a quiz — YouMeQuiz" },
      {
        name: "description",
        content:
          "Someone made a personalized game about the two of you. Three rounds, no account, instant result.",
      },
      { property: "og:title", content: "How well do you actually know them?" },
      {
        property: "og:description",
        content: "A personalized mini-game built from real memories. Play it in two minutes.",
      },
    ],
  }),
  component: PlayPage,
});

type Phase = "intro" | "play" | "result";

function PlayPage() {
  const { gameId } = Route.useParams();
  const [state, setState] = useState<FetchState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState(null);
    fetchGame(gameId).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
  }, [gameId, attempt]);

  if (!state) {
    return (
      <AppShell>
        <div className="card-soft mt-10 p-6 text-center" aria-live="polite">
          <span className="float-slow inline-block text-4xl" aria-hidden="true">
            💌
          </span>
          <p className="mt-3 text-sm text-muted-foreground">Unwrapping your game…</p>
        </div>
      </AppShell>
    );
  }

  if (state.status !== "found") {
    const copyFor = {
      "not-found": {
        title: "This quiz doesn't exist",
        body: "The link may have a typo, or the quiz was never finished. Double-check the link — or make your own.",
      },
      invalid: {
        title: "That link doesn't look right",
        body: "Game links look like /game/abc12xyz. Check the link you were sent, or make your own.",
      },
      error: {
        title: "We couldn't load this quiz",
        body: "Something went wrong reaching the server. Try again in a moment.",
      },
    }[state.status];

    return (
      <AppShell>
        <div className="card-soft mt-10 p-6 text-center">
          <h1 className="text-2xl">{copyFor.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{copyFor.body}</p>
          {state.status === "error" && (
            <Button
              variant="soft"
              size="pill"
              className="mt-4 w-full"
              onClick={() => setAttempt((a) => a + 1)}
            >
              <RotateCcw aria-hidden="true" /> Try again
            </Button>
          )}
          <Button asChild variant="hero" size="pill" className="mt-3 w-full">
            <Link to="/create">Create a quiz</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return <Player game={state.game} />;
}

function Player({ game }: { game: GameConfig }) {
  const rounds = useMemo(() => buildRounds(game), [game]);
  const flat = useMemo(
    () => rounds.flatMap((r) => r.questions.map((q) => ({ q, round: r }))),
    [rounds],
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [secretOpen, setSecretOpen] = useState(false);

  const current = flat[index];
  const isRoundStart = index === 0 || flat[index - 1]?.round.id !== current?.round.id;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === current!.q.correctIndex) setScore((s) => s + 1);
  }

  function advance() {
    if (index + 1 >= flat.length) {
      saveResult({
        gameId: game.id,
        score,
        total: flat.length,
        completedAt: Date.now(),
      });
      setPhase("result");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setSecretOpen(false);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <AppShell>
        <div className="pop-in mt-6 text-center">
          <span className="float-slow inline-block text-5xl" aria-hidden="true">
            {RELATIONSHIPS[game.relationship].emoji}
          </span>
          <h1 className="mt-4 text-[2.1rem] leading-tight">
            {game.recipientName}, how well do you actually know {game.creatorName}?
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {flat.length} questions across {rounds.length} rounds. No account, no cheating, no
            takebacks.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          {rounds.map((r, i) => (
            <div
              key={r.id}
              className="card-soft rise-in flex items-center gap-3 p-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-xl" aria-hidden="true">
                {r.emoji}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-bold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.tagline}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs font-bold text-muted-foreground">
                {r.questions.length}
              </span>
            </div>
          ))}
        </div>

        <div className="sticky bottom-4 mt-7">
          <Button variant="hero" size="xl" className="w-full" onClick={() => setPhase("play")}>
            Start playing <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </AppShell>
    );
  }

  if (phase === "play" && current) {
    return (
      <AppShell showNav={false}>
        <QuestionView
          q={current.q}
          round={current.round}
          isRoundStart={isRoundStart}
          index={index}
          total={flat.length}
          picked={picked}
          onChoose={choose}
          onNext={advance}
          creatorName={game.creatorName}
        />
      </AppShell>
    );
  }

  const tier = tierFor(score, flat.length);
  const url = shareUrl(game.id);

  return (
    <AppShell>
      <div className="pop-in mt-4 text-center">
        <span className="text-5xl" aria-hidden="true">
          {tier.emoji}
        </span>
        <p className="mt-3 text-sm font-bold uppercase tracking-wider text-primary">
          {score} / {flat.length} correct
        </p>
        <h1 className="mt-1 text-[2.1rem] leading-tight">{tier.title}</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">{tier.line}</p>
      </div>

      <div
        className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-secondary"
        role="img"
        aria-label={`Score ${score} out of ${flat.length}`}
      >
        <div
          className="h-full rounded-full bg-warm transition-all duration-700"
          style={{ width: `${Math.max(6, (score / flat.length) * 100)}%` }}
        />
      </div>

      {game.photos.length > 0 && effectiveEdition(game) === "memory" && (
        <section className="mt-7">
          <h2 className="text-lg">Memory cards</h2>
          <div className="mt-3 space-y-2.5">
            {game.photos.map((p, i) => (
              <div
                key={p.id}
                className="card-soft rise-in flex items-center gap-3 p-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-lg"
                  aria-hidden="true"
                >
                  📸
                </span>
                <p className="min-w-0 text-sm font-medium">{p.caption}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Real photo uploads arrive in a later version.
          </p>
        </section>
      )}

      <section className="mt-7">
        {effectiveEdition(game) === "memory" ? (
          secretOpen ? (
            <div className="card-soft pop-in bg-warm p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
                Secret ending · from {game.creatorName}
              </p>
              <p className="mt-2 font-display text-lg leading-snug text-primary-foreground">
                {game.secretMessage}
              </p>
            </div>
          ) : (
            <Button
              variant="soft"
              size="xl"
              className="w-full"
              onClick={() => setSecretOpen(true)}
              aria-label={`Open the secret ending message from ${game.creatorName}`}
            >
              <Heart aria-hidden="true" /> Open the secret ending
            </Button>
          )
        ) : (
          <div className="card-soft flex items-start gap-3 p-4">
            <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              The secret ending message is part of the {EDITIONS.memory.label} (
              {EDITIONS.memory.price}). This quiz is on the {EDITIONS[effectiveEdition(game)].label}
              tier, so it stays sealed.
            </p>
          </div>
        )}
      </section>

      <div className="mt-7 flex flex-col gap-2.5">
        <Button asChild variant="hero" size="xl" className="w-full">
          <Link to="/create">Make one about them</Link>
        </Button>
        <Button
          variant="soft"
          size="pill"
          className="w-full"
          onClick={() =>
            shareOrCopy(
              url,
              "YouMeQuiz",
              `I scored ${score}/${flat.length} on ${game.creatorName}'s quiz. Think you'd do better?`,
            )
          }
        >
          <Share2 aria-hidden="true" /> Share your score
        </Button>
        <Button variant="ghost" size="pill" className="w-full" onClick={restart}>
          <RotateCcw aria-hidden="true" /> Play again
        </Button>
      </div>
    </AppShell>
  );
}

function QuestionView({
  q,
  round,
  isRoundStart,
  index,
  total,
  picked,
  onChoose,
  onNext,
  creatorName,
}: {
  q: Question;
  round: Round;
  isRoundStart: boolean;
  index: number;
  total: number;
  picked: number | null;
  onChoose: (i: number) => void;
  onNext: () => void;
  creatorName: string;
}) {
  const correct = picked !== null && picked === q.correctIndex;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pt-1">
        <Link to="/" className="text-xs font-semibold text-muted-foreground">
          YouMeQuiz
        </Link>
        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
          {index + 1} / {total}
        </p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-warm transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {isRoundStart && (
        <div className="pop-in mt-5 card-soft flex items-center gap-3 p-4">
          <span className="text-xl" aria-hidden="true">
            {round.emoji}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold">Round: {round.title}</p>
            <p className="text-xs text-muted-foreground">{round.tagline}</p>
          </div>
        </div>
      )}

      <h1 key={q.id} className="rise-in mt-6 text-[1.7rem] leading-tight">
        {q.prompt}
      </h1>

      <ul className="mt-5 space-y-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = picked === i;
          const revealed = picked !== null;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onChoose(i)}
                disabled={revealed}
                aria-label={opt}
                className={`card-soft tap-scale flex w-full items-center gap-3 p-4 text-left text-[15px] font-medium disabled:opacity-100 ${
                  revealed && isCorrect ? "border-success ring-2 ring-success/40" : ""
                } ${revealed && isPicked && !isCorrect ? "border-destructive ring-2 ring-destructive/30" : ""}`}
              >
                <span className="min-w-0 flex-1">{opt}</span>
                {revealed && isCorrect && (
                  <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                )}
                {revealed && isPicked && !isCorrect && (
                  <X className="size-4 shrink-0 text-destructive" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <div className="pop-in mt-5">
          <div className="card-soft p-4">
            <p className="font-display text-base font-bold">
              {correct ? "Correct 🎯" : "Nope 💀"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {correct ? q.onCorrect : q.onWrong}
            </p>
            {!correct && (
              <p className="mt-2 text-sm">
                <span className="font-semibold">{creatorName} said:</span>{" "}
                {q.options[q.correctIndex]}
              </p>
            )}
          </div>
          <div className="sticky bottom-4 mt-4">
            <Button variant="hero" size="xl" className="w-full" onClick={onNext}>
              {index + 1 >= total ? "See the result" : "Next question"}
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
