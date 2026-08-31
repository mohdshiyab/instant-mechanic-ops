import { prisma } from "@/lib/prisma";
import { sseHub } from "@/lib/sse";
import { MechanicStatus } from "@/lib/types";

export class MechanicService {
  static async getAllMechanics(params?: { status?: string; search?: string }) {
    const where: any = {};

    if (params?.status && params.status !== "ALL") {
      where.status = params.status;
    }

    if (params?.search && params.search.trim() !== "") {
      const s = params.search.trim();
      where.OR = [
        { name: { contains: s } },
        { email: { contains: s } },
        { phone: { contains: s } },
        { address: { contains: s } },
        { vehicleType: { contains: s } },
        { specialties: { contains: s } },
      ];
    }

    const mechanics = await prisma.mechanic.findMany({
      where,
      orderBy: [{ status: "asc" }, { rating: "desc" }],
      include: {
        bookings: {
          where: {
            status: { in: ["ASSIGNED", "EN_ROUTE", "IN_PROGRESS"] },
          },
          include: {
            customer: true,
            vehicle: true,
            service: true,
          },
          take: 1,
        },
      },
    });

    return mechanics.map((m) => ({
      ...m,
      specialties: typeof m.specialties === "string" ? JSON.parse(m.specialties) : m.specialties,
      activeBooking: m.bookings[0] || null,
    }));
  }

  static async getMechanicById(id: string) {
    const mechanic = await prisma.mechanic.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { scheduledAt: "desc" },
          take: 20,
          include: {
            customer: true,
            vehicle: true,
            service: true,
          },
        },
      },
    });

    if (!mechanic) return null;

    return {
      ...mechanic,
      specialties: typeof mechanic.specialties === "string" ? JSON.parse(mechanic.specialties) : mechanic.specialties,
      activeBooking: mechanic.bookings.find((b) => ["ASSIGNED", "EN_ROUTE", "IN_PROGRESS"].includes(b.status)) || null,
      history: mechanic.bookings.filter((b) => b.status === "COMPLETED"),
    };
  }

  static async updateMechanicStatus(
    id: string,
    data: {
      status?: MechanicStatus;
      latitude?: number;
      longitude?: number;
    }
  ) {
    const mechanic = await prisma.mechanic.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
        ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
        updatedAt: new Date(),
      },
    });

    sseHub.broadcast({
      type: "MECHANIC_STATUS_CHANGED",
      timestamp: new Date().toISOString(),
      data: mechanic,
    });

    return mechanic;
  }
}
