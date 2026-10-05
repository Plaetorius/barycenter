import { describe, expect, it } from "vitest";

import { money, usd } from "./format";

describe("usd", () => {
  it("formats millions and billions", () => {
    expect(usd(863_000_000)).toBe("$863M");
    expect(usd(2_923_000_000)).toBe("$2.92B");
    expect(usd(1_500_000_000)).toBe("$1.5B");
    expect(usd(24_000_000)).toBe("$24M");
  });
  it("never renders zero as dollars", () => {
    expect(usd(0)).toBe("–");
    expect(usd(null)).toBe("–");
  });
  it("marks approximations", () => {
    expect(usd(5_000_000, { approx: true })).toBe("~$5M");
  });
});

describe("money", () => {
  it("keeps the original currency and qualifier", () => {
    expect(money({ amount: 130_000_000, currency: "EUR", qualifier: "over" })).toBe("> €130M");
    expect(money(null)).toBe("Undisclosed");
  });
});
