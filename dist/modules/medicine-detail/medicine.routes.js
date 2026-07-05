"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicine_detail_controller_1 = require("./medicine-detail.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const controller = new medicine_detail_controller_1.MedicineDetailController();
router.get("/:id", (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return next();
    }
    return (0, auth_middleware_1.authMiddleware)(req, res, next);
}, controller.getDetail);
exports.default = router;
