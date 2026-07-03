import { PharmacyRepository }
from './pharmacy.repository';

export class PharmacyService {

  private repository =
    new PharmacyRepository();

  async getFeaturedPharmacies(
    page: number
  ) {
    return this.repository
      .getFeaturedPharmacies(
        page
      );
  }
}