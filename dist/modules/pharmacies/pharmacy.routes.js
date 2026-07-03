"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacy_controller_1 = require("./pharmacy.controller");
const router = (0, express_1.Router)();
const controller = new pharmacy_controller_1.PharmacyController();
router.get('/', controller
    .getFeaturedPharmacies);
exports.default = router;
