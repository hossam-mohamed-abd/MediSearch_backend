"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacy_auth_controller_1 = __importDefault(require("./pharmacy-auth.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Login
 */
router.post("/login", pharmacy_auth_controller_1.default.login);
/**
 * Current Pharmacy Profile
 */
router.get("/profile", auth_middleware_1.authMiddleware, pharmacy_auth_controller_1.default.profile);
/**
 * Logout
 */
router.post("/logout", auth_middleware_1.authMiddleware, pharmacy_auth_controller_1.default.logout);
exports.default = router;
