"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyRankingService = void 0;
class PharmacyRankingService {
    tierOrder = {
        same_city: 0,
        same_governorate: 1,
        same_country: 2,
        other: 3,
    };
    resolveTier(pharmacyCityId, pharmacyGovernorateId, pharmacyCountryId, userLocation) {
        if (!userLocation)
            return "other";
        if (userLocation.cityId &&
            pharmacyCityId &&
            userLocation.cityId === pharmacyCityId) {
            return "same_city";
        }
        if (userLocation.governorateId &&
            pharmacyGovernorateId &&
            userLocation.governorateId === pharmacyGovernorateId) {
            return "same_governorate";
        }
        if (userLocation.countryId &&
            pharmacyCountryId &&
            userLocation.countryId === pharmacyCountryId) {
            return "same_country";
        }
        return "other";
    }
    /** Sorts by proximity tier first, then cheapest price, then highest rating */
    rank(offers) {
        return [...offers].sort((a, b) => {
            const tierDiff = this.tierOrder[a.proximityTier] - this.tierOrder[b.proximityTier];
            if (tierDiff !== 0)
                return tierDiff;
            const priceA = a.price ?? Number.POSITIVE_INFINITY;
            const priceB = b.price ?? Number.POSITIVE_INFINITY;
            if (priceA !== priceB)
                return priceA - priceB;
            const ratingA = a.rating ?? 0;
            const ratingB = b.rating ?? 0;
            return ratingB - ratingA;
        });
    }
}
exports.PharmacyRankingService = PharmacyRankingService;
