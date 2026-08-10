import type {
  NextRequest,
} from "next/server";

import {
  reviewDocumentSchema,
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
  reviewVerificationDocument,
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
        "DOCUMENT_ID_REQUIRED",
        "Document ID is required.",
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
        reviewDocumentSchema,
        body,
      );

    const document =
      await reviewVerificationDocument(
        session,
        id,
        input,
      );

    return apiSuccess({
      document,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}