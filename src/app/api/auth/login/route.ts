import type { NextRequest } from "next/server";

import { loginSchema } from "@/features/auth/auth.schema";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/features/auth/session";
import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";
import { AppError } from "@/lib/app-error";
import { validateInput } from "@/lib/validation";
import { authenticateUser } from "@/services/auth.service";

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
      loginSchema,
      body,
    );

    const user = await authenticateUser(input);

    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
    });

    const response = apiSuccess({
      user,
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions(),
    );

    return response;
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}