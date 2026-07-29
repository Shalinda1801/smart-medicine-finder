import { NextResponse } from "next/server";

import {
  AppError,
  type FieldErrors,
} from "@/lib/app-error";

export function apiSuccess<T>(
  data: T,
  statusCode = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status: statusCode,
    },
  );
}

export function apiError(
  code: string,
  message: string,
  statusCode = 500,
  fieldErrors?: FieldErrors,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(fieldErrors ? { fieldErrors } : {}),
      },
    },
    {
      status: statusCode,
    },
  );
}

export function handleRouteError(
  error: unknown,
): NextResponse {
  if (error instanceof AppError) {
    return apiError(
      error.code,
      error.message,
      error.statusCode,
      error.fieldErrors,
    );
  }

  console.error("Unexpected API error:", error);

  return apiError(
    "INTERNAL_SERVER_ERROR",
    "An unexpected server error occurred.",
    500,
  );
}