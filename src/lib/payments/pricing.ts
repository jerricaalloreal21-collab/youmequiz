import type { Edition } from "@/lib/game/types";

/** Server-authoritative pricing. Never trust an amount sent from the client. */
export const PAID_EDITIONS = {
  full: { label: "Full Game", amountCents: 299, currency: "USD" },
  memory: { label: "Memory Edition", amountCents: 499, currency: "USD" },
} as const;

export type PaidEdition = keyof typeof PAID_EDITIONS;

export function isPaidEdition(edition: Edition | string): edition is PaidEdition {
  return edition === "full" || edition === "memory";
}

export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
