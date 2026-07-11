"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDashboardService = void 0;
const pharmacy_dashboard_repository_1 = require("./pharmacy-dashboard.repository");
class PharmacyDashboardService {
    repository = new pharmacy_dashboard_repository_1.PharmacyDashboardRepository();
    async getDashboard(userId) {
        return this.repository.getDashboard(userId);
    }
}
exports.PharmacyDashboardService = PharmacyDashboardService;
