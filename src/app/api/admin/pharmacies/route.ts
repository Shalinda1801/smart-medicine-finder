import type {
  NextRequest,
} from "next/server";

import {
  adminPharmacyListSchema,
} from "@/features/admin/admin.schema";

import {
  requireSession,
} from "@/features/auth/session";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import {
  validateInput,
} from "@/lib/validation";

import {
  listAdminPharmacies,
} from "@/services/admin.service";

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
        adminPharmacyListSchema,
        rawInput,
      );

    const result =
      await listAdminPharmacies(
        session,
        input,
      );

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}