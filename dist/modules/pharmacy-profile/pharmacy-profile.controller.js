"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyProfileController = void 0;
const pharmacy_profile_service_1 = require("./pharmacy-profile.service");
const service = new pharmacy_profile_service_1.PharmacyProfileService();
class PharmacyProfileController {
    getProfile = async (req, res) => {
        try {
            const userId = BigInt(req.user.id);
            const data = await service.getProfile(userId);
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
    updateProfile = async (req, res) => {
        try {
            const userId = BigInt(req.user.id);
            const data = await service.updateProfile(userId, req.body);
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
exports.PharmacyProfileController = PharmacyProfileController;
