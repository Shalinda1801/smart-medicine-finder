import {
  describe,
  expect,
  it,
} from "vitest";

import {
  assertUserCanSignIn,
  canUserSignIn,
} from "@/features/auth/account-rules";

import { AppError } from "@/lib/app-error";

describe("account status rules", () => {
  it("allows an active user to sign in", () => {
    expect(
      canUserSignIn("ACTIVE"),
    ).toBe(true);

    expect(() =>
      assertUserCanSignIn("ACTIVE"),
    ).not.toThrow();
  });

  it("does not allow a suspended user to sign in", () => {
    expect(
      canUserSignIn("SUSPENDED"),
    ).toBe(false);

    expect(() =>
      assertUserCanSignIn("SUSPENDED"),
    ).toThrow("This account has been suspended.");
  });

  it("does not allow a disabled user to sign in", () => {
    expect(
      canUserSignIn("DISABLED"),
    ).toBe(false);

    expect(() =>
      assertUserCanSignIn("DISABLED"),
    ).toThrow("This account has been disabled.");
  });

  it("returns the correct suspended-account error", () => {
    try {
      assertUserCanSignIn("SUSPENDED");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(AppError);

      if (error instanceof AppError) {
        expect(error.code).toBe(
          "ACCOUNT_SUSPENDED",
        );

        expect(error.statusCode).toBe(403);
      }
    }
  });
});