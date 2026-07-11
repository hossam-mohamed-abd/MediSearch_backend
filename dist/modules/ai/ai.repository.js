"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class AiRepository {
    async createSearchLog(searchText, userId, ipAddress) {
        let cityId = null;
        if (userId) {
            const user = await prisma_1.default.users.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    city_id: true,
                },
            });
            cityId = user?.city_id ?? null;
        }
        return prisma_1.default.search_logs.create({
            data: {
                user_id: userId,
                city_id: cityId,
                search_text: searchText,
                searched_at: new Date(),
                ip_address: ipAddress,
                drug_id: null,
            },
        });
    }
}
exports.AiRepository = AiRepository;
