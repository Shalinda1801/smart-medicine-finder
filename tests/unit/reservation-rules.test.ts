import {
  describe,
  expect,
  it,
} from "vitest";

import {
  assertReservationTransition,
  calculateReservationExpiry,
  canTransitionReservation,
  getAllowedTransitions,
  isTerminalReservationStatus,
} from "@/features/reservations/reservation-rules";

describe("reservation rules", () => {
  it("allows PENDING to change to CONFIRMED", () => {
    expect(
      canTransitionReservation(
        "PENDING",
        "CONFIRMED",
      ),
    ).toBe(true);
  });

  it("allows CONFIRMED to change to READY_FOR_PICKUP", () => {
    expect(
      canTransitionReservation(
        "CONFIRMED",
        "READY_FOR_PICKUP",
      ),
    ).toBe(true);
  });

  it("does not allow COLLECTED to change status", () => {
    expect(
      canTransitionReservation(
        "COLLECTED",
        "CANCELLED",
      ),
    ).toBe(false);
  });

  it("throws for an invalid transition", () => {
    expect(() =>
      assertReservationTransition(
        "CANCELLED",
        "CONFIRMED",
      ),
    ).toThrow(
      "Reservation cannot change from CANCELLED to CONFIRMED.",
    );
  });

  it("returns allowed pending transitions", () => {
    expect(
      getAllowedTransitions("PENDING"),
    ).toEqual([
      "CONFIRMED",
      "CANCELLED",
      "EXPIRED",
    ]);
  });

  it("recognizes final reservation statuses", () => {
    expect(
      isTerminalReservationStatus("COLLECTED"),
    ).toBe(true);

    expect(
      isTerminalReservationStatus("CANCELLED"),
    ).toBe(true);

    expect(
      isTerminalReservationStatus("EXPIRED"),
    ).toBe(true);

    expect(
      isTerminalReservationStatus("PENDING"),
    ).toBe(false);
  });

  it("calculates a 30-minute expiry time", () => {
    const startTime = new Date(
      "2026-07-29T10:00:00.000Z",
    );

    const expiry =
      calculateReservationExpiry(
        startTime,
        30,
      );

    expect(expiry.toISOString()).toBe(
      "2026-07-29T10:30:00.000Z",
    );
  });

  it("rejects an invalid hold duration", () => {
    expect(() =>
      calculateReservationExpiry(
        new Date(),
        0,
      ),
    ).toThrow(
      "Reservation hold duration must be a positive whole number.",
    );
  });
});