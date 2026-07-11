"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacy_dashboard_controller_1 = require("./pharmacy-dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const controller = new pharmacy_dashboard_controller_1.PharmacyDashboardController();
router.get("/", auth_middleware_1.authMiddleware, controller.getDashboard);
exports.default = router;
