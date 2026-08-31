import { NextResponse } from "next/server";
import { DashboardService } from "@/server/services/dashboard.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [metrics, recentActivity] = await Promise.all([
      DashboardService.getOverviewMetrics(),
      DashboardService.getRecentActivity(8),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        recentActivity,
      },
    });
  } catch (error: any) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
