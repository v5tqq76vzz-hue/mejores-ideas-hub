import { describe, it, expect } from "vitest";
import { quoteTotals } from "./catalog";

describe("cotización", () => {
  it("código DMD10 descuenta 10%", () => {
    expect(quoteTotals([699, 250], true).total).toBe(855);
  });
  it("anticipo es 50% del total", () => {
    expect(quoteTotals([699, 299], false).deposit).toBe(499);
  });
});
