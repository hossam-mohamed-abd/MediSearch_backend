import prisma from "../../config/prisma";

export class PharmacyDashboardRepository {
  async getDashboard(userId: bigint) {
    const staff = await prisma.pharmacy_staff.findFirst({
      where: {
        user_id: userId,
      },

      include: {
        pharmacies: true,
      },
    });

    if (!staff?.pharmacies) {
      throw new Error("Pharmacy not found");
    }

    const pharmacyId = staff.pharmacies.id;

    const inventory = await prisma.pharmacy_inventory.findMany({
      where: {
        pharmacy_id: pharmacyId,
      },

      select: {
        quantity: true,
        minimum_stock: true,
      },
    });

    const inventoryCount = inventory.length;

    const available = inventory.filter(
      (i) => (i.quantity ?? 0) > 0,
    ).length;

    const outOfStock = inventory.filter(
      (i) => (i.quantity ?? 0) === 0,
    ).length;

    const lowStock = inventory.filter((i) => {
      const quantity = i.quantity ?? 0;
      const minimum = i.minimum_stock ?? 0;

      return quantity > 0 && quantity <= minimum;
    }).length;

    return {
      pharmacy: staff.pharmacies,
      staffRole: staff.role,

      statistics: {
        inventoryCount,
        available,
        lowStock,
        outOfStock,
      },
    };
  }
}