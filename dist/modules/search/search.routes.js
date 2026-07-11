"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("./search.controller");
const optionalAuth_middleware_1 = require("../../middleware/optionalAuth.middleware");
const router = (0, express_1.Router)();
const controller = new search_controller_1.SearchController();
router.get("/", optionalAuth_middleware_1.optionalAuthMiddleware, controller.search);
exports.default = router;
