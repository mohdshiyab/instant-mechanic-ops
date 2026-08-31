import { prisma } from "@/lib/prisma";
import { format, subDays } from "date-fns";
import { AnalyticsData, BookingStatus } from "@/lib/types";

export class AnalyticsService {
  static async getAnalyticsData(days = 30): Promise<AnalyticsData> {
    const startDate = subDays(new Date(), days);

    const [bookings, services, mechanics] = await Promise.all([
      prisma.booking.findMany({
        where: {
          scheduledAt: { gte: startDate },
        },
        include: {
          service: true,
          mechanic: true,
        },
        orderBy: { scheduledAt: "asc" },
      }),
      prisma.service.findMany(),
      prisma.mechanic.findMany({
        orderBy: { jobsCompleted: "desc" },
        take: 10,
      }),
    ]);

    // 1. Revenue & Bookings over time (grouped by day)
    const dayMap: Record<string, { date: string; revenue: number; bookings: number }> = {};
    for (let i = days; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "MMM dd");
      dayMap[d] = { date: d, revenue: 0, bookings: 0 };
    }

    bookings.forEach((b) => {
      const d = format(new Date(b.scheduledAt), "MMM dd");
      if (dayMap[d]) {
        dayMap[d].bookings += 1;
        if (b.status === "COMPLETED") {
          dayMap[d].revenue += b.amount;
        }
      }
    });

    const revenueOverTime = Object.values(dayMap);

    // 2. Bookings by Status
    const statusCounts: Record<BookingStatus, number> = {
      PENDING: 0,
      ASSIGNED: 0,
      EN_ROUTE: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    const statusColors: Record<BookingStatus, string> = {
      PENDING: "#f97316",
      ASSIGNED: "#f59e0b",
      EN_ROUTE: "#6366f1",
      IN_PROGRESS: "#06b6d4",
      COMPLETED: "#10b981",
      CANCELLED: "#f43f5e",
    };

    bookings.forEach((b) => {
      if (statusCounts[b.status as BookingStatus] !== undefined) {
        statusCounts[b.status as BookingStatus] += 1;
      }
    });

    const totalBookingsCount = bookings.length || 1;
    const bookingsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as BookingStatus,
      count,
      percentage: Number(((count / totalBookingsCount) * 100).toFixed(1)),
      color: statusColors[status as BookingStatus] || "#71717a",
    }));

    // 3. Service / Category Breakdown
    const categoryMap: Record<string, { category: string; count: number; revenue: number }> = {};
    services.forEach((s) => {
      categoryMap[s.category] = { category: s.category, count: 0, revenue: 0 };
    });

    bookings.forEach((b) => {
      const cat = b.service?.category || "Other";
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, count: 0, revenue: 0 };
      }
      categoryMap[cat].count += 1;
      if (b.status === "COMPLETED") {
        categoryMap[cat].revenue += b.amount;
      }
    });

    const totalCategoryBookings = bookings.length || 1;
    const serviceBreakdown = Object.values(categoryMap).map((cat) => ({
      ...cat,
      percentage: Number(((cat.count / totalCategoryBookings) * 100).toFixed(1)),
    }));

    // 4. Hourly Activity
    const hourMap: Record<string, { hour: string; bookings: number; dispatches: number }> = {};
    for (let h = 6; h <= 22; h++) {
      const label = `${h.toString().padStart(2, "0")}:00`;
      hourMap[label] = { hour: label, bookings: 0, dispatches: 0 };
    }

    bookings.forEach((b) => {
      const hour = new Date(b.scheduledAt).getHours();
      const label = `${hour.toString().padStart(2, "0")}:00`;
      if (hourMap[label]) {
        hourMap[label].bookings += 1;
        if (b.status !== "PENDING" && b.status !== "CANCELLED") {
          hourMap[label].dispatches += 1;
        }
      }
    });

    const hourlyActivity = Object.values(hourMap);

    // 5. Mechanic Performance
    const mechanicPerformance = mechanics.map((m) => ({
      name: m.name,
      jobsCompleted: m.jobsCompleted,
      rating: m.rating,
      status: m.status as any,
    }));

    return {
      revenueOverTime,
      bookingsByStatus,
      serviceBreakdown,
      hourlyActivity,
      mechanicPerformance,
    };
  }
}
