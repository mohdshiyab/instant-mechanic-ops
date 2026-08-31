import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  getStatusBadge,
  getMechanicStatusBadge,
  getPriorityBadge,
} from "../lib/utils";

describe("Utility formatters & badges", () => {
  it("formats currency properly in USD", () => {
    expect(formatCurrency(150)).toBe("$150.00");
    expect(formatCurrency(1450.5)).toBe("$1,450.50");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles null/undefined date gracefully", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate(undefined)).toBe("N/A");
  });

  it("returns correct status badges for all booking lifecycle stages", () => {
    const pending = getStatusBadge("PENDING");
    expect(pending.label).toBe("Pending");
    expect(pending.bg).toContain("orange");

    const completed = getStatusBadge("COMPLETED");
    expect(completed.label).toBe("Completed");
    expect(completed.bg).toContain("emerald");

    const enRoute = getStatusBadge("EN_ROUTE");
    expect(enRoute.label).toBe("En Route");
    expect(enRoute.bg).toContain("indigo");
  });

  it("returns correct mechanic status badges", () => {
    const available = getMechanicStatusBadge("AVAILABLE");
    expect(available.label).toBe("Available");

    const onBreak = getMechanicStatusBadge("ON_BREAK");
    expect(onBreak.label).toBe("On Break");
  });

  it("returns correct priority badge configuration", () => {
    const emergency = getPriorityBadge("EMERGENCY");
    expect(emergency.label).toBe("Emergency");
    expect(emergency.bg).toContain("red");

    const standard = getPriorityBadge("STANDARD");
    expect(standard.label).toBe("Standard");
  });
});
