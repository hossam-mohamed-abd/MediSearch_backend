import { Router } from "express";

import pharmacyAuthController from "./pharmacy-auth.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

/**
 * Login
 */
router.post(
  "/login",
  pharmacyAuthController.login,
);

/**
 * Current Pharmacy Profile
 */
router.get(
  "/profile",
  authMiddleware,
  pharmacyAuthController.profile,
);

/**
 * Logout
 */
router.post(
  "/logout",
  authMiddleware,
  pharmacyAuthController.logout,
);

export default router;