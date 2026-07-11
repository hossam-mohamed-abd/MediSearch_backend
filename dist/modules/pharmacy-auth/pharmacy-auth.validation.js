"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pharmacyLoginSchema = void 0;
const zod_1 = require("zod");
exports.pharmacyLoginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email"),
    password: zod_1.z
        .string()
        .min(1, "Password is required"),
});
