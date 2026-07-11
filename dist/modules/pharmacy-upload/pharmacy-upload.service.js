"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyUploadService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const pharmacy_upload_repository_1 = require("./pharmacy-upload.repository");
class PharmacyUploadService {
    repository = new pharmacy_upload_repository_1.PharmacyUploadRepository();
    async upload(userId, file) {
        const staff = await prisma_1.default.pharmacy_staff.findFirst({
            where: {
                user_id: userId,
            },
        });
        if (!staff?.pharmacy_id) {
            throw new Error("Pharmacy not found");
        }
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:.TZ]/g, "");
        const fileName = `pharmacy_inventory_pharmacy_${staff.pharmacy_id}_${timestamp}.csv`;
        await this.repository.uploadFile(fileName, file);
        return {
            fileName,
        };
    }
}
exports.PharmacyUploadService = PharmacyUploadService;
