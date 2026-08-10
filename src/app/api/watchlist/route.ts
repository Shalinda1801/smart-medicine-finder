import type {
  NextRequest,
} from "next/server";

import {
  requireSession,
} from "@/features/auth/session";

import {
  createWatchlistSchema,
} from "@/features/notifications/notification.schema";

import { AppError } from "@/lib/app-error";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import {
  validateInput,
} from "@/lib/validation";

import {
  addToWatchlist,
  listWatchlist,
} from "@/services/watchlist.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
) {
  try {
    const session =
      await requireSession(request);

    const watchlist =
      await listWatchlist(
        session,
      );

    return apiSuccess({
      items:
        watchlist,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const session =
      await requireSession(request);

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
        createWatchlistSchema,
        body,
      );

    const watchlist =
      await addToWatchlist(
        session,
        input,
      );

    return apiSuccess(
      {
        watchlist,
      },
      201,
    );
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}