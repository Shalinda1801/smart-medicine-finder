import { z } from "zod";

const optionalText = (maxLength: number) =>
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
      .max(maxLength)
      .optional(),
  );

export const adminPharmacyListSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100)
    .default(""),

  status: z
    .enum([
      "PENDING",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
    ])
    .optional(),

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

export const pharmacyVerificationSchema = z
  .object({
    status: z.enum([
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
    ]),

    reason: optionalText(500),
  })
  .refine(
    (data) =>
      data.status !== "REJECTED" ||
      Boolean(data.reason),
    {
      message:
        "A reason is required when rejecting a pharmacy.",
      path: ["reason"],
    },
  );

export const adminUserListSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100)
    .default(""),

  role: z
    .enum([
      "CUSTOMER",
      "PHARMACY_STAFF",
      "ADMIN",
    ])
    .optional(),

  status: z
    .enum([
      "ACTIVE",
      "SUSPENDED",
      "DISABLED",
    ])
    .optional(),

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

export const updateUserStatusSchema = z.object({
  status: z.enum([
    "ACTIVE",
    "SUSPENDED",
    "DISABLED",
  ]),
});

export const reviewDocumentSchema = z
  .object({
    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),

    reason: optionalText(500),
  })
  .refine(
    (data) =>
      data.status !== "REJECTED" ||
      Boolean(data.reason),
    {
      message:
        "A reason is required when rejecting a document.",
      path: ["reason"],
    },
  );

export const auditLogListSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type AdminPharmacyListInput =
  z.infer<typeof adminPharmacyListSchema>;

export type PharmacyVerificationInput =
  z.infer<typeof pharmacyVerificationSchema>;

export type AdminUserListInput =
  z.infer<typeof adminUserListSchema>;

export type UpdateUserStatusInput =
  z.infer<typeof updateUserStatusSchema>;

export type ReviewDocumentInput =
  z.infer<typeof reviewDocumentSchema>;

export type AuditLogListInput =
  z.infer<typeof auditLogListSchema>;