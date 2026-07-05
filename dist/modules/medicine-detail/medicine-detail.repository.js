"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineDetailRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class MedicineDetailRepository {
    async findDrugById(drugId) {
        return prisma_1.default.drugs.findUnique({
            where: { id: drugId },
            include: { drug_categories: true },
        });
    }
    /** Only pharmacies that actually have stock (quantity > 0) for this drug */
    async findInventoryForDrug(drugId) {
        return prisma_1.default.pharmacy_inventory.findMany({
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
    async getRatingsSummary(pharmacyIds) {
        if (!pharmacyIds.length)
            return [];
        return prisma_1.default.pharmacy_ratings.groupBy({
            by: ["pharmacy_id"],
            where: { pharmacy_id: { in: pharmacyIds } },
            _avg: { rating: true },
            _count: { rating: true },
        });
    }
    async findUserLocation(userId) {
        return prisma_1.default.users.findUnique({
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
exports.MedicineDetailRepository = MedicineDetailRepository;
