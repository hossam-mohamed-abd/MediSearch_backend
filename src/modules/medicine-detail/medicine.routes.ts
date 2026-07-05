import { Router } from "express";

import { MedicineDetailController } from "./medicine-detail.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

const controller = new MedicineDetailController();

router.get(
  "/:id",
  (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
      return next();
    }

    return authMiddleware(req, res, next);
  },
  controller.getDetail,
);

export default router;
