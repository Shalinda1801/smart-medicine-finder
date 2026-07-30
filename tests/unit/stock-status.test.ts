import {
  describe,
  expect,
  it,
} from "vitest";

import { AppError } from "@/lib/app-error";

import {
  calculateAvailableQuantity,
  calculateStockStatus,
  getStockSummary,
} from "@/utils/stock-status";

describe("stock status utilities", () => {
  it("calculates available quantity", () => {
    const available =
      calculateAvailableQuantity(20, 6);

    expect(available).toBe(14);
  });

  it("returns AVAILABLE for sufficient stock", () => {
    const status = calculateStockStatus(
      30,
      5,
      10,
    );

    expect(status).toBe("AVAILABLE");
  });

  it("returns LOW_STOCK at the threshold", () => {
    const status = calculateStockStatus(
      15,
      5,
      10,
    );

    expect(status).toBe("LOW_STOCK");
  });

  it("returns OUT_OF_STOCK when nothing is available", () => {
    const status = calculateStockStatus(
      10,
      10,
      5,
    );

    expect(status).toBe("OUT_OF_STOCK");
  });

  it("returns a complete stock summary", () => {
    const summary = getStockSummary(
      20,
      8,
      5,
    );

    expect(summary).toEqual({
      quantity: 20,
      reservedQuantity: 8,
      availableQuantity: 12,
      status: "AVAILABLE",
    });
  });

  it("rejects reserved quantity greater than total quantity", () => {
    expect(() =>
      calculateAvailableQuantity(5, 6),
    ).toThrow(AppError);
  });

  it("rejects negative stock values", () => {
    expect(() =>
      calculateStockStatus(-1, 0, 5),
    ).toThrow(AppError);
  });
});