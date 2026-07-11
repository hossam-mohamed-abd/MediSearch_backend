"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDashboardController = void 0;
const pharmacy_dashboard_service_1 = require("./pharmacy-dashboard.service");
const service = new pharmacy_dashboard_service_1.PharmacyDashboardService();
class PharmacyDashboardController {
    getDashboard = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const userId = BigInt(req.user.id);
            const data = await service.getDashboard(userId);
            return res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    };
}
exports.PharmacyDashboardController = PharmacyDashboardController;
