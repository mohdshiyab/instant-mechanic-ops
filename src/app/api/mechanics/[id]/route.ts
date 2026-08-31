import { NextRequest, NextResponse } from "next/server";
import { MechanicService } from "@/server/services/mechanic.service";
import { UpdateMechanicStatusSchema } from "@/server/validators/booking.validator";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const mechanic = await MechanicService.getMechanicById(id);

    if (!mechanic) {
      return NextResponse.json(
        { success: false, error: `Mechanic with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mechanic });
  } catch (error: any) {
    console.error(`GET /api/mechanics/:id error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch mechanic" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validated = UpdateMechanicStatusSchema.parse(body);

    const updated = await MechanicService.updateMechanicStatus(id, validated);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Mechanic ${id} updated successfully`,
    });
  } catch (error: any) {
    console.error(`PATCH /api/mechanics/:id error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update mechanic" },
      { status: 400 }
    );
  }
}
