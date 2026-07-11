"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineDetailService = void 0;
const medicine_detail_repository_1 = require("./medicine-detail.repository");
const pharmacy_ranking_service_1 = require("./pharmacy-ranking.service");
class MedicineDetailService {
    repository = new medicine_detail_repository_1.MedicineDetailRepository();
    rankingService = new pharmacy_ranking_service_1.PharmacyRankingService();
    async getDrugDetail(drugId, userId) {
        const drug = await this.repository.findDrugById(drugId);
        if (!drug)
            return null;
        const inventory = await this.repository.findInventoryForDrug(drugId);
        const pharmacyIds = inventory
            .map((item) => item.pharmacies?.id)
            .filter((id) => !!id);
        const ratingsSummary = await this.repository.getRatingsSummary(pharmacyIds);
        const ratingsMap = new Map();
        for (const row of ratingsSummary) {
            ratingsMap.set(row.pharmacy_id.toString(), {
                avg: row._avg.rating ? Number(row._avg.rating) : null,
                count: row._count.rating,
            });
        }
        const userLocation = userId ? await this.resolveUserLocation(userId) : null;
        const offers = inventory
            .filter((item) => !!item.pharmacies)
            .map((item) => {
            const pharmacy = item.pharmacies;
            const city = pharmacy.cities;
            const governorate = city?.governorates;
            const country = governorate?.countries;
            const ratingInfo = ratingsMap.get(pharmacy.id.toString());
            const tier = this.rankingService.resolveTier(city?.id ?? null, governorate?.id ?? null, country?.id ?? null, userLocation);
            const offer = {
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
    async resolveUserLocation(userId) {
        const user = await this.repository.findUserLocation(userId);
        const city = user?.cities;
        if (!city)
            return null;
        return {
            cityId: city.id ?? null,
            governorateId: city.governorate_id ?? null,
            countryId: city.governorates?.country_id ?? null,
        };
    }
}
exports.MedicineDetailService = MedicineDetailService;
