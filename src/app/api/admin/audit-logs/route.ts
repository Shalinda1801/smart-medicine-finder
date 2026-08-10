import type {
  NextRequest,
} from "next/server";

import {
  auditLogListSchema,
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
  listAuditLogs,
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
        auditLogListSchema,
        rawInput,
      );

    const result =
      await listAuditLogs(
        session,
        input,
      );

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}