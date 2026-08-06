import type { NextRequest } from "next/server";

import {
  jwtVerify,
  SignJWT,
} from "jose";

import {
  isUserRole,
  type UserRole,
} from "@/features/auth/roles";

import { AppError } from "@/lib/app-error";

export const SESSION_COOKIE_NAME =
  "smf_session";

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 7;

const SESSION_ISSUER =
  "smart-medicine-finder";

const SESSION_AUDIENCE =
  "smart-medicine-finder-users";

export type SessionPayload = {
  userId: string;
  role: UserRole;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must contain at least 32 characters.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(
      `${SESSION_DURATION_SECONDS}s`,
    )
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey(),
      {
        algorithms: ["HS256"],
        issuer: SESSION_ISSUER,
        audience: SESSION_AUDIENCE,
      },
    );

    if (
      typeof payload.userId !== "string" ||
      !isUserRole(payload.role)
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function getRequestSession(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token =
    request.cookies.get(
      SESSION_COOKIE_NAME,
    )?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function requireSession(
  request: NextRequest,
): Promise<SessionPayload> {
  const session =
    await getRequestSession(request);

  if (!session) {
    throw new AppError(
      "UNAUTHENTICATED",
      "Please sign in to continue.",
      401,
    );
  }

  return session;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}