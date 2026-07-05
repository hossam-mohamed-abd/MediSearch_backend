"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineDetailController = void 0;
const medicine_detail_service_1 = require("./medicine-detail.service");
const service = new medicine_detail_service_1.MedicineDetailService();
class MedicineDetailController {
    getDetail = async (req, res) => {
        try {
            const rawId = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            if (!rawId || isNaN(Number(rawId))) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid drug id.",
                });
            }
            const drugId = BigInt(rawId);
            const userId = req.userId ? BigInt(req.userId) : null;
            const result = await service.getDrugDetail(drugId, userId);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Medicine not found.",
                });
            }
            return res.json({
                success: true,
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
exports.MedicineDetailController = MedicineDetailController;
