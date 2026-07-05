"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLocationService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class UserLocationService {
    /**
     * Walks users -> cities -> governorates -> countries to build a
     * human-readable area string usable for geocoding (e.g. "Alexandria, Alexandria Governorate, Egypt").
     */
    async resolveUserArea(userId) {
        const user = await prisma_1.default.users.findUnique({
            where: { id: userId },
            select: {
                cities: {
                    select: {
                        name: true,
                        governorates: {
                            select: {
                                name: true,
                                countries: {
                                    select: { name: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user?.cities?.name) {
            return null;
        }
        return {
            cityName: user.cities.name,
            governorateName: user.cities.governorates?.name ?? null,
            countryName: user.cities.governorates?.countries?.name ?? null,
        };
    }
    areaToQueryString(area) {
        return [area.cityName, area.governorateName, area.countryName]
            .filter(Boolean)
            .join(", ");
    }
}
exports.UserLocationService = UserLocationService;
