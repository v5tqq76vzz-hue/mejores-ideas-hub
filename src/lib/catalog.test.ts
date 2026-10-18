import { describe, it, expect } from "vitest";
import { quoteTotals } from "./catalog";

describe("cotización", () => {
  it("código DMD10 descuenta 10%", () => {
    expect(quoteTotals([1000, 500], true).total).toBe(1350);
  });
  it("anticipo es 50% del total", () => {
    expect(quoteTotals([699, 299], false).deposit).toBe(499);
  });
});

describe("página de servicio", () => {
  it("logo premium con manual suma 550", async () => {
    const { configuredPrice } = await import("./service-details");
    expect(configuredPrice(450, [100])).toBe(550);
  });
});
