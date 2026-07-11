"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
class PharmacyAuthRepository {
    async findByEmail(email) {
        return prisma_1.default.users.findFirst({
            where: {
                email,
                role: "pharmacy",
                is_active: true,
            },
            include: {
                pharmacy_staff: {
                    include: {
                        pharmacies: {
                            include: {
                                cities: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findProfile(userId) {
        return prisma_1.default.users.findUnique({
            where: {
                id: userId,
            },
            include: {
                pharmacy_staff: {
                    include: {
                        pharmacies: {
                            include: {
                                cities: {
                                    include: {
                                        governorates: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async updateLastLogin(userId) {
        return prisma_1.default.users.update({
            where: {
                id: userId,
            },
            data: {
                last_login: new Date(),
            },
        });
    }
}
exports.default = new PharmacyAuthRepository();
