import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  VerificationStatus,
} from "@/generated/prisma/enums";

import type {
  MedicineSearchInput,
} from "@/features/search/search.schema";

import { prisma } from "@/lib/db";

import {
  getStockSummary,
} from "@/utils/stock-status";

function getInventoryOrder(
  sort: MedicineSearchInput["sort"],
): Prisma.InventoryOrderByWithRelationInput[] {
  switch (sort) {
    case "PRICE_ASC":
      return [
        {
          price: "asc",
        },
        {
          updatedAt: "desc",
        },
      ];

    case "PRICE_DESC":
      return [
        {
          price: "desc",
        },
        {
          updatedAt: "desc",
        },
      ];

    case "PHARMACY_ASC":
      return [
        {
          pharmacy: {
            name: "asc",
          },
        },
        {
          updatedAt: "desc",
        },
      ];

    case "LATEST":
    default:
      return [
        {
          updatedAt: "desc",
        },
      ];
  }
}

export async function searchMedicineAvailability(
  input: MedicineSearchInput,
) {
  const query = input.q.trim();
  const city = input.city?.trim();

  const medicineFilter: Prisma.MedicineWhereInput =
    {
      active: true,

      ...(query
        ? {
            OR: [
              {
                genericName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                brandName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                activeIngredient: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                dosage: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                form: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

  const pharmacyFilter: Prisma.PharmacyWhereInput =
    {
      verificationStatus:
        VerificationStatus.APPROVED,

      ...(city
        ? {
            city: {
              equals: city,
              mode: "insensitive",
            },
          }
        : {}),
    };

  const where: Prisma.InventoryWhereInput = {
    medicine: {
      is: medicineFilter,
    },

    pharmacy: {
      is: pharmacyFilter,
    },

    // Return rows where:
    // reservedQuantity < quantity
    reservedQuantity: {
      lt: prisma.inventory.fields.quantity,
    },
  };

  const skip =
    (input.page - 1) * input.pageSize;

  const [totalItems, inventoryRows] =
    await prisma.$transaction([
      prisma.inventory.count({
        where,
      }),

      prisma.inventory.findMany({
        where,

        orderBy: getInventoryOrder(
          input.sort,
        ),

        skip,
        take: input.pageSize,

        select: {
          id: true,
          quantity: true,
          reservedQuantity: true,
          lowStockThreshold: true,
          price: true,
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
            },
          },

          pharmacy: {
            select: {
              id: true,
              slug: true,
              name: true,
              phone: true,
              addressLine1: true,
              addressLine2: true,
              city: true,
              district: true,
              latitude: true,
              longitude: true,
              verificationStatus: true,
            },
          },
        },
      }),
    ]);

  const items = inventoryRows.map(
    (inventory) => {
      const stock = getStockSummary(
        inventory.quantity,
        inventory.reservedQuantity,
        inventory.lowStockThreshold,
      );

      return {
        inventoryId: inventory.id,

        medicine: inventory.medicine,
        pharmacy: inventory.pharmacy,

        stock: {
          availableQuantity:
            stock.availableQuantity,
          status: stock.status,
        },

        price: Number(inventory.price),

        lastUpdatedAt:
          inventory.updatedAt.toISOString(),
      };
    },
  );

  return {
    items,

    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      totalItems,

      totalPages:
        totalItems === 0
          ? 0
          : Math.ceil(
              totalItems / input.pageSize,
            ),
    },

    filters: {
      query,
      city: city ?? null,
      sort: input.sort,
    },
  };
}