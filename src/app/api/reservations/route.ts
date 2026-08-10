import type {
  NextRequest,
} from "next/server";

import {
  requireSession,
} from "@/features/auth/session";

import {
  createReservationSchema,
  reservationListSchema,
} from "@/features/reservations/reservation.schema";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import { AppError } from "@/lib/app-error";
import { validateInput } from "@/lib/validation";

import {
  createReservation,
  listReservations,
} from "@/services/reservation.service";

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

    const input = validateInput(
      reservationListSchema,
      rawInput,
    );

    const result =
      await listReservations(
        session,
        input,
      );

    return apiSuccess(result);
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

    const input = validateInput(
      createReservationSchema,
      body,
    );

    const reservation =
      await createReservation(
        session,
        input,
      );

    return apiSuccess(
      {
        reservation,
      },
      201,
    );
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}