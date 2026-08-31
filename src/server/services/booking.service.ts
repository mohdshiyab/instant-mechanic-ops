import { prisma } from "@/lib/prisma";
import { sseHub } from "@/lib/sse";
import { BookingStatus, PriorityLevel } from "@/lib/types";

export class BookingService {
  static async getBookings(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    serviceId?: string;
    mechanicId?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status && params.status !== "ALL") {
      where.status = params.status;
    }

    if (params.priority && params.priority !== "ALL") {
      where.priority = params.priority;
    }

    if (params.serviceId && params.serviceId !== "ALL") {
      where.serviceId = params.serviceId;
    }

    if (params.mechanicId && params.mechanicId !== "ALL") {
      where.mechanicId = params.mechanicId;
    }

    if (params.startDate || params.endDate) {
      where.scheduledAt = {};
      if (params.startDate) where.scheduledAt.gte = new Date(params.startDate);
      if (params.endDate) where.scheduledAt.lte = new Date(params.endDate);
    }

    if (params.search && params.search.trim() !== "") {
      const s = params.search.trim();
      where.OR = [
        { id: { contains: s } },
        { address: { contains: s } },
        { customer: { name: { contains: s } } },
        { customer: { email: { contains: s } } },
        { customer: { phone: { contains: s } } },
        { vehicle: { licensePlate: { contains: s } } },
        { vehicle: { make: { contains: s } } },
        { vehicle: { model: { contains: s } } },
      ];
    }

    const orderBy: any = {};
    const sortBy = params.sortBy || "scheduledAt";
    const sortOrder = params.sortOrder || "desc";
    orderBy[sortBy] = sortOrder;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          customer: true,
          vehicle: true,
          mechanic: true,
          service: true,
          timeline: {
            orderBy: { timestamp: "desc" },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          include: { vehicles: true },
        },
        vehicle: true,
        mechanic: true,
        service: true,
        timeline: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    return booking;
  }

  static async createBooking(data: {
    customerId: string;
    vehicleId: string;
    serviceId: string;
    mechanicId?: string | null;
    priority?: PriorityLevel;
    scheduledAt?: Date | string;
    address: string;
    latitude?: number;
    longitude?: number;
    amount?: number;
    paymentMethod?: string;
    notes?: string | null;
  }) {
    // Generate next Booking ID
    const count = await prisma.booking.count();
    const id = `BK-${1000 + count + 1}`;

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    const finalAmount = data.amount || service?.basePrice || 150;
    const scheduledDate = data.scheduledAt ? new Date(data.scheduledAt) : new Date();

    const booking = await prisma.booking.create({
      data: {
        id,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        serviceId: data.serviceId,
        mechanicId: data.mechanicId || null,
        status: data.mechanicId ? "ASSIGNED" : "PENDING",
        priority: data.priority || "STANDARD",
        scheduledAt: scheduledDate,
        address: data.address,
        latitude: data.latitude || 40.7580,
        longitude: data.longitude || -73.9855,
        amount: finalAmount,
        paymentStatus: "PENDING",
        paymentMethod: data.paymentMethod || "CARD",
        notes: data.notes,
        estimatedDurationMin: service?.estimatedDurationMin || 60,
      },
      include: {
        customer: true,
        vehicle: true,
        mechanic: true,
        service: true,
        timeline: true,
      },
    });

    // Create initial timeline
    await prisma.bookingTimeline.create({
      data: {
        bookingId: id,
        status: "PENDING",
        note: "Service booking registered in operations queue.",
        timestamp: new Date(),
      },
    });

    if (data.mechanicId) {
      await prisma.bookingTimeline.create({
        data: {
          bookingId: id,
          status: "ASSIGNED",
          note: `Mechanic assigned immediately on creation.`,
          timestamp: new Date(),
        },
      });

      await prisma.mechanic.update({
        where: { id: data.mechanicId },
        data: { status: "BUSY", currentBookingId: id },
      });
    }

    // Create Activity Log
    await prisma.activityLog.create({
      data: {
        type: data.priority === "EMERGENCY" ? "EMERGENCY_DISPATCH" : "BOOKING_CREATED",
        title: data.priority === "EMERGENCY" ? "🚨 Emergency Request Created" : "New Service Booking",
        description: `Booking ${id} for ${booking.customer?.name || "Customer"} - ${booking.service?.name || "Service"}`,
        metadata: JSON.stringify({ bookingId: id, priority: booking.priority, amount: finalAmount }),
      },
    });

    // Broadcast SSE Event
    sseHub.broadcast({
      type: data.priority === "EMERGENCY" ? "EMERGENCY_DISPATCH" : "BOOKING_CREATED",
      timestamp: new Date().toISOString(),
      data: booking,
    });

    return booking;
  }

  static async updateBookingStatus(
    id: string,
    data: {
      status: BookingStatus;
      mechanicId?: string | null;
      note?: string;
      rating?: number;
      review?: string;
    }
  ) {
    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true, mechanic: true, service: true },
    });

    if (!existing) {
      throw new Error(`Booking ${id} not found.`);
    }

    const updatePayload: any = {
      status: data.status,
      updatedAt: new Date(),
    };

    if (data.mechanicId !== undefined) {
      updatePayload.mechanicId = data.mechanicId;
    }

    if (data.status === "COMPLETED") {
      updatePayload.completedAt = new Date();
      updatePayload.paymentStatus = "PAID";
      if (data.rating) updatePayload.rating = data.rating;
      if (data.review) updatePayload.review = data.review;

      // Update customer total spend
      await prisma.customer.update({
        where: { id: existing.customerId },
        data: { totalSpent: { increment: existing.amount } },
      });

      // Update mechanic completed jobs & free mechanic
      const assignedMechId = data.mechanicId || existing.mechanicId;
      if (assignedMechId) {
        await prisma.mechanic.update({
          where: { id: assignedMechId },
          data: {
            jobsCompleted: { increment: 1 },
            status: "AVAILABLE",
            currentBookingId: null,
          },
        });
      }
    } else if (data.status === "ASSIGNED" || data.status === "EN_ROUTE" || data.status === "IN_PROGRESS") {
      const assignedMechId = data.mechanicId || existing.mechanicId;
      if (assignedMechId) {
        const mechStatus = data.status === "EN_ROUTE" ? "EN_ROUTE" : "BUSY";
        await prisma.mechanic.update({
          where: { id: assignedMechId },
          data: {
            status: mechStatus,
            currentBookingId: id,
          },
        });
      }
    } else if (data.status === "CANCELLED") {
      updatePayload.paymentStatus = "REFUNDED";
      if (existing.mechanicId) {
        await prisma.mechanic.update({
          where: { id: existing.mechanicId },
          data: { status: "AVAILABLE", currentBookingId: null },
        });
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updatePayload,
      include: {
        customer: true,
        vehicle: true,
        mechanic: true,
        service: true,
        timeline: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    // Create Timeline entry
    const defaultNotes: Record<BookingStatus, string> = {
      PENDING: "Booking placed in pending queue.",
      ASSIGNED: `Assigned to technician ${updated.mechanic?.name || "unassigned"}.`,
      EN_ROUTE: `Technician ${updated.mechanic?.name} is en route to vehicle location.`,
      IN_PROGRESS: `Work in progress: Diagnostic & mechanical service initiated.`,
      COMPLETED: `Work order completed successfully and certified.`,
      CANCELLED: `Booking was cancelled.`,
    };

    await prisma.bookingTimeline.create({
      data: {
        bookingId: id,
        status: data.status,
        note: data.note || defaultNotes[data.status] || `Status updated to ${data.status}`,
        timestamp: new Date(),
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        type: "STATUS_CHANGED",
        title: `Booking ${id} ${data.status}`,
        description: `Status changed to ${data.status} for ${updated.customer?.name || "Customer"}`,
        metadata: JSON.stringify({ bookingId: id, status: data.status }),
      },
    });

    // Broadcast SSE
    sseHub.broadcast({
      type: "BOOKING_UPDATED",
      timestamp: new Date().toISOString(),
      data: updated,
    });

    return updated;
  }
}
