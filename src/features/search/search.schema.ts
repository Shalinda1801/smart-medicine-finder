import { z } from "zod";

const optionalText = (maximumLength: number) =>
  z.preprocess(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return undefined;
      }

      return value;
    },
    z
      .string()
      .trim()
      .max(
        maximumLength,
        `Value cannot exceed ${maximumLength} characters.`,
      )
      .optional(),
  );

export const medicineSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .max(
      100,
      "Search text cannot exceed 100 characters.",
    )
    .default(""),

  city: optionalText(80),

  page: z.coerce
    .number()
    .int("Page must be a whole number.")
    .min(1, "Page must be at least 1.")
    .default(1),

  pageSize: z.coerce
    .number()
    .int("Page size must be a whole number.")
    .min(1, "Page size must be at least 1.")
    .max(
      50,
      "Page size cannot exceed 50.",
    )
    .default(10),

  sort: z
    .enum([
      "LATEST",
      "PRICE_ASC",
      "PRICE_DESC",
      "PHARMACY_ASC",
    ])
    .default("LATEST"),
});

export type MedicineSearchInput = z.infer<
  typeof medicineSearchSchema
>;