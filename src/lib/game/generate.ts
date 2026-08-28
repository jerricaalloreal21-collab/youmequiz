import { effectiveEdition } from "./entitlement";
import type { GameConfig, Question, Round } from "./types";

/* Deterministic seeded RNG so a game link always produces the same game. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string) {
  let s = hash(seed) || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

function pick<T>(arr: T[], next: () => number, count: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(next() * pool.length), 1)[0]!);
  }
  return out;
}

const DECOYS = {
  obsession: [
    "competitive napping",
    "a suspicious amount of hot sauce",
    "reality TV villains",
    "buying plants they will not water",
    "true crime podcasts at 1.5x speed",
    "matcha, but only the expensive one",
    "vintage sneakers they never wear",
    "reorganizing the fridge",
  ],
  ritual: [
    "narrate every meal out loud",
    "say 'one more episode' and mean four",
    "take a photo of the sky, every time",
    "leave voice notes over 4 minutes long",
    "arrive 12 minutes late, confidently",
    "double text then apologize for it",
    "steal the aux without asking",
  ],
  joke: [
    "the sandwich betrayal",
    "the haunted rental car",
    "the great group-chat typo",
    "the incident at the buffet",
    "the mystery of the missing charger",
    "the wedding we crashed by accident",
  ],
  memory: [
    "the road trip with no playlist",
    "the birthday cake disaster",
    "that beach day it rained sideways",
    "the karaoke night nobody survived",
    "the time we got lost on purpose",
    "the picnic with all those ants",
  ],
  fact: [
    "sneezes exactly three times, always",
    "cannot parallel park, will not learn",
    "afraid of moths, specifically",
    "has a secret spreadsheet about snacks",
    "believes cereal is a soup",
    "has never finished a book on time",
  ],
};

function options(correct: string, decoys: string[], next: () => number): Question["options"] {
  const others = pick(
    decoys.filter((d) => d.toLowerCase() !== correct.trim().toLowerCase()),
    next,
    3,
  );
  const all = [correct.trim(), ...others];
  // seeded shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [all[i], all[j]] = [all[j]!, all[i]!];
  }
  return all;
}

function q(
  id: string,
  round: Question["round"],
  prompt: string,
  correct: string,
  decoys: string[],
  onCorrect: string,
  onWrong: string,
  next: () => number,
): Question {
  const opts = options(correct, decoys, next);
  return {
    id,
    round,
    prompt,
    options: opts,
    correctIndex: opts.findIndex((o) => o === correct.trim()),
    onCorrect,
    onWrong,
  };
}

export function buildRounds(game: GameConfig): Round[] {
  const next = rng(game.id + game.creatorName + game.recipientName);
  const a = game.answers;
  const me = game.creatorName || "They";
  const you = game.recipientName || "You";

  const know: Question[] = [
    q(
      "k1",
      "know",
      `What is ${me} genuinely obsessed with right now?`,
      a.obsession,
      DECOYS.obsession,
      `Obviously. ${me} would like a round of applause.`,
      `Wrong, and slightly hurtful.`,
      next,
    ),
    q(
      "k2",
      "know",
      `Which thing does ${me} do without fail, every single time?`,
      a.ritual,
      DECOYS.ritual,
      `Correct. It's a personality, not a habit.`,
      `Nope. ${me} is judging you gently.`,
      next,
    ),
    q(
      "k3",
      "know",
      `One random true fact about ${me}?`,
      a.fact,
      DECOYS.fact,
      `Unhinged and accurate.`,
      `Not even close. Bold guess though.`,
      next,
    ),
    q(
      "k4",
      "know",
      `If ${me} had 20 free minutes, what wins?`,
      a.obsession,
      DECOYS.obsession,
      `Every time. Zero hesitation.`,
      `That's what ${you} would pick, not ${me}.`,
      next,
    ),
  ];

  const receipts: Question[] = [
    q(
      "r1",
      "receipts",
      `Name the inside joke. The one that ends every argument.`,
      a.joke,
      DECOYS.joke,
      `The receipts are immaculate.`,
      `That never happened. We'd remember.`,
      next,
    ),
    q(
      "r2",
      "receipts",
      `Which memory is legally required at every reunion?`,
      a.memory,
      DECOYS.memory,
      `Filed under core memories.`,
      `Incorrect, and honestly a little random.`,
      next,
    ),
    q(
      "r3",
      "receipts",
      `Complete the evidence: "It all started with..."`,
      a.memory,
      DECOYS.memory,
      `Case closed.`,
      `The jury did not buy that.`,
      next,
    ),
  ];

  const predict: Question[] = [
    q(
      "p1",
      "predict",
      `${me} gets asked to describe themselves in five words. What sneaks in?`,
      a.fact,
      DECOYS.fact,
      `Predicted perfectly. Spooky.`,
      `${me} would never admit to that.`,
      next,
    ),
    q(
      "p2",
      "predict",
      `Next time ${you} and ${me} hang out, what is guaranteed to happen?`,
      a.ritual,
      DECOYS.ritual,
      `Written in the stars.`,
      `Optimistic. Incorrect.`,
      next,
    ),
    q(
      "p3",
      "predict",
      `${me} is telling a story at dinner. Which one is it?`,
      a.joke,
      DECOYS.joke,
      `You know the setlist.`,
      `Wrong story, wrong night.`,
      next,
    ),
  ];

  const limit = effectiveEdition(game) === "free" ? 5 : 10;
  const all: Round[] = [
    {
      id: "know",
      title: "Do You Know Me?",
      tagline: "Warm up. Low stakes. Allegedly.",
      emoji: "🧠",
      questions: know,
    },
    {
      id: "receipts",
      title: "The Receipts",
      tagline: "Evidence time. No hiding now.",
      emoji: "🧾",
      questions: receipts,
    },
    {
      id: "predict",
      title: "Predict Me",
      tagline: "Final round. Read their mind.",
      emoji: "🔮",
      questions: predict,
    },
  ];

  // Trim to the edition's question budget, keeping round balance.
  let budget = limit;
  const shares = limit === 5 ? [2, 2, 1] : [4, 3, 3];
  return all
    .map((r, i) => {
      const take = Math.min(shares[i]!, budget);
      budget -= take;
      return { ...r, questions: r.questions.slice(0, take) };
    })
    .filter((r) => r.questions.length > 0);
}

export function allQuestions(game: GameConfig): Question[] {
  return buildRounds(game).flatMap((r) => r.questions);
}

export function defaultSecretMessage(game: GameConfig): string {
  const you = game.recipientName || "you";
  return `Hey ${you} — the real answer to every question in here is that I pay attention because it's you. ${game.answers.memory ? `Still thinking about ${game.answers.memory}.` : ""} ${game.answers.joke ? `And yes, ${game.answers.joke} will follow us forever.` : ""}`.trim();
}
