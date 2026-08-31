import { prisma } from "@/lib/prisma";

export class CustomerService {
  static async getAllCustomers(params?: { search?: string; page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.search && params.search.trim() !== "") {
      const s = params.search.trim();
      where.OR = [
        { name: { contains: s } },
        { email: { contains: s } },
        { phone: { contains: s } },
        { address: { contains: s } },
        { city: { contains: s } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { totalSpent: "desc" },
        include: {
          vehicles: true,
          _count: {
            select: { bookings: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: true,
        bookings: {
          orderBy: { scheduledAt: "desc" },
          include: {
            service: true,
            mechanic: true,
            vehicle: true,
          },
        },
      },
    });
  }
}
