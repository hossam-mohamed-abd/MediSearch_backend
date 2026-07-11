import prisma from "../../config/prisma";

export class PharmacyProfileRepository {
  async findByUserId(userId: bigint) {
    return prisma.pharmacy_staff.findFirst({
      where: {
        user_id: userId,
      },

      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },

        pharmacies: {
          include: {
            cities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateProfile(
    pharmacyId: bigint,
    data: {
      phone?: string;
      address?: string;
      logo_url?: string;
    },
  ) {
    return prisma.pharmacies.update({
      where: {
        id: pharmacyId,
      },

      data,
    });
  }
}