import { PharmacyDashboardRepository } from "./pharmacy-dashboard.repository";

export class PharmacyDashboardService {
  private repository =
    new PharmacyDashboardRepository();

  async getDashboard(userId: bigint) {
    return this.repository.getDashboard(userId);
  }
}