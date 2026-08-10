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

export const inventoryListSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100, "Search cannot exceed 100 characters.")
    .default(""),

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

  includeInactive: queryBoolean,
});

export const createInventorySchema = z.object({
  medicineId: z
    .string()
    .trim()
    .min(1, "Medicine ID is required."),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(0, "Quantity cannot be negative."),

  price: z.coerce
    .number()
    .positive("Price must be greater than zero."),

  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0)
    .default(5),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const updateInventorySchema = z
  .object({
    quantity: z.coerce
      .number()
      .int()
      .min(0)
      .optional(),

    price: z.coerce
      .number()
      .positive()
      .optional(),

    lowStockThreshold: z.coerce
      .number()
      .int()
      .min(0)
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value !== undefined,
      ),
    {
      message:
        "Provide at least one field to update.",
    },
  );

export type InventoryListInput =
  z.infer<typeof inventoryListSchema>;

export type CreateInventoryInput =
  z.infer<typeof createInventorySchema>;

export type UpdateInventoryInput =
  z.infer<typeof updateInventorySchema>;