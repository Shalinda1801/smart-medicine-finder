import type { NextRequest } from "next/server";

import { registerSchema } from "@/features/auth/auth.schema";
import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";
import { AppError } from "@/lib/app-error";
import { validateInput } from "@/lib/validation";
import { registerUser } from "@/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      throw new AppError(
        "INVALID_JSON",
        "Request body must contain valid JSON.",
        400,
      );
    }

    const input = validateInput(
      registerSchema,
      body,
    );

    const user = await registerUser(input);

    return apiSuccess(
      {
        user,
      },
      201,
    );
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}