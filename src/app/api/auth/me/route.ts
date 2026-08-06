import type { NextRequest } from "next/server";

import { requireSession } from "@/features/auth/session";
import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";
import { getUserById } from "@/services/auth.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);

    const user = await getUserById(
      session.userId,
    );

    return apiSuccess({
      user,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}