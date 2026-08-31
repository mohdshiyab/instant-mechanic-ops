import { describe, it, expect } from "vitest";
import {
  CreateBookingSchema,
  UpdateBookingStatusSchema,
  BookingFilterSchema,
} from "../server/validators/booking.validator";

describe("Booking Validators & State Schemas", () => {
  it("validates a proper booking creation payload", () => {
    const validData = {
      customerId: "cust_123",
      vehicleId: "veh_456",
      serviceId: "FULL_OIL_SERVICE",
      address: "123 Main St, New York, NY",
      amount: 145,
      priority: "STANDARD",
    };

    const result = CreateBookingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects booking creation when required fields are missing", () => {
    const invalidData = {
      customerId: "",
      address: "",
    };

    const result = CreateBookingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("validates status transitions", () => {
    const validTransition = {
      status: "IN_PROGRESS",
      note: "Work started on site.",
    };

    const result = UpdateBookingStatusSchema.safeParse(validTransition);
    expect(result.success).toBe(true);
  });

  it("rejects invalid status strings", () => {
    const invalidTransition = {
      status: "INVALID_STATUS_NAME",
    };

    const result = UpdateBookingStatusSchema.safeParse(invalidTransition);
    expect(result.success).toBe(false);
  });

  it("correctly parses query filters with defaults", () => {
    const query = {
      page: "2",
      limit: "25",
      status: "COMPLETED",
      sortBy: "amount",
      sortOrder: "asc",
    };

    const result = BookingFilterSchema.safeParse(query);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(25);
      expect(result.data.status).toBe("COMPLETED");
      expect(result.data.sortBy).toBe("amount");
      expect(result.data.sortOrder).toBe("asc");
    }
  });
});
