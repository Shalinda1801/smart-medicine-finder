import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters.")
  .max(80, "Name cannot exceed 80 characters.");

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(254, "Email address is too long.")
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(72, "Password cannot exceed 72 characters.")
  .regex(
    /[A-Z]/,
    "Password must contain an uppercase letter.",
  )
  .regex(
    /[a-z]/,
    "Password must contain a lowercase letter.",
  )
  .regex(
    /[0-9]/,
    "Password must contain a number.",
  );

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,

    confirmPassword: z.string().min(
      1,
      "Please confirm your password.",
    ),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(1, "Password is required."),
});

export type RegisterInput = z.infer<
  typeof registerSchema
>;

export type LoginInput = z.infer<
  typeof loginSchema
>;