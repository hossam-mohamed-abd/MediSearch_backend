import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import { PharmacyProfileController } from "./pharmacy-profile.controller";

const router = Router();

const controller =
  new PharmacyProfileController();

router.use(authMiddleware);

router.get(
  "/",
  controller.getProfile,
);

router.put(
  "/",
  controller.updateProfile,
);

export default router;