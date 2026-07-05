import { MedicineDetailRepository } from "./medicine-detail.repository";
import { PharmacyRankingService } from "./pharmacy-ranking.service";
import {
  DrugDetailResult,
  PharmacyOffer,
  UserLocation,
} from "./medicine-detail.types";

export class MedicineDetailService {
  private repository = new MedicineDetailRepository();
  private rankingService = new PharmacyRankingService();

  async getDrugDetail(
    drugId: bigint,
    userId: bigint | null,
  ): Promise<DrugDetailResult | null> {
    const drug = await this.repository.findDrugById(drugId);
    if (!drug) return null;

    const inventory = await this.repository.findInventoryForDrug(drugId);

    const pharmacyIds = inventory
      .map((item) => item.pharmacies?.id)
      .filter((id): id is bigint => !!id);

    const ratingsSummary = await this.repository.getRatingsSummary(pharmacyIds);

    const ratingsMap = new Map<string, { avg: number | null; count: number }>();
    for (const row of ratingsSummary) {
      ratingsMap.set(row.pharmacy_id!.toString(), {
        avg: row._avg.rating ? Number(row._avg.rating) : null,
        count: row._count.rating,
      });
    }

    const userLocation = userId ? await this.resolveUserLocation(userId) : null;

    const offers: PharmacyOffer[] = inventory
      .filter((item) => !!item.pharmacies)
      .map((item) => {
        const pharmacy = item.pharmacies!;
        const city = pharmacy.cities;
        const governorate = city?.governorates;
        const country = governorate?.countries;
        const ratingInfo = ratingsMap.get(pharmacy.id.toString());

        const tier = this.rankingService.resolveTier(
          city?.id ?? null,
          governorate?.id ?? null,
          country?.id ?? null,
          userLocation,
        );

        const offer: PharmacyOffer = {
          pharmacyId: pharmacy.id.toString(),
          name: pharmacy.name ?? "Pharmacy",
          price: item.price ? Number(item.price) : null,
          quantity: item.quantity ?? null,
          rating: ratingInfo?.avg ?? null,
          ratingCount: ratingInfo?.count ?? 0,
          address: pharmacy.address ?? null,
          cityName: city?.name ?? null,
          governorateName: governorate?.name ?? null,
          countryName: country?.name ?? null,
          proximityTier: tier,
        };

        return offer;
      });

    return {
      drug: {
        id: drug.id.toString(),
        name: drug.name ?? "",
        activeSubstance: drug.active_substance,
        dosageForm: drug.dosage_form,
        strength: drug.strength,
        manufacturer: drug.manufacturer,
        description: drug.description,
        imageUrl: drug.image_url,
        categoryName: drug.drug_categories?.name ?? null,
      },
      pharmacies: this.rankingService.rank(offers),
    };
  }

  private async resolveUserLocation(
    userId: bigint,
  ): Promise<UserLocation | null> {
    const user = await this.repository.findUserLocation(userId);
    const city = user?.cities;
    if (!city) return null;

    return {
      cityId: city.id ?? null,
      governorateId: city.governorate_id ?? null,
      countryId: city.governorates?.country_id ?? null,
    };
  }
}
