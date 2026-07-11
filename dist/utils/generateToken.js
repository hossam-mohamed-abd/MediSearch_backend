"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => {
    const jwtPayload = {
        userId: Number(payload.userId),
        role: payload.role ?? "customer",
        pharmacyId: payload.pharmacyId
            ? Number(payload.pharmacyId)
            : undefined,
        staffRole: payload.staffRole ?? undefined,
    };
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    };
    return jsonwebtoken_1.default.sign(jwtPayload, secret, options);
};
exports.generateToken = generateToken;
