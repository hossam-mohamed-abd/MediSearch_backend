import { PharmacyRepository } from "./pharmacy.repository";

export class PharmacyService {
  private repository = new PharmacyRepository();

  async getFeaturedPharmacies(page: number) {
    return this.repository.getFeaturedPharmacies(page);
  }

  async getPharmacyDetails(
    pharmacyId: bigint,
    userId: bigint | null,
    source = "details",
  ) {
    await this.repository.addView(pharmacyId, userId, source);

    const pharmacy = await this.repository.findById(pharmacyId);

    if (!pharmacy) {
      throw new Error("Pharmacy not found");
    }

    const ratings = pharmacy.pharmacy_ratings.map((r) => r.rating ?? 0);

    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    const availableCount = pharmacy.pharmacy_inventory.filter(
      (item) => (item.quantity ?? 0) > 0,
    ).length;

    const categories = new Set(
      pharmacy.pharmacy_inventory
        .map((item) => item.drugs?.category_id)
        .filter(Boolean),
    );

    return {
      id: Number(pharmacy.id),
      name: pharmacy.name,
      image_url: pharmacy.logo_url,
      phone: pharmacy.phone,
      email: pharmacy.email,
      address: pharmacy.address,
      city: pharmacy.cities?.name,
      governorate: pharmacy.cities?.governorates?.name,
      rating: Number(avgRating.toFixed(1)),
      reviews_count: pharmacy._count.pharmacy_ratings, // ← عد حقيقي من الداتابيز
      medicines_count: pharmacy.pharmacy_inventory.length,
      available_count: availableCount,
      categories_count: categories.size,
    };
  }

  async getPharmacyMedicines(pharmacyId: bigint, options: any) {
    return this.repository.findMedicines(pharmacyId, options);
  }

  async getPharmacyCategories(pharmacyId: bigint) {
    return this.repository.findCategories(pharmacyId);
  }

  async getPharmacyReviews(pharmacyId: bigint, page: number) {
    return this.repository.findReviews(pharmacyId, page);
  }

  async addReview(
    pharmacyId: bigint,
    userId: bigint,
    rating: number,
    review: string,
  ) {
    return this.repository.createReview(pharmacyId, userId, rating, review);
  }

  async getPharmacyStatistics(pharmacyId: bigint) {
    return this.repository.getStatistics(pharmacyId);
  }
}
