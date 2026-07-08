import prisma from "../../config/prisma";

export class AiRepository {
  async createSearchLog(
    searchText: string,
    userId: bigint | null,
    ipAddress: string | null,
  ) {
    let cityId: bigint | null = null;

    if (userId) {
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },

        select: {
          city_id: true,
        },
      });

      cityId = user?.city_id ?? null;
    }

    return prisma.search_logs.create({
      data: {
        user_id: userId,

        city_id: cityId,

        search_text: searchText,

        searched_at: new Date(),

        ip_address: ipAddress,

        drug_id: null,
      },
    });
  }
}
