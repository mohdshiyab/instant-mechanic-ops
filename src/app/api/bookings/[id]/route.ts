import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/server/services/booking.service";
import { UpdateBookingStatusSchema } from "@/server/validators/booking.validator";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const booking = await BookingService.getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: `Booking with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error(`GET /api/bookings/:id error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch booking details" },
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
    const validated = UpdateBookingStatusSchema.parse(body);

    const updated = await BookingService.updateBookingStatus(id, validated);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Booking ${id} status updated to ${validated.status}`,
    });
  } catch (error: any) {
    console.error(`PATCH /api/bookings/:id error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update booking" },
      { status: 400 }
    );
  }
}
