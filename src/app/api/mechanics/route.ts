import { NextRequest, NextResponse } from "next/server";
import { MechanicService } from "@/server/services/mechanic.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const mechanics = await MechanicService.getAllMechanics({ status, search });

    return NextResponse.json({
      success: true,
      data: mechanics,
      total: mechanics.length,
    });
  } catch (error: any) {
    console.error("GET /api/mechanics error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch mechanics" },
      { status: 500 }
    );
  }
}
