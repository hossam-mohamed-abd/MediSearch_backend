import prisma from "../../config/prisma";

export class MedicineDetailRepository {
  async findDrugById(drugId: bigint) {
    return prisma.drugs.findUnique({
      where: { id: drugId },
      include: { drug_categories: true },
    });
  }

  /** Only pharmacies that actually have stock (quantity > 0) for this drug */
  async findInventoryForDrug(drugId: bigint) {
    return prisma.pharmacy_inventory.findMany({
      where: {
        drug_id: drugId,
        quantity: { gt: 0 },
      },
      include: {
        pharmacies: {
          include: {
            cities: {
              include: {
                governorates: {
                  include: { countries: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getRatingsSummary(pharmacyIds: bigint[]) {
    if (!pharmacyIds.length) return [];

    return prisma.pharmacy_ratings.groupBy({
      by: ["pharmacy_id"],
      where: { pharmacy_id: { in: pharmacyIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });
  }

  async findUserLocation(userId: bigint) {
    return prisma.users.findUnique({
      where: { id: userId },
      select: {
        cities: {
          select: {
            id: true,
            governorate_id: true,
            governorates: {
              select: { id: true, country_id: true },
            },
          },
        },
      },
    });
  }
}
