import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/server/services/booking.service";
import { BookingFilterSchema, CreateBookingSchema } from "@/server/validators/booking.validator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const validated = BookingFilterSchema.parse(query);
    const result = await BookingService.getBookings(validated);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookings" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateBookingSchema.parse(body);
    const booking = await BookingService.createBooking(validated);

    return NextResponse.json(
      { success: true, data: booking, message: "Booking created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking" },
      { status: 400 }
    );
  }
}
