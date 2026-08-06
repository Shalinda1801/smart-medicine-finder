import {
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/features/auth/session";
import { apiSuccess } from "@/lib/api-response";

export const runtime = "nodejs";

export async function POST() {
  const response = apiSuccess({
    message: "Signed out successfully.",
  });

  response.cookies.set(
    SESSION_COOKIE_NAME,
    "",
    {
      ...getSessionCookieOptions(),
      maxAge: 0,
    },
  );

  return response;
}