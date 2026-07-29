import { z } from "zod";

const databaseIdSchema = z
  .string()
  .trim()
  .min(1, "A valid ID is required.");

const quantitySchema = z
  .number()
  .int("Quantity must be a whole number.")
  .min(0, "Quantity cannot be negative.")
  .max(100_000, "Quantity is too large.");

const priceSchema = z
  .number()
  .finite("Price must be a valid number.")
  .positive("Price must be greater than zero.")
  .max(1_000_000, "Price is too large.");

const thresholdSchema = z
  .number()
  .int("Low-stock threshold must be a whole number.")
  .min(0, "Low-stock threshold cannot be negative.")
  .max(10_000, "Low-stock threshold is too large.");

export const inventoryIdSchema = z.object({
  inventoryId: databaseIdSchema,
});

export const createInventorySchema = z.object({
  medicineId: databaseIdSchema,
  quantity: quantitySchema,
  price: priceSchema,
  lowStockThreshold: thresholdSchema.default(5),
});

export const updateInventorySchema = z
  .object({
    quantity: quantitySchema.optional(),
    price: priceSchema.optional(),
    lowStockThreshold: thresholdSchema.optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value !== undefined,
      ),
    {
      message:
        "Provide at least one inventory field to update.",
    },
  );

export const adjustInventorySchema = z.object({
  adjustment: z
    .number()
    .int("Stock adjustment must be a whole number.")
    .min(-10_000, "Stock reduction is too large.")
    .max(10_000, "Stock increase is too large.")
    .refine(
      (value) => value !== 0,
      "Stock adjustment cannot be zero.",
    ),

  reason: z
    .string()
    .trim()
    .min(
      3,
      "Adjustment reason must contain at least 3 characters.",
    )
    .max(
      250,
      "Adjustment reason cannot exceed 250 characters.",
    ),
});

export type CreateInventoryInput = z.infer<
  typeof createInventorySchema
>;

export type UpdateInventoryInput = z.infer<
  typeof updateInventorySchema
>;

export type AdjustInventoryInput = z.infer<
  typeof adjustInventorySchema
>;