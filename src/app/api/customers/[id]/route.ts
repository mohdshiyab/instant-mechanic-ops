import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/server/services/customer.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const customer = await CustomerService.getCustomerById(id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: `Customer with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    console.error(`GET /api/customers/:id error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer" },
      { status: 500 }
    );
  }
}
