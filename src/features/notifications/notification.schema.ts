import { z } from "zod";

const queryBoolean = z.preprocess(
  (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return undefined;
    }

    if (value === "true" || value === true) {
      return true;
    }

    if (value === "false" || value === false) {
      return false;
    }

    return value;
  },
  z.boolean().optional().default(false),
);

export const createWatchlistSchema = z.object({
  medicineId: z
    .string()
    .trim()
    .min(1, "Medicine ID is required."),

  radiusKm: z.coerce
    .number()
    .int("Radius must be a whole number.")
    .min(1, "Radius must be at least 1 km.")
    .max(100, "Radius cannot exceed 100 km.")
    .default(10),
});

export const notificationListSchema = z.object({
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

  unreadOnly: queryBoolean,
});

export type CreateWatchlistInput =
  z.infer<typeof createWatchlistSchema>;

export type NotificationListInput =
  z.infer<typeof notificationListSchema>;