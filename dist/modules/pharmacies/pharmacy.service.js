"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyService = void 0;
const pharmacy_repository_1 = require("./pharmacy.repository");
class PharmacyService {
    repository = new pharmacy_repository_1.PharmacyRepository();
    async getFeaturedPharmacies(page) {
        return this.repository
            .getFeaturedPharmacies(page);
    }
}
exports.PharmacyService = PharmacyService;
