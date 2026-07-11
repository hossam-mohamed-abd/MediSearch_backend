import prisma from "../../config/prisma";

class PharmacyAuthRepository {
  async findByEmail(email: string) {
    return prisma.users.findFirst({
      where: {
        email,
        role: "pharmacy",
        is_active: true,
      },

      include: {
        pharmacy_staff: {
          include: {
            pharmacies: {
              include: {
                cities: true,
              },
            },
          },
        },
      },
    });
  }

  async findProfile(userId: bigint) {
    return prisma.users.findUnique({
      where: {
        id: userId,
      },

      include: {
        pharmacy_staff: {
          include: {
            pharmacies: {
              include: {
                cities: {
                  include: {
                    governorates: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateLastLogin(userId: bigint) {
    return prisma.users.update({
      where: {
        id: userId,
      },

      data: {
        last_login: new Date(),
      },
    });
  }
}

export default new PharmacyAuthRepository();