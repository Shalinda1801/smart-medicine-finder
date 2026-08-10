import type {
  NextRequest,
} from "next/server";

import {
  requireSession,
} from "@/features/auth/session";

import {
  notificationListSchema,
} from "@/features/notifications/notification.schema";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import {
  validateInput,
} from "@/lib/validation";

import {
  listNotifications,
} from "@/services/notification.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
) {
  try {
    const session =
      await requireSession(request);

    const rawInput =
      Object.fromEntries(
        request.nextUrl
          .searchParams.entries(),
      );

    const input =
      validateInput(
        notificationListSchema,
        rawInput,
      );

    const result =
      await listNotifications(
        session,
        input,
      );

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}