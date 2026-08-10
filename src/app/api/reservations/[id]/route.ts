import type {
  NextRequest,
} from "next/server";

import {
  requireSession,
} from "@/features/auth/session";

import {
  updateReservationStatusSchema,
} from "@/features/reservations/reservation.schema";

import { AppError } from "@/lib/app-error";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import {
  validateInput,
} from "@/lib/validation";

import {
  updateReservationStatus,
} from "@/services/reservation-status.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
        "RESERVATION_ID_REQUIRED",
        "Reservation ID is required.",
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

    const input = validateInput(
      updateReservationStatusSchema,
      body,
    );

    const reservation =
      await updateReservationStatus(
        session,
        id,
        input,
      );

    return apiSuccess({
      reservation,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}