"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyProfileRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class PharmacyProfileRepository {
    async findByUserId(userId) {
        return prisma_1.default.pharmacy_staff.findFirst({
            where: {
                user_id: userId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                    },
                },
                pharmacies: {
                    include: {
                        cities: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async updateProfile(pharmacyId, data) {
        return prisma_1.default.pharmacies.update({
            where: {
                id: pharmacyId,
            },
            data,
        });
    }
}
exports.PharmacyProfileRepository = PharmacyProfileRepository;
