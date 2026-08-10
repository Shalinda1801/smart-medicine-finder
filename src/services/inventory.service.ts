import type { Prisma } from "@/generated/prisma/client";

import type { SessionPayload } from "@/features/auth/session";

import type {
  CreateInventoryInput,
  InventoryListInput,
  UpdateInventoryInput,
} from "@/features/inventory/inventory.schema";

import { VerificationStatus } from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

const inventorySelection = {
  id: true,
  pharmacyId: true,
  medicineId: true,
  quantity: true,
  reservedQuantity: true,
  price: true,
  lowStockThreshold: true,
  isActive: true,
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
    },
  },
} satisfies Prisma.InventorySelect;

type InventoryRecord =
  Prisma.InventoryGetPayload<{
    select: typeof inventorySelection;
  }>;

function formatInventory(
  inventory: InventoryRecord,
) {
  const availableQuantity = Math.max(
    inventory.quantity -
      inventory.reservedQuantity,
    0,
  );

  let stockStatus:
    | "AVAILABLE"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "INACTIVE";

  if (!inventory.isActive) {
    stockStatus = "INACTIVE";
  } else if (availableQuantity === 0) {
    stockStatus = "OUT_OF_STOCK";
  } else if (
    availableQuantity <=
    inventory.lowStockThreshold
  ) {
    stockStatus = "LOW_STOCK";
  } else {
    stockStatus = "AVAILABLE";
  }

  return {
    id: inventory.id,
    pharmacyId: inventory.pharmacyId,
    medicineId: inventory.medicineId,

    medicine: inventory.medicine,

    stock: {
      quantity: inventory.quantity,

      reservedQuantity:
        inventory.reservedQuantity,

      availableQuantity,

      lowStockThreshold:
        inventory.lowStockThreshold,

      status: stockStatus,
    },

    price: Number(inventory.price),

    isActive: inventory.isActive,

    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
  };
}

async function getStaffPharmacy(
  session: SessionPayload,
) {
  if (session.role !== "PHARMACY_STAFF") {
    throw new AppError(
      "PHARMACY_STAFF_REQUIRED",
      "Only pharmacy staff can manage inventory.",
      403,
    );
  }

  const membership =
    await prisma.pharmacyMember.findFirst({
      where: {
        userId: session.userId,
      },

      select: {
        pharmacy: {
          select: {
            id: true,
            name: true,
            verificationStatus: true,
          },
        },
      },
    });

  if (!membership) {
    throw new AppError(
      "PHARMACY_MEMBERSHIP_NOT_FOUND",
      "No pharmacy is assigned to this account.",
      403,
    );
  }

  if (
    membership.pharmacy.verificationStatus !==
    VerificationStatus.APPROVED
  ) {
    throw new AppError(
      "PHARMACY_NOT_APPROVED",
      "The pharmacy must be approved before managing inventory.",
      403,
    );
  }

  return membership.pharmacy;
}

function isUniqueConstraintError(
  error: unknown,
) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function listPharmacyInventory(
  session: SessionPayload,
  input: InventoryListInput,
) {
  const pharmacy =
    await getStaffPharmacy(session);

  const skip =
    (input.page - 1) * input.pageSize;

  const medicineFilter:
    Prisma.MedicineWhereInput | undefined =
    input.q
      ? {
          OR: [
            {
              genericName: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              brandName: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              code: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              activeIngredient: {
                contains: input.q,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined;

  const where: Prisma.InventoryWhereInput = {
    pharmacyId: pharmacy.id,

    ...(input.includeInactive
      ? {}
      : {
          isActive: true,
        }),

    ...(medicineFilter
      ? {
          medicine: {
            is: medicineFilter,
          },
        }
      : {}),
  };

  const [totalItems, records] =
    await prisma.$transaction([
      prisma.inventory.count({
        where,
      }),

      prisma.inventory.findMany({
        where,

        select: inventorySelection,

        skip,

        take: input.pageSize,

        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

  return {
    pharmacy: {
      id: pharmacy.id,
      name: pharmacy.name,
    },

    items: records.map(formatInventory),

    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      totalItems,

      totalPages: Math.max(
        Math.ceil(
          totalItems / input.pageSize,
        ),
        1,
      ),
    },
  };
}

export async function createInventoryItem(
  session: SessionPayload,
  input: CreateInventoryInput,
) {
  const pharmacy =
    await getStaffPharmacy(session);

  const medicine =
    await prisma.medicine.findUnique({
      where: {
        id: input.medicineId,
      },

      select: {
        id: true,
      },
    });

  if (!medicine) {
    throw new AppError(
      "MEDICINE_NOT_FOUND",
      "Medicine was not found.",
      404,
    );
  }

  try {
    const record =
      await prisma.inventory.create({
        data: {
          pharmacyId: pharmacy.id,
          medicineId: input.medicineId,

          quantity: input.quantity,

          reservedQuantity: 0,

          price: input.price,

          lowStockThreshold:
            input.lowStockThreshold,

          isActive: input.isActive,
        },

        select: inventorySelection,
      });

    return formatInventory(record);
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      throw new AppError(
        "INVENTORY_ALREADY_EXISTS",
        "This medicine is already in the pharmacy inventory.",
        409,
      );
    }

    throw error;
  }
}

export async function updateInventoryItem(
  session: SessionPayload,
  inventoryId: string,
  input: UpdateInventoryInput,
) {
  const pharmacy =
    await getStaffPharmacy(session);

  const existing =
    await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
        pharmacyId: pharmacy.id,
      },

      select: {
        id: true,
        quantity: true,
        reservedQuantity: true,
      },
    });

  if (!existing) {
    throw new AppError(
      "INVENTORY_NOT_FOUND",
      "Inventory item was not found.",
      404,
    );
  }

  const nextQuantity =
    input.quantity ?? existing.quantity;

  if (
    nextQuantity <
    existing.reservedQuantity
  ) {
    throw new AppError(
      "QUANTITY_BELOW_RESERVED_STOCK",
      `Quantity cannot be less than the reserved quantity of ${existing.reservedQuantity}.`,
      409,
    );
  }

  if (
    input.isActive === false &&
    existing.reservedQuantity > 0
  ) {
    throw new AppError(
      "INVENTORY_HAS_RESERVATIONS",
      "This inventory item cannot be deactivated while stock is reserved.",
      409,
    );
  }

  const updated =
    await prisma.inventory.update({
      where: {
        id: existing.id,
      },

      data: {
        ...(input.quantity !== undefined
          ? {
              quantity: input.quantity,
            }
          : {}),

        ...(input.price !== undefined
          ? {
              price: input.price,
            }
          : {}),

        ...(input.lowStockThreshold !==
        undefined
          ? {
              lowStockThreshold:
                input.lowStockThreshold,
            }
          : {}),

        ...(input.isActive !== undefined
          ? {
              isActive: input.isActive,
            }
          : {}),
      },

      select: inventorySelection,
    });

  return formatInventory(updated);
}

export async function deactivateInventoryItem(
  session: SessionPayload,
  inventoryId: string,
) {
  const pharmacy =
    await getStaffPharmacy(session);

  const existing =
    await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
        pharmacyId: pharmacy.id,
      },

      select: {
        id: true,
        reservedQuantity: true,
        isActive: true,
      },
    });

  if (!existing) {
    throw new AppError(
      "INVENTORY_NOT_FOUND",
      "Inventory item was not found.",
      404,
    );
  }

  if (existing.reservedQuantity > 0) {
    throw new AppError(
      "INVENTORY_HAS_RESERVATIONS",
      "Inventory cannot be removed while stock is reserved.",
      409,
    );
  }

  if (!existing.isActive) {
    return {
      id: existing.id,
      message:
        "Inventory item is already inactive.",
    };
  }

  await prisma.inventory.update({
    where: {
      id: existing.id,
    },

    data: {
      isActive: false,
    },
  });

  return {
    id: existing.id,

    message:
      "Inventory item deactivated successfully.",
  };
}