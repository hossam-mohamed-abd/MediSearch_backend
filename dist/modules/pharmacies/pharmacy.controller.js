"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyController = void 0;
const pharmacy_service_1 = require("./pharmacy.service");
const service = new pharmacy_service_1.PharmacyService();
class PharmacyController {
    async getFeaturedPharmacies(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const data = await service
                .getFeaturedPharmacies(page);
            res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.PharmacyController = PharmacyController;
