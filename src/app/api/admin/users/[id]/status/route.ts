import type {
  NextRequest,
} from "next/server";

import {
  updateUserStatusSchema,
} from "@/features/admin/admin.schema";

import {
  requireSession,
} from "@/features/auth/session";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import { AppError } from "@/lib/app-error";

import {
  validateInput,
} from "@/lib/validation";

import {
  updateUserStatus,
} from "@/services/admin.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const session =
      await requireSession(request);

    const { id } =
      await context.params;

    if (!id.trim()) {
      throw new AppError(
        "USER_ID_REQUIRED",
        "User ID is required.",
        400,
      );
    }

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      throw new AppError(
        "INVALID_JSON",
        "Request body must contain valid JSON.",
        400,
      );
    }

    const input =
      validateInput(
        updateUserStatusSchema,
        body,
      );

    const user =
      await updateUserStatus(
        session,
        id,
        input,
      );

    return apiSuccess({
      user,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}