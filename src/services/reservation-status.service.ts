import { randomInt } from "node:crypto";

import type { SessionPayload } from "@/features/auth/session";

import type {
  UpdateReservationStatusInput,
} from "@/features/reservations/reservation.schema";

import {
  ReservationStatus,
} from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

const ACTIVE_STATUSES =
  new Set<ReservationStatus>([
    ReservationStatus.PENDING,
    ReservationStatus.CONFIRMED,
    ReservationStatus.READY_FOR_PICKUP,
  ]);

function generatePickupCode(): string {
  return randomInt(
    100000,
    1000000,
  ).toString();
}

function canTransition(
  current: ReservationStatus,
  next: ReservationStatus,
): boolean {
  const transitions: Record<
    ReservationStatus,
    ReservationStatus[]
  > = {
    PENDING: [
      ReservationStatus.CONFIRMED,
      ReservationStatus.CANCELLED,
    ],

    CONFIRMED: [
      ReservationStatus.READY_FOR_PICKUP,
      ReservationStatus.CANCELLED,
    ],

    READY_FOR_PICKUP: [
      ReservationStatus.COLLECTED,
      ReservationStatus.CANCELLED,
    ],

    COLLECTED: [],

    CANCELLED: [],

    EXPIRED: [],
  };

  return transitions[current].includes(next);
}

async function assertStaffOwnsPharmacy(
  userId: string,
  pharmacyId: string,
) {
  const membership =
    await prisma.pharmacyMember.findFirst({
      where: {
        userId,
        pharmacyId,
      },

      select: {
        id: true,
      },
    });

  if (!membership) {
    throw new AppError(
      "FORBIDDEN",
      "You cannot manage reservations belonging to another pharmacy.",
      403,
    );
  }
}

async function authorizeStatusChange(
  session: SessionPayload,
  reservation: {
    customerId: string;
    pharmacyId: string;
  },
  nextStatus: ReservationStatus,
) {
  if (session.role === "CUSTOMER") {
    if (
      reservation.customerId !==
      session.userId
    ) {
      throw new AppError(
        "FORBIDDEN",
        "You cannot change another customer's reservation.",
        403,
      );
    }

    if (
      nextStatus !==
      ReservationStatus.CANCELLED
    ) {
      throw new AppError(
        "FORBIDDEN",
        "Customers can only cancel their reservations.",
        403,
      );
    }

    return;
  }

  if (
    session.role === "PHARMACY_STAFF"
  ) {
    await assertStaffOwnsPharmacy(
      session.userId,
      reservation.pharmacyId,
    );

    return;
  }

  throw new AppError(
    "FORBIDDEN",
    "You do not have permission to change reservation status.",
    403,
  );
}

export async function updateReservationStatus(
  session: SessionPayload,
  reservationId: string,
  input: UpdateReservationStatusInput,
) {
  const nextStatus =
    input.status as ReservationStatus;

  const basicReservation =
    await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },

      select: {
        id: true,
        customerId: true,
        pharmacyId: true,
        status: true,
        expiresAt: true,
      },
    });

  if (!basicReservation) {
    throw new AppError(
      "RESERVATION_NOT_FOUND",
      "Reservation was not found.",
      404,
    );
  }

  await authorizeStatusChange(
    session,
    basicReservation,
    nextStatus,
  );

 if (
  ACTIVE_STATUSES.has(
    basicReservation.status,
  ) &&
  basicReservation.expiresAt <
    new Date()
) {
    await expireReservation(
      reservationId,
    );

    throw new AppError(
      "RESERVATION_EXPIRED",
      "This reservation has expired.",
      409,
    );
  }

  if (
    !canTransition(
      basicReservation.status,
      nextStatus,
    )
  ) {
    throw new AppError(
      "INVALID_RESERVATION_TRANSITION",
      `Reservation cannot change from ${basicReservation.status} to ${nextStatus}.`,
      409,
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const reservation =
        await tx.reservation.findUnique({
          where: {
            id: reservationId,
          },

          select: {
            id: true,
            customerId: true,
            pharmacyId: true,
            status: true,
            pickupCode: true,
            expiresAt: true,

            items: {
              select: {
                id: true,
                quantity: true,
                inventoryId: true,
              },
            },
          },
        });

      if (!reservation) {
        throw new AppError(
          "RESERVATION_NOT_FOUND",
          "Reservation was not found.",
          404,
        );
      }

      if (
        reservation.status !==
        basicReservation.status
      ) {
        throw new AppError(
          "RESERVATION_CHANGED",
          "Reservation status changed. Please refresh and try again.",
          409,
        );
      }

      if (
        nextStatus ===
        ReservationStatus.CANCELLED
      ) {
        for (
          const item of
          reservation.items
        ) {
          const result =
            await tx.inventory.updateMany({
              where: {
                id: item.inventoryId,

                reservedQuantity: {
                  gte: item.quantity,
                },
              },

              data: {
                reservedQuantity: {
                  decrement:
                    item.quantity,
                },
              },
            });

          if (result.count !== 1) {
            throw new AppError(
              "STOCK_RELEASE_FAILED",
              "Reserved stock could not be released safely.",
              409,
            );
          }
        }
      }

      if (
        nextStatus ===
        ReservationStatus.COLLECTED
      ) {
        for (
          const item of
          reservation.items
        ) {
          const result =
            await tx.inventory.updateMany({
              where: {
                id: item.inventoryId,

                quantity: {
                  gte: item.quantity,
                },

                reservedQuantity: {
                  gte: item.quantity,
                },
              },

              data: {
                quantity: {
                  decrement:
                    item.quantity,
                },

                reservedQuantity: {
                  decrement:
                    item.quantity,
                },
              },
            });

          if (result.count !== 1) {
            throw new AppError(
              "STOCK_COLLECTION_FAILED",
              "Inventory could not be updated safely.",
              409,
            );
          }
        }
      }

      const pickupCode =
        nextStatus ===
          ReservationStatus.CONFIRMED &&
        !reservation.pickupCode
          ? generatePickupCode()
          : reservation.pickupCode;

      return tx.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status: nextStatus,

          ...(pickupCode
            ? {
                pickupCode,
              }
            : {}),
        },

        select: {
          id: true,
          customerId: true,
          pharmacyId: true,
          status: true,
          pickupCode: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,

          pharmacy: {
            select: {
              id: true,
              name: true,
              city: true,
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
        },
      });
    },
    {
      isolationLevel: "Serializable",
    },
  );
}

export async function expireReservation(
  reservationId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const reservation =
        await tx.reservation.findUnique({
          where: {
            id: reservationId,
          },

          select: {
            id: true,
            status: true,
            expiresAt: true,

            items: {
              select: {
                inventoryId: true,
                quantity: true,
              },
            },
          },
        });

      if (!reservation) {
        return null;
      }

    if (
  !ACTIVE_STATUSES.has(
    reservation.status,
  )
) {
  return null;
}

      if (
        reservation.expiresAt >
        new Date()
      ) {
        return null;
      }

      for (
        const item of reservation.items
      ) {
        await tx.inventory.updateMany({
          where: {
            id: item.inventoryId,

            reservedQuantity: {
              gte: item.quantity,
            },
          },

          data: {
            reservedQuantity: {
              decrement:
                item.quantity,
            },
          },
        });
      }

      return tx.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status:
            ReservationStatus.EXPIRED,
        },
      });
    },
  );
}