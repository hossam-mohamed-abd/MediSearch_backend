"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyProfileService = void 0;
const pharmacy_profile_repository_1 = require("./pharmacy-profile.repository");
class PharmacyProfileService {
    repository = new pharmacy_profile_repository_1.PharmacyProfileRepository();
    async getProfile(userId) {
        const staff = await this.repository.findByUserId(userId);
        if (!staff) {
            throw new Error("You are not assigned to any pharmacy.");
        }
        if (!staff.pharmacies) {
            throw new Error("Pharmacy not found.");
        }
        return {
            id: Number(staff.pharmacies.id),
            name: staff.pharmacies.name,
            logo_url: staff.pharmacies.logo_url,
            phone: staff.pharmacies.phone,
            email: staff.pharmacies.email,
            address: staff.pharmacies.address,
            city: staff.pharmacies.cities
                ? {
                    id: Number(staff.pharmacies.cities.id),
                    name: staff.pharmacies.cities.name,
                }
                : null,
            staffRole: staff.role,
            employee: staff.users
                ? {
                    id: Number(staff.users.id),
                    first_name: staff.users.first_name,
                    last_name: staff.users.last_name,
                    email: staff.users.email,
                }
                : null,
        };
    }
    async updateProfile(userId, body) {
        const staff = await this.repository.findByUserId(userId);
        if (!staff) {
            throw new Error("You are not assigned to any pharmacy.");
        }
        if (!staff.pharmacies) {
            throw new Error("Pharmacy not found.");
        }
        await this.repository.updateProfile(staff.pharmacies.id, {
            phone: body.phone,
            address: body.address,
            logo_url: body.logo_url,
        });
        return this.getProfile(userId);
    }
}
exports.PharmacyProfileService = PharmacyProfileService;
