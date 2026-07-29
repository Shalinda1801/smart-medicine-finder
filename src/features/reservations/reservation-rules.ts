import { AppError } from "@/lib/app-error";

export const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "READY_FOR_PICKUP",
  "COLLECTED",
  "CANCELLED",
  "EXPIRED",
] as const;

export type ReservationStatus =
  (typeof RESERVATION_STATUSES)[number];

export const PHARMACY_RESERVATION_ACTIONS = [
  "CONFIRMED",
  "READY_FOR_PICKUP",
  "COLLECTED",
  "CANCELLED",
] as const;

const allowedTransitions: Record<
  ReservationStatus,
  readonly ReservationStatus[]
> = {
  PENDING: [
    "CONFIRMED",
    "CANCELLED",
    "EXPIRED",
  ],

  CONFIRMED: [
    "READY_FOR_PICKUP",
    "CANCELLED",
    "EXPIRED",
  ],

  READY_FOR_PICKUP: [
    "COLLECTED",
    "EXPIRED",
  ],

  COLLECTED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export function getAllowedTransitions(
  currentStatus: ReservationStatus,
): readonly ReservationStatus[] {
  return allowedTransitions[currentStatus];
}

export function canTransitionReservation(
  currentStatus: ReservationStatus,
  nextStatus: ReservationStatus,
): boolean {
  return allowedTransitions[currentStatus].includes(
    nextStatus,
  );
}

export function assertReservationTransition(
  currentStatus: ReservationStatus,
  nextStatus: ReservationStatus,
): void {
  if (
    !canTransitionReservation(
      currentStatus,
      nextStatus,
    )
  ) {
    throw new AppError(
      "INVALID_RESERVATION_TRANSITION",
      `Reservation cannot change from ${currentStatus} to ${nextStatus}.`,
      409,
    );
  }
}

export function isTerminalReservationStatus(
  status: ReservationStatus,
): boolean {
  return [
    "COLLECTED",
    "CANCELLED",
    "EXPIRED",
  ].includes(status);
}

export function calculateReservationExpiry(
  startTime = new Date(),
  holdMinutes = 30,
): Date {
  if (
    !Number.isInteger(holdMinutes) ||
    holdMinutes <= 0
  ) {
    throw new AppError(
      "INVALID_HOLD_DURATION",
      "Reservation hold duration must be a positive whole number.",
      500,
    );
  }

  return new Date(
    startTime.getTime() +
      holdMinutes * 60 * 1000,
  );
}