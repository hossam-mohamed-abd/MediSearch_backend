import prisma from '../../config/prisma';

export class PharmacyRepository {

  async getFeaturedPharmacies(
    page: number,
    limit = 4
  ) {
    const skip =
      (page - 1) * limit;

    const pharmacies =
      await prisma.pharmacies.findMany({
        where: {
          is_active: true,
        },

        include: {
          cities: true,

          pharmacy_inventory: true,

          pharmacy_ratings: true,
        },

        orderBy: {
          created_at: 'desc',
        },

        skip,
        take: limit,
      });

    return pharmacies.map((p) => {

      const ratings =
        p.pharmacy_ratings.map(
          r => r.rating ?? 0
        );

      const avgRating =
        ratings.length
          ? ratings.reduce(
              (a, b) => a + b,
              0
            ) / ratings.length
          : 0;

      return {
        id: p.id,
        name: p.name,
        logo_url: p.logo_url,
        address: p.address,

        city_name:
          p.cities?.name,

        medicines_count:
          p.pharmacy_inventory.length,

        reviews_count:
          p.pharmacy_ratings.length,

        avg_rating:
          Number(
            avgRating.toFixed(1)
          ),
      };
    });
  }
}