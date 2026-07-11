"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyUploadController = void 0;
const pharmacy_upload_service_1 = require("./pharmacy-upload.service");
const service = new pharmacy_upload_service_1.PharmacyUploadService();
class PharmacyUploadController {
    upload = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "CSV file is required.",
                });
            }
            const result = await service.upload(BigInt(req.user.id), req.file);
            return res.json({
                success: true,
                message: "Inventory uploaded successfully.",
                ...result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
}
exports.PharmacyUploadController = PharmacyUploadController;
