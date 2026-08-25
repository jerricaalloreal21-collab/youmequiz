import type { RelationshipType, Edition, PromptKey } from "./types";

export const RELATIONSHIPS: Record<
  RelationshipType,
  { label: string; emoji: string; blurb: string }
> = {
  couple: { label: "Couple", emoji: "💞", blurb: "Soft launch the chaos" },
  friends: { label: "Best Friends", emoji: "🫂", blurb: "Ride or die energy" },
  siblings: { label: "Siblings", emoji: "🧃", blurb: "Beloved rivals" },
  family: { label: "Family", emoji: "🏡", blurb: "Group chat legends" },
  birthday: { label: "Birthday", emoji: "🎉", blurb: "Their whole day" },
};

export const EDITIONS: Record<
  Edition,
  { label: string; price: string; perks: string[]; badge?: string }
> = {
  free: {
    label: "Quick Game",
    price: "Free",
    perks: ["5 personalized questions", "Instant shareable link", "Result tiers"],
  },
  full: {
    label: "Full Game",
    price: "$1.99",
    badge: "Demo unlocked",
    perks: ["10 personalized questions", "All 3 rounds", "Playful transitions"],
  },
  memory: {
    label: "Memory Edition",
    price: "$3.99",
    badge: "Demo unlocked",
    perks: ["Everything in Full", "Photo memories", "Secret ending message"],
  },
};

export const PROMPTS: { key: PromptKey; label: string; help: string; placeholder: string }[] = [
  {
    key: "obsession",
    label: "Something they're obsessed with",
    help: "A show, snack, hobby, celebrity — anything.",
    placeholder: "iced oat lattes",
  },
  {
    key: "ritual",
    label: "Something they always do",
    help: "The thing you could set a clock by.",
    placeholder: "reply 'lol' then vanish for 3 hours",
  },
  {
    key: "joke",
    label: "An inside joke",
    help: "Keep it short and quotable.",
    placeholder: "the parking garage incident",
  },
  {
    key: "memory",
    label: "A shared memory",
    help: "One you'd both retell at dinner.",
    placeholder: "that 2am airport ramen run",
  },
  {
    key: "fact",
    label: "One custom fact",
    help: "Anything true and slightly unhinged.",
    placeholder: "cannot whistle, refuses to admit it",
  },
];

export const TIERS = [
  {
    min: 0.9,
    title: "Certified Soulmate",
    emoji: "🏆",
    line: "Genuinely suspicious levels of knowing. Are you two the same person?",
  },
  {
    min: 0.7,
    title: "Elite Inner Circle",
    emoji: "✨",
    line: "You know the good stuff. A couple of blind spots, tastefully placed.",
  },
  {
    min: 0.45,
    title: "Emotionally Adjacent",
    emoji: "🙃",
    line: "You know the vibes, not the details. Still love you though.",
  },
  {
    min: 0.2,
    title: "Casual Acquaintance (Allegedly)",
    emoji: "😬",
    line: "This is a beautiful friendship built entirely on guessing.",
  },
  {
    min: -1,
    title: "Who Are You Even",
    emoji: "🫠",
    line: "Incredible. Truly a fresh start for the both of you.",
  },
];

export function tierFor(score: number, total: number) {
  const pct = total > 0 ? score / total : 0;
  return TIERS.find((t) => pct >= t.min)!;
}
