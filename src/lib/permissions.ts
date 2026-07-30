import type {
  UserRole,
} from "@/features/auth/roles";

import { AppError } from "@/lib/app-error";

export const PERMISSIONS = [
  "MEDICINE_READ",
  "RESERVATION_CREATE",
  "RESERVATION_READ_OWN",
  "RESERVATION_MANAGE_PHARMACY",
  "INVENTORY_MANAGE",
  "PHARMACY_APPLICATION_CREATE",
  "PHARMACY_VERIFY",
  "USER_MANAGE",
  "AUDIT_LOG_READ",
] as const;

export type Permission =
  (typeof PERMISSIONS)[number];

const rolePermissions: Record<
  UserRole,
  readonly Permission[]
> = {
  CUSTOMER: [
    "MEDICINE_READ",
    "RESERVATION_CREATE",
    "RESERVATION_READ_OWN",
  ],

  PHARMACY_STAFF: [
    "MEDICINE_READ",
    "RESERVATION_MANAGE_PHARMACY",
    "INVENTORY_MANAGE",
    "PHARMACY_APPLICATION_CREATE",
  ],

  ADMIN: [
    "MEDICINE_READ",
    "PHARMACY_VERIFY",
    "USER_MANAGE",
    "AUDIT_LOG_READ",
  ],
};

export function hasRole(
  currentRole: UserRole,
  allowedRoles: readonly UserRole[],
): boolean {
  return allowedRoles.includes(currentRole);
}

export function requireRole(
  currentRole: UserRole,
  allowedRoles: readonly UserRole[],
): void {
  if (!hasRole(currentRole, allowedRoles)) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission to perform this action.",
      403,
    );
  }
}

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return rolePermissions[role].includes(
    permission,
  );
}

export function requirePermission(
  role: UserRole,
  permission: Permission,
): void {
  if (!hasPermission(role, permission)) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission to perform this action.",
      403,
    );
  }
}

export function getPermissionsForRole(
  role: UserRole,
): readonly Permission[] {
  return rolePermissions[role];
}