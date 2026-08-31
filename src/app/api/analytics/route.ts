import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/server/services/analytics.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = searchParams.get("days") ? parseInt(searchParams.get("days")!) : 30;

    const data = await AnalyticsService.getAnalyticsData(days);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate analytics" },
      { status: 500 }
    );
  }
}
