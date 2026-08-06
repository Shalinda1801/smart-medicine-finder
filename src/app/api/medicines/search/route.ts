import type { NextRequest } from "next/server";

import { medicineSearchSchema } from "@/features/search/search.schema";
import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";
import { validateInput } from "@/lib/validation";
import { searchMedicineAvailability } from "@/services/medicine.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rawInput = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    const input = validateInput(
      medicineSearchSchema,
      rawInput,
    );

    const result =
      await searchMedicineAvailability(input);

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}