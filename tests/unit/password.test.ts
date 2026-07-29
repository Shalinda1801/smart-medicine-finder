import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hashPassword,
  verifyPassword,
} from "@/features/auth/password";

describe("password utilities", () => {
  it("creates a hash different from the password", async () => {
    const password = "Password123!";

    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it("verifies the correct password", async () => {
    const password = "Password123!";
    const hash = await hashPassword(password);

    const matches = await verifyPassword(
      password,
      hash,
    );

    expect(matches).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword(
      "Password123!",
    );

    const matches = await verifyPassword(
      "WrongPassword123!",
      hash,
    );

    expect(matches).toBe(false);
  });

  it("creates different hashes for the same password", async () => {
    const password = "Password123!";

    const firstHash = await hashPassword(
      password,
    );

    const secondHash = await hashPassword(
      password,
    );

    expect(firstHash).not.toBe(secondHash);

    expect(
      await verifyPassword(password, firstHash),
    ).toBe(true);

    expect(
      await verifyPassword(password, secondHash),
    ).toBe(true);
  });

  it("rejects an empty password", async () => {
    await expect(
      hashPassword(""),
    ).rejects.toThrow("Password is required.");
  });

  it("returns false when the hash is empty", async () => {
    const result = await verifyPassword(
      "Password123!",
      "",
    );

    expect(result).toBe(false);
  });
});