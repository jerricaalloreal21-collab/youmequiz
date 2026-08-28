import { getRequestUrl } from "@tanstack/react-start/server";

import { PAID_EDITIONS, isPaidEdition } from "./pricing";
import { createPaymentLink, getOrder, getSquareConfig } from "./square.server";

export interface PaymentStatus {
  configured: boolean;
  /** Names of secrets an owner still needs to add (never values). */
  missing: string[];
  paid: boolean;
  edition: string;
  amountCents: number;
  currency: string;
  message?: string;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function loadGame(gameId: string) {
  const db = await admin();
  const { data, error } = await db
    .from("games")
    .select("id, edition, paid, creator_name, recipient_name")
    .eq("id", gameId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

function baseStatus(edition: string): PaymentStatus {
  const price = isPaidEdition(edition) ? PAID_EDITIONS[edition] : null;
  return {
    configured: false,
    missing: [],
    paid: false,
    edition,
    amountCents: price?.amountCents ?? 0,
    currency: price?.currency ?? "USD",
  };
}

export async function handlePaymentStatus(gameId: string): Promise<PaymentStatus> {
  const game = await loadGame(gameId);
  if (!game) return { ...baseStatus("free"), message: "not-found" };
  const cfg = getSquareConfig();
  return {
    ...baseStatus(game.edition),
    configured: cfg.ok,
    missing: cfg.ok ? [] : cfg.missing,
    paid: Boolean(game.paid),
    ...(cfg.ok ? {} : { message: cfg.message }),
  };
}

export type CheckoutResult =
  | { status: "unlocked" }
  | { status: "redirect"; url: string }
  | { status: "not-configured"; missing: string[]; message: string }
  | { status: "error"; message: string };

export async function handleCreateCheckout(gameId: string): Promise<CheckoutResult> {
  const game = await loadGame(gameId);
  if (!game) return { status: "error", message: "We couldn't find that quiz." };
  if (game.paid || !isPaidEdition(game.edition)) return { status: "unlocked" };

  const cfg = getSquareConfig();
  if (!cfg.ok) return { status: "not-configured", missing: cfg.missing, message: cfg.message };

  const price = PAID_EDITIONS[game.edition];
  const origin = getRequestUrl().origin;
  const db = await admin();

  const { data: inserted, error: insertError } = await db
    .from("game_payments")
    .insert({
      game_id: game.id,
      edition: game.edition,
      amount_cents: price.amountCents,
      currency: price.currency,
      environment: "sandbox",
      status: "pending",
    })
    .select("id")
    .single();
  if (insertError || !inserted) {
    return { status: "error", message: "Could not start checkout. Please try again." };
  }

  const link = await createPaymentLink(cfg.config, {
    idempotencyKey: inserted.id,
    name: `YouMeQuiz — ${price.label}`,
    amountCents: price.amountCents,
    currency: price.currency,
    redirectUrl: `${origin}/pay/${game.id}`,
    note: `Quiz ${game.id}`,
  });

  if (!link.ok) {
    await db.from("game_payments").update({ status: "failed" }).eq("id", inserted.id);
    return { status: "error", message: link.message };
  }

  await db
    .from("game_payments")
    .update({
      square_order_id: link.link.orderId,
      square_payment_link_id: link.link.id,
      checkout_url: link.link.url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", inserted.id);

  return { status: "redirect", url: link.link.url };
}

export type VerifyResult =
  | { status: "paid" }
  | { status: "pending" }
  | { status: "free" }
  | { status: "not-configured"; missing: string[]; message: string }
  | { status: "error"; message: string };

export async function handleVerifyPayment(gameId: string): Promise<VerifyResult> {
  const game = await loadGame(gameId);
  if (!game) return { status: "error", message: "We couldn't find that quiz." };
  if (game.paid) return { status: "paid" };
  if (!isPaidEdition(game.edition)) return { status: "free" };

  const cfg = getSquareConfig();
  if (!cfg.ok) return { status: "not-configured", missing: cfg.missing, message: cfg.message };

  const expected = PAID_EDITIONS[game.edition].amountCents;
  const db = await admin();
  const { data: rows, error } = await db
    .from("game_payments")
    .select("id, square_order_id, amount_cents, status")
    .eq("game_id", game.id)
    .not("square_order_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) return { status: "error", message: "Could not check the payment." };
  if (!rows?.length) return { status: "pending" };

  for (const row of rows) {
    if (!row.square_order_id) continue;
    const res = await getOrder(cfg.config, row.square_order_id);
    if (!res.ok) continue;
    const { state, totalPaidCents } = res.order;
    const settled = state === "COMPLETED" && totalPaidCents >= expected;
    if (settled) {
      await db
        .from("game_payments")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("id", row.id);
      const { error: updateError } = await db
        .from("games")
        .update({ paid: true, paid_at: new Date().toISOString() })
        .eq("id", game.id);
      if (updateError) return { status: "error", message: "Could not unlock the quiz." };
      return { status: "paid" };
    }
    if (state === "CANCELED") {
      await db
        .from("game_payments")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("id", row.id);
    }
  }
  return { status: "pending" };
}
