import { randomInt } from "node:crypto";

export function generatePickupCode(): string {
  const code = randomInt(0, 1_000_000);

  return code
    .toString()
    .padStart(6, "0");
}