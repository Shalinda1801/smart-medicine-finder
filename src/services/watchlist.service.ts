import type {
  SessionPayload,
} from "@/features/auth/session";

import type {
  CreateWatchlistInput,
} from "@/features/notifications/notification.schema";

import {
  VerificationStatus,
} from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

function requireCustomer(
  session: SessionPayload,
) {
  if (session.role !== "CUSTOMER") {
    throw new AppError(
      "CUSTOMER_REQUIRED",
      "Only customers can manage medicine watchlists.",
      403,
    );
  }
}

export async function listWatchlist(
  session: SessionPayload,
) {
  requireCustomer(session);

  const watchlists =
    await prisma.watchlist.findMany({
      where: {
        customerId: session.userId,
        active: true,
      },

      select: {
        id: true,
        radiusKm: true,
        active: true,
        createdAt: true,
        updatedAt: true,

        medicine: {
          select: {
            id: true,
            code: true,
            genericName: true,
            brandName: true,
            dosage: true,
            form: true,
            activeIngredient: true,
            prescriptionRequired: true,

            inventory: {
              where: {
                isActive: true,

                pharmacy: {
                  is: {
                    verificationStatus:
                      VerificationStatus.APPROVED,
                  },
                },
              },

              select: {
                id: true,
                quantity: true,
                reservedQuantity: true,
                price: true,

                pharmacy: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                    district: true,
                  },
                },
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return watchlists.map(
    (watchlist) => {
      const availableAt =
        watchlist.medicine.inventory
          .map((inventory) => {
            const availableQuantity =
              Math.max(
                inventory.quantity -
                  inventory.reservedQuantity,
                0,
              );

            return {
              inventoryId:
                inventory.id,

              pharmacy:
                inventory.pharmacy,

              availableQuantity,

              price:
                Number(inventory.price),
            };
          })
          .filter(
            (inventory) =>
              inventory.availableQuantity >
              0,
          );

      return {
        id: watchlist.id,
        radiusKm:
          watchlist.radiusKm,
        active:
          watchlist.active,

        medicine: {
          id:
            watchlist.medicine.id,

          code:
            watchlist.medicine.code,

          genericName:
            watchlist.medicine
              .genericName,

          brandName:
            watchlist.medicine
              .brandName,

          dosage:
            watchlist.medicine
              .dosage,

          form:
            watchlist.medicine.form,

          activeIngredient:
            watchlist.medicine
              .activeIngredient,

          prescriptionRequired:
            watchlist.medicine
              .prescriptionRequired,
        },

        currentlyAvailable:
          availableAt.length > 0,

        availableAt,

        createdAt:
          watchlist.createdAt,

        updatedAt:
          watchlist.updatedAt,
      };
    },
  );
}

export async function addToWatchlist(
  session: SessionPayload,
  input: CreateWatchlistInput,
) {
  requireCustomer(session);

  const medicine =
    await prisma.medicine.findUnique({
      where: {
        id: input.medicineId,
      },

      select: {
        id: true,
        active: true,
      },
    });

  if (!medicine) {
    throw new AppError(
      "MEDICINE_NOT_FOUND",
      "Medicine was not found.",
      404,
    );
  }

  if (!medicine.active) {
    throw new AppError(
      "MEDICINE_INACTIVE",
      "This medicine is currently inactive.",
      409,
    );
  }

  const watchlist =
    await prisma.watchlist.upsert({
      where: {
        customerId_medicineId: {
          customerId:
            session.userId,

          medicineId:
            input.medicineId,
        },
      },

      update: {
        active: true,
        radiusKm:
          input.radiusKm,
      },

      create: {
        customerId:
          session.userId,

        medicineId:
          input.medicineId,

        radiusKm:
          input.radiusKm,

        active: true,
      },

      select: {
        id: true,
        radiusKm: true,
        active: true,
        createdAt: true,

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
    });

  return watchlist;
}

export async function removeFromWatchlist(
  session: SessionPayload,
  watchlistId: string,
) {
  requireCustomer(session);

  const watchlist =
    await prisma.watchlist.findFirst({
      where: {
        id: watchlistId,
        customerId:
          session.userId,
      },

      select: {
        id: true,
        active: true,
      },
    });

  if (!watchlist) {
    throw new AppError(
      "WATCHLIST_NOT_FOUND",
      "Watchlist item was not found.",
      404,
    );
  }

  if (!watchlist.active) {
    return {
      id: watchlist.id,
      message:
        "Medicine is already removed from the watchlist.",
    };
  }

  await prisma.watchlist.update({
    where: {
      id: watchlist.id,
    },

    data: {
      active: false,
    },
  });

  return {
    id: watchlist.id,

    message:
      "Medicine removed from watchlist successfully.",
  };
}