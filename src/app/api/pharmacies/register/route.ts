import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import {
  validateInput,
} from "@/lib/validation";

import {
  pharmacyRegistrationSchema,
} from "@/features/pharmacy/pharmacy-registration.schema";

import {
  registerPharmacy,
} from "@/services/pharmacy-registration.service";

export const runtime =
  "nodejs";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const input =
      validateInput(
        pharmacyRegistrationSchema,
        body,
      );

    const result =
      await registerPharmacy(
        input,
      );

    return apiSuccess(
      result,
      201,
    );
  } catch (
    error: unknown
  ) {
    return handleRouteError(
      error,
    );
  }
}