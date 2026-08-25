export type RelationshipType = "couple" | "friends" | "siblings" | "family" | "birthday";

export type Edition = "free" | "full" | "memory";

export type PromptKey = "obsession" | "ritual" | "joke" | "memory" | "fact";

export interface GameAnswers {
  obsession: string;
  ritual: string;
  joke: string;
  memory: string;
  fact: string;
}

export interface PhotoPlaceholder {
  id: string;
  caption: string;
}

export interface GameConfig {
  id: string;
  createdAt: number;
  relationship: RelationshipType;
  creatorName: string;
  recipientName: string;
  answers: GameAnswers;
  photos: PhotoPlaceholder[];
  edition: Edition;
  secretMessage: string;
}

export type RoundId = "know" | "receipts" | "predict";

export interface Question {
  id: string;
  round: RoundId;
  prompt: string;
  options: string[];
  correctIndex: number;
  onCorrect: string;
  onWrong: string;
}

export interface Round {
  id: RoundId;
  title: string;
  tagline: string;
  emoji: string;
  questions: Question[];
}

export interface PlayResult {
  gameId: string;
  score: number;
  total: number;
  completedAt: number;
}
