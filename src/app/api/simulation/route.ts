import { NextRequest, NextResponse } from "next/server";
import { SimulationService } from "@/server/services/simulation.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [pendingCount, assignedCount, enRouteCount, inProgressCount, availableMechanics] =
      await Promise.all([
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.booking.count({ where: { status: "ASSIGNED" } }),
        prisma.booking.count({ where: { status: "EN_ROUTE" } }),
        prisma.booking.count({ where: { status: "IN_PROGRESS" } }),
        prisma.mechanic.count({ where: { status: "AVAILABLE" } }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        pendingCount,
        assignedCount,
        enRouteCount,
        inProgressCount,
        availableMechanics,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "tick";

    if (action === "tick") {
      const result = await SimulationService.tick();
      return NextResponse.json({ success: true, result });
    }

    if (action === "emergency") {
      const booking = await SimulationService.injectEmergencyBreakdown();
      return NextResponse.json({
        success: true,
        message: "Emergency breakdown injected into live queue!",
        data: booking,
      });
    }

    if (action === "reset") {
      const result = await SimulationService.resetDatabase();
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { success: false, error: `Unknown simulation action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("POST /api/simulation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Simulation execution failed" },
      { status: 500 }
    );
  }
}
