import type {
  NextRequest,
} from "next/server";

import {
  requireSession,
} from "@/features/auth/session";

import { AppError } from "@/lib/app-error";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import {
  markNotificationRead,
} from "@/services/notification.service";

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
        "NOTIFICATION_ID_REQUIRED",
        "Notification ID is required.",
        400,
      );
    }

    const notification =
      await markNotificationRead(
        session,
        id,
      );

    return apiSuccess({
      notification,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}