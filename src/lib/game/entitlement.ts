import type { Edition, GameConfig } from "./types";

/**
 * A premium edition only counts once the server has verified the payment.
 * Until then the quiz plays as the free edition.
 */
export function effectiveEdition(game: Pick<GameConfig, "edition" | "paid">): Edition {
  if (game.edition === "free") return "free";
  return game.paid ? game.edition : "free";
}

export function isLocked(game: Pick<GameConfig, "edition" | "paid">): boolean {
  return game.edition !== "free" && !game.paid;
}
