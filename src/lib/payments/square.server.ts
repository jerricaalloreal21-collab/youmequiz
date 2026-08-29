/**
 * Square (SANDBOX ONLY) server helpers.
 * Secrets are read inside functions, never at module scope, and never leave the server.
 */

const SANDBOX_BASE = "https://connect.squareupsandbox.com";
const SQUARE_VERSION = "2025-01-23";

export interface SquareConfig {
  token: string;
  locationId: string;
  base: string;
}

export type ConfigResult =
  | { ok: true; config: SquareConfig }
  | { ok: false; missing: string[]; message: string };

export function getSquareConfig(): ConfigResult {
  const environment = (process.env["SQUARE_ENVIRONMENT"] ?? "sandbox").toLowerCase();
  const token = process.env["SQUARE_ACCESS_TOKEN"] ?? "";
  const locationId = process.env["SQUARE_LOCATION_ID"] ?? "";

  const missing: string[] = [];
  if (!token) missing.push("SQUARE_ACCESS_TOKEN");
  if (!locationId) missing.push("SQUARE_LOCATION_ID");

  if (environment !== "sandbox") {
    return {
      ok: false,
      missing: ["SQUARE_ENVIRONMENT"],
      message: "Square is locked to sandbox mode in this build.",
    };
  }
  if (missing.length) {
    return { ok: false, missing, message: "Square sandbox credentials are not configured yet." };
  }
  return { ok: true, config: { token, locationId, base: SANDBOX_BASE } };
}

async function squareFetch<T>(
  config: SquareConfig,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  let res: Response;
  try {
    res = await fetch(`${config.base}${path}`, {
      method: init?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Square-Version": SQUARE_VERSION,
        "Content-Type": "application/json",
      },
      ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
    });
  } catch {
    return { ok: false, message: "Could not reach Square." };
  }

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const detail =
      (json as { errors?: { detail?: string }[] } | null)?.errors?.[0]?.detail ??
      `Square returned ${res.status}`;
    // Log server-side only; never surface tokens or raw payloads to the client.
    console.error("[square] request failed", path, res.status, detail);
    if (/location id/i.test(detail)) {
      return {
        ok: false,
        message:
          "Square rejected the configured location. Check that SQUARE_LOCATION_ID is the full sandbox location ID.",
      };
    }
    return { ok: false, message: detail };
  }
  return { ok: true, data: json as T };
}

export interface PaymentLink {
  id: string;
  url: string;
  orderId: string;
}

export async function createPaymentLink(
  config: SquareConfig,
  args: {
    idempotencyKey: string;
    name: string;
    amountCents: number;
    currency: string;
    redirectUrl: string;
    note: string;
  },
): Promise<{ ok: true; link: PaymentLink } | { ok: false; message: string }> {
  const res = await squareFetch<{
    payment_link?: { id: string; url: string; order_id: string };
  }>(config, "/v2/online-checkout/payment-links", {
    method: "POST",
    body: {
      idempotency_key: args.idempotencyKey,
      quick_pay: {
        name: args.name,
        price_money: { amount: args.amountCents, currency: args.currency },
        location_id: config.locationId,
      },
      checkout_options: {
        redirect_url: args.redirectUrl,
        ask_for_shipping_address: false,
      },
      payment_note: args.note,
    },
  });
  if (!res.ok) return res;
  const link = res.data.payment_link;
  if (!link?.url) return { ok: false, message: "Square did not return a checkout link." };
  return { ok: true, link: { id: link.id, url: link.url, orderId: link.order_id } };
}

export interface OrderState {
  state: string;
  totalPaidCents: number;
  totalCents: number;
}

export async function getOrder(
  config: SquareConfig,
  orderId: string,
): Promise<{ ok: true; order: OrderState } | { ok: false; message: string }> {
  const res = await squareFetch<{
    order?: {
      state?: string;
      total_money?: { amount?: number };
      net_amount_due_money?: { amount?: number };
      tenders?: { amount_money?: { amount?: number } }[];
    };
  }>(config, `/v2/orders/${encodeURIComponent(orderId)}`);
  if (!res.ok) return res;
  const order = res.data.order;
  if (!order) return { ok: false, message: "Order not found at Square." };
  const totalCents = order.total_money?.amount ?? 0;
  const tendered = (order.tenders ?? []).reduce((sum, t) => sum + (t.amount_money?.amount ?? 0), 0);
  const due = order.net_amount_due_money?.amount;
  const totalPaidCents = tendered || (due === 0 ? totalCents : 0);
  return { ok: true, order: { state: order.state ?? "UNKNOWN", totalPaidCents, totalCents } };
}
