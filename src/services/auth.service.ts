import type {
  LoginInput,
  RegisterInput,
} from "@/features/auth/auth.schema";

import {
  assertUserCanSignIn,
} from "@/features/auth/account-rules";

import {
  hashPassword,
  verifyPassword,
} from "@/features/auth/password";

import {
  UserRole,
  UserStatus,
} from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

const safeUserSelection = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
} as const;

function isUniqueConstraintError(
  error: unknown,
): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function registerUser(
  input: RegisterInput,
) {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
      },
    });

  if (existingUser) {
    throw new AppError(
      "EMAIL_ALREADY_REGISTERED",
      "An account already exists with this email.",
      409,
    );
  }

  const passwordHash =
    await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
      select: safeUserSelection,
    });
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      throw new AppError(
        "EMAIL_ALREADY_REGISTERED",
        "An account already exists with this email.",
        409,
      );
    }

    throw error;
  }
}

export async function authenticateUser(
  input: LoginInput,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

  if (!user?.passwordHash) {
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
      401,
    );
  }

  assertUserCanSignIn(user.status);

  const passwordMatches =
    await verifyPassword(
      input.password,
      user.passwordHash,
    );

  if (!passwordMatches) {
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
      401,
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export async function getUserById(
  userId: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: safeUserSelection,
    });

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "The authenticated user no longer exists.",
      401,
    );
  }

  assertUserCanSignIn(user.status);

  return user;
}