import type { NextRequest } from "next/server";

import { requireSession } from "@/features/auth/session";

import { updateInventorySchema } from "@/features/inventory/inventory.schema";

import { AppError } from "@/lib/app-error";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import { validateInput } from "@/lib/validation";

import {
  deactivateInventoryItem,
  updateInventoryItem,
} from "@/services/inventory.service";

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

    const { id } = await context.params;

    if (!id.trim()) {
      throw new AppError(
        "INVENTORY_ID_REQUIRED",
        "Inventory ID is required.",
        400,
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      throw new AppError(
        "INVALID_JSON",
        "Request body must contain valid JSON.",
        400,
      );
    }

    const input = validateInput(
      updateInventorySchema,
      body,
    );

    const inventory =
      await updateInventoryItem(
        session,
        id,
        input,
      );

    return apiSuccess({
      inventory,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const session =
      await requireSession(request);

    const { id } = await context.params;

    if (!id.trim()) {
      throw new AppError(
        "INVENTORY_ID_REQUIRED",
        "Inventory ID is required.",
        400,
      );
    }

    const result =
      await deactivateInventoryItem(
        session,
        id,
      );

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}