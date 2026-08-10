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
  removeFromWatchlist,
} from "@/services/watchlist.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
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
        "WATCHLIST_ID_REQUIRED",
        "Watchlist ID is required.",
        400,
      );
    }

    const result =
      await removeFromWatchlist(
        session,
        id,
      );

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}