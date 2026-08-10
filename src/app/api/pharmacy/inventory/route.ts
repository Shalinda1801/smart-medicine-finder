import type { NextRequest } from "next/server";

import { requireSession } from "@/features/auth/session";

import {
  createInventorySchema,
  inventoryListSchema,
} from "@/features/inventory/inventory.schema";

import { AppError } from "@/lib/app-error";

import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import { validateInput } from "@/lib/validation";

import {
  createInventoryItem,
  listPharmacyInventory,
} from "@/services/inventory.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
) {
  try {
    const session =
      await requireSession(request);

    const rawInput = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    const input = validateInput(
      inventoryListSchema,
      rawInput,
    );

    const result =
      await listPharmacyInventory(
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
      body = await request.json();
    } catch {
      throw new AppError(
        "INVALID_JSON",
        "Request body must contain valid JSON.",
        400,
      );
    }

    const input = validateInput(
      createInventorySchema,
      body,
    );

    const inventory =
      await createInventoryItem(
        session,
        input,
      );

    return apiSuccess(
      {
        inventory,
      },
      201,
    );
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}