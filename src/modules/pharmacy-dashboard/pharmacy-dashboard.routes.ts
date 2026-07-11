import { Router } from "express";

import { PharmacyDashboardController } from "./pharmacy-dashboard.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
const router = Router();

const controller =
    new PharmacyDashboardController();

router.get(
    "/",
    authMiddleware,
    controller.getDashboard,
);

export default router;