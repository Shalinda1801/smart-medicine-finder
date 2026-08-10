import { z } from "zod";

export const createReservationSchema = z.object({
  inventoryId: z
    .string()
    .trim()
    .min(1, "Inventory ID is required."),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "You must reserve at least one item.")
    .max(50, "You cannot reserve more than 50 items."),
});

export const reservationListSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});

export const updateReservationStatusSchema =
  z.object({
    status: z.enum([
      "CONFIRMED",
      "READY_FOR_PICKUP",
      "COLLECTED",
      "CANCELLED",
    ]),
  });

export type CreateReservationInput =
  z.infer<typeof createReservationSchema>;

export type ReservationListInput =
  z.infer<typeof reservationListSchema>;

export type UpdateReservationStatusInput =
  z.infer<
    typeof updateReservationStatusSchema
  >;