import { supabase } from "@/integrations/supabase/client";
import type { Edition, GameConfig, PlayResult, RelationshipType } from "./types";

/*
 * Persistence layer.
 * Games live in the cloud database (public read by id, anyone can create),
 * so a share link opens on any device. localStorage only remembers which
 * games were made on THIS device, for the "Your games" list.
 */

const MINE_KEY = "usgame.mine.v2";
const RESULTS_KEY = "usgame.results.v1";

export const DEMO_GAME_ID = "demo-mila-jae";

export const DEMO_GAME: GameConfig = {
  id: DEMO_GAME_ID,
  createdAt: 0,
  relationship: "couple",
  creatorName: "Mila",
  recipientName: "Jae",
  answers: {
    obsession: "spicy noodles at midnight",
    ritual: "reads the menu out loud, every time",
    joke: "the emotional support parking cone",
    memory: "getting caught in the rain in Lisbon",
    fact: "keeps a running list of dogs we've met",
  },
  photos: [
    { id: "p1", caption: "Lisbon, soaked and laughing" },
    { id: "p2", caption: "The cone, in its natural habitat" },
    { id: "p3", caption: "Noodle place, 12:40am" },
  ],
  edition: "memory",
  secretMessage:
    "Jae — if you got every one of these wrong I'd still pick you. Also the cone stays in the car. Non-negotiable. 💛",
};

export const ID_PATTERN = /^[a-z0-9-]{4,40}$/;

export function isValidGameId(id: string): boolean {
  return ID_PATTERN.test(id);
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/* ---------- row mapping ---------- */

type GameRow = {
  id: string;
  created_at: string;
  relationship: string;
  creator_name: string;
  recipient_name: string;
  answers: unknown;
  photos: unknown;
  edition: string;
  secret_message: string;
};

function rowToGame(row: GameRow): GameConfig {
  const answers = (row.answers ?? {}) as Record<string, string>;
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    relationship: row.relationship as RelationshipType,
    creatorName: row.creator_name,
    recipientName: row.recipient_name,
    answers: {
      obsession: answers.obsession ?? "",
      ritual: answers.ritual ?? "",
      joke: answers.joke ?? "",
      memory: answers.memory ?? "",
      fact: answers.fact ?? "",
    },
    photos: Array.isArray(row.photos) ? (row.photos as GameConfig["photos"]) : [],
    edition: row.edition as Edition,
    secretMessage: row.secret_message ?? "",
  };
}

/* ---------- remote ---------- */

export type FetchState =
  | { status: "found"; game: GameConfig }
  | { status: "not-found" }
  | { status: "invalid" }
  | { status: "error"; message: string };

export async function fetchGame(id: string): Promise<FetchState> {
  if (!id || !isValidGameId(id)) return { status: "invalid" };
  try {
    const { data, error } = await supabase
      .from("games")
      .select(
        "id, created_at, relationship, creator_name, recipient_name, answers, photos, edition, secret_message",
      )
      .eq("id", id)
      .maybeSingle();
    if (error) return { status: "error", message: error.message };
    if (!data) {
      if (id === DEMO_GAME_ID) return { status: "found", game: DEMO_GAME };
      return { status: "not-found" };
    }
    return { status: "found", game: rowToGame(data as GameRow) };
  } catch (e) {
    if (id === DEMO_GAME_ID) return { status: "found", game: DEMO_GAME };
    return { status: "error", message: e instanceof Error ? e.message : "Network error" };
  }
}

export async function createGame(game: GameConfig): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.from("games").insert({
    id: game.id,
    relationship: game.relationship,
    creator_name: game.creatorName,
    recipient_name: game.recipientName,
    answers: game.answers,
    photos: game.photos,
    edition: game.edition,
    secret_message: game.secretMessage,
  });
  if (error) return { ok: false, message: error.message };
  rememberMine(game);
  return { ok: true };
}

/* ---------- local "your games" index ---------- */

export interface MyGame {
  id: string;
  createdAt: number;
  creatorName: string;
  recipientName: string;
  relationship: RelationshipType;
  edition: Edition;
}

export function listMyGames(): MyGame[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(MINE_KEY);
    const list = raw ? (JSON.parse(raw) as MyGame[]) : [];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function rememberMine(game: GameConfig) {
  if (!isBrowser()) return;
  const entry: MyGame = {
    id: game.id,
    createdAt: game.createdAt || Date.now(),
    creatorName: game.creatorName,
    recipientName: game.recipientName,
    relationship: game.relationship,
    edition: game.edition,
  };
  const list = listMyGames().filter((g) => g.id !== game.id);
  list.unshift(entry);
  window.localStorage.setItem(MINE_KEY, JSON.stringify(list.slice(0, 50)));
}

export function newGameId(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function saveResult(result: PlayResult) {
  if (!isBrowser()) return;
  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    const list = raw ? (JSON.parse(raw) as PlayResult[]) : [];
    list.unshift(result);
    window.localStorage.setItem(RESULTS_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

export function shareUrl(id: string): string {
  const base = isBrowser() ? window.location.origin : "";
  return `${base}/game/${id}`;
}
