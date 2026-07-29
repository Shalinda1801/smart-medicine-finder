import { z } from "zod";

import {
  AppError,
  type FieldErrors,
} from "@/lib/app-error";

function createFieldErrors(
  error: z.ZodError,
): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const fieldName =
      issue.path.length > 0
        ? issue.path.join(".")
        : "_root";

    if (!fieldErrors[fieldName]) {
      fieldErrors[fieldName] = [];
    }

    fieldErrors[fieldName].push(issue.message);
  }

  return fieldErrors;
}

export function validateInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Please correct the provided information.",
      400,
      createFieldErrors(result.error),
    );
  }

  return result.data;
}