import { z } from "zod";

import {
  PHARMACY_RESERVATION_ACTIONS,
} from "@/features/reservations/reservation-rules";

const databaseIdSchema = z
  .string()
  .trim()
  .min(1, "A valid ID is required.");

export const reservationIdSchema = z.object({
  reservationId: databaseIdSchema,
});

export const createReservationSchema = z.object({
  inventoryId: databaseIdSchema,

  quantity: z
    .number()
    .int("Reservation quantity must be a whole number.")
    .min(
      1,
      "Reservation quantity must be at least one.",
    )
    .max(
      100,
      "A maximum of 100 units can be reserved.",
    ),
});

export const cancelReservationSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(
      3,
      "Cancellation reason must contain at least 3 characters.",
    )
    .max(
      250,
      "Cancellation reason cannot exceed 250 characters.",
    )
    .optional(),
});

export const updateReservationStatusSchema =
  z.object({
    status: z.enum(
      PHARMACY_RESERVATION_ACTIONS,
    ),

    reason: z
      .string()
      .trim()
      .max(
        250,
        "Reason cannot exceed 250 characters.",
      )
      .optional(),
  });

export type CreateReservationInput = z.infer<
  typeof createReservationSchema
>;

export type CancelReservationInput = z.infer<
  typeof cancelReservationSchema
>;

export type UpdateReservationStatusInput =
  z.infer<
    typeof updateReservationStatusSchema
  >;