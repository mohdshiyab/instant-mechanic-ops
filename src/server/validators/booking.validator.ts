import { z } from "zod";

export const CreateBookingSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceId: z.string().min(1, "Service is required"),
  mechanicId: z.string().optional().nullable(),
  priority: z.enum(["STANDARD", "HIGH", "EMERGENCY"]).default("STANDARD"),
  scheduledAt: z.string().or(z.date()).optional(),
  address: z.string().min(3, "Address is required"),
  latitude: z.number().optional().default(40.7580),
  longitude: z.number().optional().default(-73.9855),
  amount: z.number().positive("Amount must be positive").optional(),
  paymentMethod: z.enum(["CARD", "APPLE_PAY", "CASH", "INSURANCE"]).default("CARD"),
  notes: z.string().optional().nullable(),
});

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "ASSIGNED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  mechanicId: z.string().optional().nullable(),
  note: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().optional(),
});

export const UpdateMechanicStatusSchema = z.object({
  status: z.enum(["AVAILABLE", "BUSY", "EN_ROUTE", "ON_BREAK", "OFFLINE"]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const BookingFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  serviceId: z.string().optional(),
  mechanicId: z.string().optional(),
  priority: z.string().optional(),
  sortBy: z.enum(["scheduledAt", "createdAt", "amount", "status", "id"]).default("scheduledAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
