import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, Link2, Sparkles, Wand2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { EDITIONS, RELATIONSHIPS } from "@/lib/game/copy";
import { DEMO_GAME_ID, listMyGames, type MyGame } from "@/lib/game/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Us Game — Make a game about you two in 60 seconds" },
      {
        name: "description",
        content:
          "Answer five quick prompts and get a personalized 10-question game about your person. Share the link, no accounts, no downloads.",
      },
      { property: "og:title", content: "The Us Game" },
      {
        property: "og:description",
        content: "Your relationship. Your memories. Your game.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [mine, setMine] = useState<MyGame[]>([]);

  useEffect(() => {
    setMine(listMyGames().filter((g) => g.id !== DEMO_GAME_ID));
  }, []);

  return (
    <AppShell>
      <section className="rise-in pt-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          Made for one specific person
        </div>
        <h1 className="text-[2.6rem] leading-[1.05]">
          Your relationship.
          <br />
          Your memories.
          <br />
          <span className="text-warm">Your game.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Answer five nosy questions about your person. We turn them into a playable game, then you
          send the link and find out how well they actually know you.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to="/create">
              Create a Game
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="soft" size="xl" className="w-full">
            <Link to="/game/$gameId" params={{ gameId: DEMO_GAME_ID }}>
              Play the demo game
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" /> ~60 seconds
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Link2 className="size-3.5" aria-hidden="true" /> No account
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wand2 className="size-3.5" aria-hidden="true" /> 10 questions
          </span>
        </div>
      </section>

      {mine.length > 0 && (
        <section className="mt-9">
          <h2 className="text-lg">Your games</h2>
          <ul className="mt-3 space-y-2">
            {mine.map((g) => (
              <li key={g.id}>
                <Link
                  to="/share/$gameId"
                  params={{ gameId: g.id }}
                  className="card-soft tap-scale flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {g.creatorName} & {g.recipientName}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {RELATIONSHIPS[g.relationship].label} · {EDITIONS[g.edition].label}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl">Three rounds. Zero mercy.</h2>
        <div className="mt-3 space-y-2.5">
          {[
            { e: "🧠", t: "Do You Know Me?", d: "The basics. Obsessions, habits, tells." },
            { e: "🧾", t: "The Receipts", d: "Inside jokes and memories, entered as evidence." },
            { e: "🔮", t: "Predict Me", d: "Guess what they'd say before they say it." },
          ].map((r, i) => (
            <div
              key={r.t}
              className="card-soft rise-in flex items-start gap-3 p-4"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="text-xl" aria-hidden="true">
                {r.e}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base font-bold">{r.t}</p>
                <p className="text-sm text-muted-foreground">{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Editions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nothing is charged in this prototype — paid tiers are unlocked for demo purposes.
        </p>
        <div className="mt-3 space-y-2.5">
          {(["free", "full", "memory"] as const).map((key) => {
            const ed = EDITIONS[key];
            return (
              <div key={key} className="card-soft p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <p className="min-w-0 truncate font-display text-base font-bold">{ed.label}</p>
                  <span className="shrink-0 text-sm font-bold text-primary">{ed.price}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{ed.perks.join(" · ")}</p>
                {ed.badge && (
                  <span className="mt-2 inline-block rounded-full bg-highlight px-2.5 py-1 text-[11px] font-bold text-highlight-foreground">
                    {ed.badge} — no payment taken
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 card-soft bg-warm p-5 text-center">
        <p className="font-display text-xl font-bold text-primary-foreground">
          Someone deserves this today.
        </p>
        <Button asChild variant="soft" size="pill" className="mt-3 w-full">
          <Link to="/create">Make one about them</Link>
        </Button>
      </section>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Prototype build · games are saved in the cloud, so any link works on any device.
      </footer>
    </AppShell>
  );
}
