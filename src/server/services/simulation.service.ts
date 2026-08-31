import { prisma, db } from "@/lib/prisma";
import { sseHub } from "@/lib/sse";
import { BookingService } from "./booking.service";

export class SimulationService {
  static async tick() {
    // 1. Check for PENDING bookings to assign
    const pendingBooking = await prisma.booking.findFirst({
      where: { status: "PENDING" },
      include: { customer: true, vehicle: true, service: true },
      orderBy: { scheduledAt: "asc" },
    });

    if (pendingBooking) {
      const availableMechanic = await prisma.mechanic.findFirst({
        where: { status: "AVAILABLE" },
      });

      if (availableMechanic) {
        await BookingService.updateBookingStatus(pendingBooking.id, {
          status: "ASSIGNED",
          mechanicId: availableMechanic.id,
          note: `Auto-dispatched to ${availableMechanic.name} based on proximity and rating (${availableMechanic.rating}★).`,
        });

        return {
          action: "ASSIGNED",
          message: `Auto-assigned ${pendingBooking.id} (${pendingBooking.customer?.name || "Customer"}) to ${availableMechanic.name}`,
        };
      }
    }

    // 2. Check for ASSIGNED bookings to move EN_ROUTE
    const assignedBooking = await prisma.booking.findFirst({
      where: { status: "ASSIGNED" },
      include: { customer: true, mechanic: true },
      orderBy: { updatedAt: "asc" },
    });

    if (assignedBooking && assignedBooking.mechanicId) {
      // Jitter mechanic GPS towards booking location
      const newLat = assignedBooking.latitude + (Math.random() - 0.5) * 0.01;
      const newLng = assignedBooking.longitude + (Math.random() - 0.5) * 0.01;

      await prisma.mechanic.update({
        where: { id: assignedBooking.mechanicId },
        data: { latitude: newLat, longitude: newLng, status: "EN_ROUTE" },
      });

      await BookingService.updateBookingStatus(assignedBooking.id, {
        status: "EN_ROUTE",
        note: `Technician ${assignedBooking.mechanic?.name} departed with mobile workshop unit. ETA 12 mins.`,
      });

      return {
        action: "EN_ROUTE",
        message: `${assignedBooking.mechanic?.name} is en route to ${assignedBooking.customer?.name || "Customer"}`,
      };
    }

    // 3. Check for EN_ROUTE to move IN_PROGRESS
    const enRouteBooking = await prisma.booking.findFirst({
      where: { status: "EN_ROUTE" },
      include: { customer: true, mechanic: true },
      orderBy: { updatedAt: "asc" },
    });

    if (enRouteBooking && enRouteBooking.mechanicId) {
      await BookingService.updateBookingStatus(enRouteBooking.id, {
        status: "IN_PROGRESS",
        note: `Technician arrived at ${enRouteBooking.address}. Pre-service vehicle diagnostics started.`,
      });

      return {
        action: "IN_PROGRESS",
        message: `${enRouteBooking.mechanic?.name} arrived and started service for ${enRouteBooking.id}`,
      };
    }

    // 4. Check for IN_PROGRESS to move to COMPLETED
    const inProgressBooking = await prisma.booking.findFirst({
      where: { status: "IN_PROGRESS" },
      include: { customer: true, mechanic: true },
      orderBy: { updatedAt: "asc" },
    });

    if (inProgressBooking && inProgressBooking.mechanicId) {
      const rating = 5;
      const review = "Remarkable service! Rapid dispatch, clean work, and crystal clear explanation.";

      await BookingService.updateBookingStatus(inProgressBooking.id, {
        status: "COMPLETED",
        rating,
        review,
        note: `Completed standard checklist. Torque specs verified, diagnostic cleared.`,
      });

      return {
        action: "COMPLETED",
        message: `Booking ${inProgressBooking.id} completed! $${inProgressBooking.amount} revenue booked.`,
      };
    }

    // 5. Generate incoming live booking if queue is light
    const pendingCount = await prisma.booking.count({ where: { status: "PENDING" } });
    if (pendingCount < 4) {
      const customers = await prisma.customer.findMany({
        take: 10,
        include: { vehicles: true },
      });
      const services = await prisma.service.findMany();

      if (customers.length > 0 && services.length > 0) {
        const randCust = customers[Math.floor(Math.random() * customers.length)];
        const randServ = services[Math.floor(Math.random() * services.length)];
        const vehicle = randCust.vehicles[0];

        if (vehicle) {
          const newBooking = await BookingService.createBooking({
            customerId: randCust.id,
            vehicleId: vehicle.id,
            serviceId: randServ.id,
            priority: Math.random() > 0.6 ? "HIGH" : "STANDARD",
            address: `${randCust.address}, Bay 1`,
            latitude: 40.75 + (Math.random() - 0.5) * 0.05,
            longitude: -73.98 + (Math.random() - 0.5) * 0.05,
            amount: randServ.basePrice + Math.floor(Math.random() * 40),
            notes: "Live automated customer request simulated.",
          });

          return {
            action: "NEW_BOOKING",
            message: `Incoming live booking ${newBooking.id} created for ${randCust.name}!`,
          };
        }
      }
    }

    return { action: "NO_OP", message: "Operations normal. Fleet active." };
  }

  static async injectEmergencyBreakdown() {
    const customers = await prisma.customer.findMany({
      include: { vehicles: true },
      take: 15,
    });
    const emergencyService = await prisma.service.findFirst({
      where: { code: "EMERGENCY_ROADSIDE" },
    });

    if (!customers.length || !emergencyService) {
      throw new Error("Cannot inject emergency: missing customer or emergency service.");
    }

    const randomCust = customers[Math.floor(Math.random() * customers.length)];
    const vehicle = randomCust.vehicles[0];

    const booking = await BookingService.createBooking({
      customerId: randomCust.id,
      vehicleId: vehicle?.id || "",
      serviceId: emergencyService.id,
      priority: "EMERGENCY",
      address: `Highway Interstate 495 & Exit ${Math.floor(10 + Math.random() * 40)} (Breakdown Lane)`,
      latitude: 40.7300 + (Math.random() - 0.5) * 0.06,
      longitude: -73.9500 + (Math.random() - 0.5) * 0.06,
      amount: emergencyService.basePrice + 50,
      notes: "🚨 CRITICAL: Smoke from engine bay, vehicle disabled on highway shoulder. Immediate dispatch required.",
    });

    sseHub.broadcast({
      type: "EMERGENCY_DISPATCH",
      timestamp: new Date().toISOString(),
      data: booking,
    });

    return booking;
  }

  static async resetDatabase() {
    (db as any).isSeeded = false;
    db.seed();
    sseHub.broadcast({
      type: "METRICS_UPDATED",
      timestamp: new Date().toISOString(),
      data: { message: "Database reset to initial seed state" },
    });
    return { success: true, message: "Database reset to fresh seed state with 625+ bookings." };
  }
}
