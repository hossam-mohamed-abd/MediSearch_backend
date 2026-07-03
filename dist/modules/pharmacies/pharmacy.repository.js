"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class PharmacyRepository {
    async getFeaturedPharmacies(page, limit = 4) {
        const skip = (page - 1) * limit;
        const pharmacies = await prisma_1.default.pharmacies.findMany({
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
            const ratings = p.pharmacy_ratings.map(r => r.rating ?? 0);
            const avgRating = ratings.length
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 0;
            return {
                id: p.id,
                name: p.name,
                logo_url: p.logo_url,
                address: p.address,
                city_name: p.cities?.name,
                medicines_count: p.pharmacy_inventory.length,
                reviews_count: p.pharmacy_ratings.length,
                avg_rating: Number(avgRating.toFixed(1)),
            };
        });
    }
}
exports.PharmacyRepository = PharmacyRepository;
