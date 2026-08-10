import type {
  SessionPayload,
} from "@/features/auth/session";

import type {
  CreateReservationInput,
  ReservationListInput,
} from "@/features/reservations/reservation.schema";

import {
  ReservationStatus,
  VerificationStatus,
} from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

const RESERVATION_MINUTES = 30;
const TRANSACTION_RETRIES = 3;

const reservationSelection = {
  id: true,
  customerId: true,
  pharmacyId: true,
  status: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,

  pharmacy: {
    select: {
      id: true,
      name: true,
      city: true,
      phone: true,
    },
  },

  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,

      inventory: {
        select: {
          id: true,

          medicine: {
            select: {
              id: true,
              code: true,
              genericName: true,
              brandName: true,
              dosage: true,
              form: true,
            },
          },
        },
      },
    },
  },
} as const;

function getExpiryTime(): Date {
  return new Date(
    Date.now() +
      RESERVATION_MINUTES * 60 * 1000,
  );
}

function isTransactionConflict(
  error: unknown,
): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2034"
  );
}

async function runSerializableTransaction<T>(
  operation: (
    tx: Parameters<
      Parameters<
        typeof prisma.$transaction
      >[0]
    >[0],
  ) => Promise<T>,
): Promise<T> {
  for (
    let attempt = 1;
    attempt <= TRANSACTION_RETRIES;
    attempt++
  ) {
    try {
      return await prisma.$transaction(
        operation,
        {
          isolationLevel: "Serializable",
        },
      );
    } catch (error: unknown) {
      if (
        isTransactionConflict(error) &&
        attempt < TRANSACTION_RETRIES
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new AppError(
    "RESERVATION_CONFLICT",
    "The reservation could not be completed. Please try again.",
    409,
  );
}

export async function createReservation(
  session: SessionPayload,
  input: CreateReservationInput,
) {
  if (session.role !== "CUSTOMER") {
    throw new AppError(
      "CUSTOMER_REQUIRED",
      "Only customers can create reservations.",
      403,
    );
  }

  try {
    return await runSerializableTransaction(
      async (tx) => {
        const inventory =
          await tx.inventory.findUnique({
            where: {
              id: input.inventoryId,
            },

            select: {
              id: true,
              pharmacyId: true,
              quantity: true,
              reservedQuantity: true,
              price: true,
              isActive: true,

              pharmacy: {
                select: {
                  verificationStatus: true,
                },
              },
            },
          });

        if (!inventory) {
          throw new AppError(
            "INVENTORY_NOT_FOUND",
            "The selected inventory item was not found.",
            404,
          );
        }

        if (!inventory.isActive) {
          throw new AppError(
            "INVENTORY_INACTIVE",
            "This medicine is currently unavailable.",
            409,
          );
        }

        if (
          inventory.pharmacy
            .verificationStatus !==
          VerificationStatus.APPROVED
        ) {
          throw new AppError(
            "PHARMACY_NOT_APPROVED",
            "Reservations are only available from approved pharmacies.",
            409,
          );
        }

        const availableQuantity =
          inventory.quantity -
          inventory.reservedQuantity;

        if (
          availableQuantity <
          input.quantity
        ) {
          throw new AppError(
            "INSUFFICIENT_STOCK",
            `Only ${Math.max(
              availableQuantity,
              0,
            )} item(s) are currently available.`,
            409,
          );
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },

          data: {
            reservedQuantity: {
              increment: input.quantity,
            },
          },
        });

        const reservation =
          await tx.reservation.create({
            data: {
              customerId:
                session.userId,

              pharmacyId:
                inventory.pharmacyId,

              status:
                ReservationStatus.PENDING,

              expiresAt:
                getExpiryTime(),

              items: {
                create: {
                  inventoryId:
                    inventory.id,

                  quantity:
                    input.quantity,

                  unitPrice:
                    inventory.price,
                },
              },
            },

            select:
              reservationSelection,
          });

        return reservation;
      },
    );
  } catch (error: unknown) {
    if (isTransactionConflict(error)) {
      throw new AppError(
        "RESERVATION_CONFLICT",
        "Stock changed while the reservation was being created. Please try again.",
        409,
      );
    }

    throw error;
  }
}

export async function listReservations(
  session: SessionPayload,
  input: ReservationListInput,
) {
  const skip =
    (input.page - 1) *
    input.pageSize;

  if (session.role === "CUSTOMER") {
    const where = {
      customerId: session.userId,
    };

    const [totalItems, reservations] =
      await prisma.$transaction([
        prisma.reservation.count({
          where,
        }),

        prisma.reservation.findMany({
          where,

          select:
            reservationSelection,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: input.pageSize,
        }),
      ]);

    return {
      items: reservations,

      pagination: {
        page: input.page,
        pageSize: input.pageSize,
        totalItems,

        totalPages: Math.max(
          Math.ceil(
            totalItems /
              input.pageSize,
          ),
          1,
        ),
      },
    };
  }

  if (
    session.role ===
    "PHARMACY_STAFF"
  ) {
    const membership =
      await prisma.pharmacyMember.findFirst({
        where: {
          userId: session.userId,
        },

        select: {
          pharmacyId: true,
        },
      });

    if (!membership) {
      throw new AppError(
        "PHARMACY_MEMBERSHIP_NOT_FOUND",
        "No pharmacy is assigned to this account.",
        403,
      );
    }

    const where = {
      pharmacyId:
        membership.pharmacyId,
    };

    const [totalItems, reservations] =
      await prisma.$transaction([
        prisma.reservation.count({
          where,
        }),

        prisma.reservation.findMany({
          where,

          select:
            reservationSelection,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: input.pageSize,
        }),
      ]);

    return {
      items: reservations,

      pagination: {
        page: input.page,
        pageSize: input.pageSize,
        totalItems,

        totalPages: Math.max(
          Math.ceil(
            totalItems /
              input.pageSize,
          ),
          1,
        ),
      },
    };
  }

  if (session.role === "ADMIN") {
    const [totalItems, reservations] =
      await prisma.$transaction([
        prisma.reservation.count(),

        prisma.reservation.findMany({
          select:
            reservationSelection,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: input.pageSize,
        }),
      ]);

    return {
      items: reservations,

      pagination: {
        page: input.page,
        pageSize: input.pageSize,
        totalItems,

        totalPages: Math.max(
          Math.ceil(
            totalItems /
              input.pageSize,
          ),
          1,
        ),
      },
    };
  }

  throw new AppError(
    "FORBIDDEN",
    "You do not have permission to view reservations.",
    403,
  );
}