"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pharmacy_auth_repository_1 = __importDefault(require("./pharmacy-auth.repository"));
const generateToken_1 = require("../../utils/generateToken");
class PharmacyAuthService {
    async login(data) {
        const user = await pharmacy_auth_repository_1.default.findByEmail(data.email);
        if (!user) {
            throw new Error("Invalid email or password.");
        }
        const passwordCorrect = await bcryptjs_1.default.compare(data.password, user.password_hash ?? "");
        if (!passwordCorrect) {
            throw new Error("Invalid email or password.");
        }
        if (!user.pharmacy_staff.length) {
            throw new Error("No pharmacy assigned to this account.");
        }
        const staff = user.pharmacy_staff[0];
        if (!staff.pharmacies) {
            throw new Error("Pharmacy not found.");
        }
        await pharmacy_auth_repository_1.default.updateLastLogin(user.id);
        const token = (0, generateToken_1.generateToken)({
            userId: user.id,
            pharmacyId: staff.pharmacy_id,
            role: "pharmacy",
            staffRole: staff.role ?? "staff",
        });
        return {
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                profile_image: user.profile_image,
                role: "pharmacy",
                pharmacy: {
                    id: staff.pharmacies.id,
                    name: staff.pharmacies.name,
                    logo_url: staff.pharmacies.logo_url,
                    phone: staff.pharmacies.phone,
                    email: staff.pharmacies.email,
                    address: staff.pharmacies.address,
                    city: staff.pharmacies.cities?.name,
                    staffRole: staff.role,
                },
            },
        };
    }
    async profile(userId) {
        const user = await pharmacy_auth_repository_1.default.findProfile(userId);
        if (!user) {
            throw new Error("User not found.");
        }
        if (!user.pharmacy_staff.length) {
            throw new Error("No pharmacy assigned.");
        }
        const staff = user.pharmacy_staff[0];
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            role: "pharmacy",
            pharmacy: {
                id: staff.pharmacies?.id,
                name: staff.pharmacies?.name,
                logo_url: staff.pharmacies?.logo_url,
                phone: staff.pharmacies?.phone,
                email: staff.pharmacies?.email,
                address: staff.pharmacies?.address,
                city: staff.pharmacies?.cities?.name,
                governorate: staff.pharmacies?.cities?.governorates?.name,
                staffRole: staff.role,
            },
        };
    }
}
exports.default = new PharmacyAuthService();
