import { z } from "zod";

export const pharmacyRegistrationSchema =
  z
    .object({
      ownerName: z
        .string()
        .trim()
        .min(2, "Owner name is required.")
        .max(100),

      email: z
        .string()
        .trim()
        .email("Enter a valid email address."),

      password: z
        .string()
        .min(
          8,
          "Password must contain at least 8 characters.",
        ),

      confirmPassword: z.string(),

      pharmacyName: z
        .string()
        .trim()
        .min(2, "Pharmacy name is required.")
        .max(150),

      licenceNumber: z
        .string()
        .trim()
        .min(
          3,
          "Pharmacy licence number is required.",
        )
        .max(100),

      phone: z
        .string()
        .trim()
        .min(7, "Phone number is required.")
        .max(30),

      addressLine1: z
        .string()
        .trim()
        .min(3, "Address is required.")
        .max(200),

      addressLine2: z
        .string()
        .trim()
        .max(200)
        .optional(),

      city: z
        .string()
        .trim()
        .min(2, "City is required.")
        .max(80),

      district: z
        .string()
        .trim()
        .max(80)
        .optional(),

      postalCode: z
        .string()
        .trim()
        .max(20)
        .optional(),

      latitude: z
        .number()
        .min(-90)
        .max(90),

      longitude: z
        .number()
        .min(-180)
        .max(180),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        path: ["confirmPassword"],
        message:
          "Passwords do not match.",
      },
    );

export type PharmacyRegistrationInput =
  z.infer<
    typeof pharmacyRegistrationSchema
  >;