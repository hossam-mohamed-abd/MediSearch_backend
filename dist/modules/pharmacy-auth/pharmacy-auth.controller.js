"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pharmacy_auth_service_1 = __importDefault(require("./pharmacy-auth.service"));
const bigintSerializer_1 = require("../../utils/bigintSerializer");
class PharmacyAuthController {
    async login(req, res) {
        try {
            const result = await pharmacy_auth_service_1.default.login(req.body);
            const isProduction = process.env.NODE_ENV === "production";
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json((0, bigintSerializer_1.serializeBigInt)({
                success: true,
                user: result.user,
            }));
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }
    async profile(req, res) {
        try {
            if (!req.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const profile = await pharmacy_auth_service_1.default.profile(BigInt(req.userId));
            return res.json((0, bigintSerializer_1.serializeBigInt)({
                success: true,
                data: profile,
            }));
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    async logout(req, res) {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
        return res.json({
            success: true,
            message: "Logged out successfully.",
        });
    }
}
exports.default = new PharmacyAuthController();
