import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  handleCreateCheckout,
  handlePaymentStatus,
  handleVerifyPayment,
} from "./square.handlers";

const gameIdInput = (data: unknown) =>
  z.object({ gameId: z.string().regex(/^[a-z0-9-]{4,40}$/) }).parse(data);

export const createSquareCheckout = createServerFn({ method: "POST" })
  .inputValidator(gameIdInput)
  .handler(async ({ data }) => handleCreateCheckout(data.gameId));

export const verifySquarePayment = createServerFn({ method: "POST" })
  .inputValidator(gameIdInput)
  .handler(async ({ data }) => handleVerifyPayment(data.gameId));

export const getSquarePaymentStatus = createServerFn({ method: "POST" })
  .inputValidator(gameIdInput)
  .handler(async ({ data }) => handlePaymentStatus(data.gameId));
