import type { GameConfig, PlayResult } from "./types";

/*
 * V1 persistence layer: browser localStorage only.
 * Every read/write goes through this module so swapping in Supabase later
 * is a single-file change (make these async and hit the DB instead).
 */

const GAMES_KEY = "usgame.games.v1";
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

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readMap(): Record<string, GameConfig> {
  if (!isBrowser()) return { [DEMO_GAME_ID]: DEMO_GAME };
  try {
    const raw = window.localStorage.getItem(GAMES_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, GameConfig>) : {};
    if (!parsed[DEMO_GAME_ID]) parsed[DEMO_GAME_ID] = DEMO_GAME;
    return parsed;
  } catch {
    return { [DEMO_GAME_ID]: DEMO_GAME };
  }
}

function writeMap(map: Record<string, GameConfig>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(GAMES_KEY, JSON.stringify(map));
}

export function seedDemo() {
  const map = readMap();
  map[DEMO_GAME_ID] = DEMO_GAME;
  writeMap(map);
}

export function listGames(): GameConfig[] {
  return Object.values(readMap()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getGame(id: string): GameConfig | null {
  if (id === DEMO_GAME_ID) return DEMO_GAME;
  return readMap()[id] ?? null;
}

export function saveGame(game: GameConfig) {
  const map = readMap();
  map[game.id] = game;
  writeMap(map);
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
