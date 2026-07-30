import {
  describe,
  expect,
  it,
} from "vitest";

import { AppError } from "@/lib/app-error";

import {
  getPermissionsForRole,
  hasPermission,
  hasRole,
  requirePermission,
  requireRole,
} from "@/lib/permissions";

describe("role permissions", () => {
  it("allows customers to create reservations", () => {
    expect(
      hasPermission(
        "CUSTOMER",
        "RESERVATION_CREATE",
      ),
    ).toBe(true);
  });

  it("does not allow customers to manage inventory", () => {
    expect(
      hasPermission(
        "CUSTOMER",
        "INVENTORY_MANAGE",
      ),
    ).toBe(false);
  });

  it("allows pharmacy staff to manage inventory", () => {
    expect(
      hasPermission(
        "PHARMACY_STAFF",
        "INVENTORY_MANAGE",
      ),
    ).toBe(true);
  });

  it("allows administrators to verify pharmacies", () => {
    expect(
      hasPermission(
        "ADMIN",
        "PHARMACY_VERIFY",
      ),
    ).toBe(true);
  });

  it("checks allowed roles", () => {
    expect(
      hasRole(
        "ADMIN",
        ["ADMIN"],
      ),
    ).toBe(true);

    expect(
      hasRole(
        "CUSTOMER",
        ["ADMIN", "PHARMACY_STAFF"],
      ),
    ).toBe(false);
  });

  it("throws when a role is not allowed", () => {
    expect(() =>
      requireRole(
        "CUSTOMER",
        ["ADMIN"],
      ),
    ).toThrow(AppError);
  });

  it("throws when permission is missing", () => {
    expect(() =>
      requirePermission(
        "CUSTOMER",
        "AUDIT_LOG_READ",
      ),
    ).toThrow(
      "You do not have permission to perform this action.",
    );
  });

  it("returns permissions assigned to a role", () => {
    const permissions =
      getPermissionsForRole("ADMIN");

    expect(permissions).toContain(
      "PHARMACY_VERIFY",
    );

    expect(permissions).toContain(
      "USER_MANAGE",
    );
  });
});