import { AppError } from "@/lib/app-error";

export const STOCK_STATUSES = [
  "AVAILABLE",
  "LOW_STOCK",
  "OUT_OF_STOCK",
] as const;

export type StockStatus =
  (typeof STOCK_STATUSES)[number];

function validateStockValues(
  quantity: number,
  reservedQuantity: number,
  lowStockThreshold: number,
): void {
  const values = [
    quantity,
    reservedQuantity,
    lowStockThreshold,
  ];

  if (
    values.some((value) => !Number.isInteger(value))
  ) {
    throw new AppError(
      "INVALID_STOCK_DATA",
      "Stock values must be whole numbers.",
      500,
    );
  }

  if (
    quantity < 0 ||
    reservedQuantity < 0 ||
    lowStockThreshold < 0
  ) {
    throw new AppError(
      "INVALID_STOCK_DATA",
      "Stock values cannot be negative.",
      500,
    );
  }

  if (reservedQuantity > quantity) {
    throw new AppError(
      "INVALID_STOCK_DATA",
      "Reserved quantity cannot exceed total quantity.",
      500,
    );
  }
}

export function calculateAvailableQuantity(
  quantity: number,
  reservedQuantity: number,
): number {
  validateStockValues(
    quantity,
    reservedQuantity,
    0,
  );

  return quantity - reservedQuantity;
}

export function calculateStockStatus(
  quantity: number,
  reservedQuantity: number,
  lowStockThreshold: number,
): StockStatus {
  validateStockValues(
    quantity,
    reservedQuantity,
    lowStockThreshold,
  );

  const availableQuantity =
    quantity - reservedQuantity;

  if (availableQuantity <= 0) {
    return "OUT_OF_STOCK";
  }

  if (availableQuantity <= lowStockThreshold) {
    return "LOW_STOCK";
  }

  return "AVAILABLE";
}

export function getStockSummary(
  quantity: number,
  reservedQuantity: number,
  lowStockThreshold: number,
) {
  return {
    quantity,
    reservedQuantity,

    availableQuantity:
      calculateAvailableQuantity(
        quantity,
        reservedQuantity,
      ),

    status: calculateStockStatus(
      quantity,
      reservedQuantity,
      lowStockThreshold,
    ),
  };
}