import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EDITIONS, PROMPTS, RELATIONSHIPS } from "@/lib/game/copy";
import { defaultSecretMessage } from "@/lib/game/generate";
import { createGame, newGameId } from "@/lib/game/storage";
import type { Edition, GameAnswers, GameConfig, RelationshipType } from "@/lib/game/types";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create your quiz — YouMeQuiz" },
      {
        name: "description",
        content:
          "Pick your relationship type, answer five quick prompts, and get a shareable personalized game in under a minute.",
      },
      { property: "og:title", content: "Create your quiz — YouMeQuiz" },
      {
        property: "og:description",
        content: "Five prompts. One personalized quiz. Sixty seconds.",
      },
    ],
  }),
  component: CreatePage,
});

const TOTAL_STEPS = 9;

function CreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [relationship, setRelationship] = useState<RelationshipType | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [answers, setAnswers] = useState<GameAnswers>({
    obsession: "",
    ritual: "",
    joke: "",
    memory: "",
    fact: "",
  });
  const [captions, setCaptions] = useState(["", "", ""]);
  const [edition, setEdition] = useState<Edition>("full");
  const [secret, setSecret] = useState("");
  const [saving, setSaving] = useState(false);

  const promptStep = step >= 2 && step <= 6 ? PROMPTS[step - 2]! : null;

  const canAdvance = (() => {
    if (step === 0) return !!relationship;
    if (step === 1) return creatorName.trim().length > 0 && recipientName.trim().length > 0;
    if (promptStep) return answers[promptStep.key].trim().length > 0;
    return true;
  })();

  function next() {
    if (saving) return;
    if (!canAdvance) {
      toast.error("Just this one field and we're moving on.");
      return;
    }
    if (step === TOTAL_STEPS - 1) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  }

  async function finish() {
    const id = newGameId();
    const game: GameConfig = {
      id,
      createdAt: Date.now(),
      relationship: relationship ?? "couple",
      creatorName: creatorName.trim(),
      recipientName: recipientName.trim(),
      answers: {
        obsession: answers.obsession.trim(),
        ritual: answers.ritual.trim(),
        joke: answers.joke.trim(),
        memory: answers.memory.trim(),
        fact: answers.fact.trim(),
      },
      photos: captions
        .map((c, i) => ({ id: `p${i + 1}`, caption: c.trim() }))
        .filter((p) => p.caption.length > 0),
      edition,
      paid: false,
      secretMessage: "",
    };
    game.secretMessage = secret.trim() || defaultSecretMessage(game);
    setSaving(true);
    const res = await createGame(game);
    setSaving(false);
    if (!res.ok) {
      toast.error("Couldn't save your game. Check your connection and try again.");
      return;
    }
    if (edition !== "free") {
      navigate({ to: "/checkout/$gameId", params: { gameId: id } });
      return;
    }
    navigate({ to: "/share/$gameId", params: { gameId: id } });
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-3">
        {step === 0 ? (
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft aria-hidden="true" /> Home
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft aria-hidden="true" /> Back
          </Button>
        )}
        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
          Step {step + 1} of {TOTAL_STEPS}
        </p>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step + 1}
        aria-label="Creation progress"
      >
        <div
          className="h-full rounded-full bg-warm transition-all duration-300"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div key={step} className="rise-in mt-6">
        {step === 0 && (
          <div>
            <h1 className="text-3xl">Who's this about?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              It changes the tone of the questions.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {(Object.keys(RELATIONSHIPS) as RelationshipType[]).map((key) => {
                const r = RELATIONSHIPS[key];
                const active = relationship === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRelationship(key)}
                    aria-pressed={active}
                    className={`card-soft tap-scale p-4 text-left ${
                      active ? "border-primary ring-2 ring-primary/40" : ""
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {r.emoji}
                    </span>
                    <p className="mt-1.5 font-display text-base font-bold">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.blurb}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-3xl">Names, please.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We use these all over the questions.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="creator">Your name</Label>
                <Input
                  id="creator"
                  className="mt-1.5 h-12 rounded-xl"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Mila"
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="recipient">Who's playing it</Label>
                <Input
                  id="recipient"
                  className="mt-1.5 h-12 rounded-xl"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Jae"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        )}

        {promptStep && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Prompt {step - 1} of 5
            </p>
            <h1 className="mt-1 text-[1.75rem] leading-tight">{promptStep.label}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{promptStep.help}</p>
            <Textarea
              id={`prompt-${promptStep.key}`}
              aria-label={promptStep.label}
              className="mt-4 min-h-24 rounded-xl text-base"
              value={answers[promptStep.key]}
              onChange={(e) => setAnswers({ ...answers, [promptStep.key]: e.target.value })}
              placeholder={promptStep.placeholder}
              maxLength={140}
            />
            <p className="mt-1.5 text-right text-xs text-muted-foreground">
              {answers[promptStep.key].length}/140
            </p>
          </div>
        )}

        {step === 7 && (
          <div>
            <h1 className="text-3xl">Photo memories</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Uploads land in a later version. For now, describe up to three photos and they'll show
              as memory cards in the game.
            </p>
            <div className="mt-5 space-y-3">
              {captions.map((c, i) => (
                <div key={i}>
                  <Label htmlFor={`photo-${i}`}>Photo {i + 1} caption</Label>
                  <Input
                    id={`photo-${i}`}
                    className="mt-1.5 h-12 rounded-xl"
                    value={c}
                    onChange={(e) =>
                      setCaptions(captions.map((x, xi) => (xi === i ? e.target.value : x)))
                    }
                    placeholder={i === 0 ? "That rainy night in Lisbon" : "Optional"}
                    maxLength={80}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Label htmlFor="secret">Secret ending message (optional)</Label>
              <Textarea
                id="secret"
                className="mt-1.5 min-h-24 rounded-xl"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Leave blank and we'll write something sweet for you."
                maxLength={280}
              />
            </div>
          </div>
        )}

        {step === 8 && (
          <div>
            <h1 className="text-3xl">Pick an edition</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Paid editions use Square sandbox checkout — test cards only, no real money moves.
            </p>
            <div className="mt-5 space-y-2.5">
              {(["free", "full", "memory"] as const).map((key) => {
                const ed = EDITIONS[key];
                const active = edition === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEdition(key)}
                    aria-pressed={active}
                    className={`card-soft tap-scale block w-full p-4 text-left ${
                      active ? "border-primary ring-2 ring-primary/40" : ""
                    }`}
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <p className="min-w-0 truncate font-display text-base font-bold">
                        {ed.label}
                      </p>
                      <span className="shrink-0 text-sm font-bold text-primary">{ed.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{ed.perks.join(" · ")}</p>
                    {ed.badge && (
                      <span className="mt-2 inline-block rounded-full bg-highlight px-2.5 py-1 text-[11px] font-bold text-highlight-foreground">
                        {ed.badge} — test mode
                      </span>
                    )}
                    {active && (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
                        <Check className="size-3.5" aria-hidden="true" /> Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 mt-8">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={next}
          disabled={!canAdvance || saving}
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <Sparkles aria-hidden="true" />{" "}
              {saving
                ? "Saving your quiz…"
                : edition === "free"
                  ? "Generate the quiz"
                  : "Continue to checkout"}
            </>
          ) : (
            <>
              Continue <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </AppShell>
  );
}
