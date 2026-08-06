import { AppError } from "@/lib/app-error";

export const USER_STATUSES = [
  "ACTIVE",
  "SUSPENDED",
  "DISABLED",
] as const;

export type UserStatus =
  (typeof USER_STATUSES)[number];

export function canUserSignIn(
  status: UserStatus,
): boolean {
  return status === "ACTIVE";
}

export function assertUserCanSignIn(
  status: UserStatus,
): void {
  if (status === "ACTIVE") {
    return;
  }

  if (status === "SUSPENDED") {
    throw new AppError(
      "ACCOUNT_SUSPENDED",
      "This account has been suspended.",
      403,
    );
  }

  throw new AppError(
    "ACCOUNT_DISABLED",
    "This account has been disabled.",
    403,
  );
}