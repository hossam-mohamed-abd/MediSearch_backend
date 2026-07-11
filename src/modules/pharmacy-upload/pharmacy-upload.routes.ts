import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import { PharmacyUploadController } from "./pharmacy-upload.controller";

import { upload } from "./upload.middleware";

const router = Router();

const controller =
  new PharmacyUploadController();

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  controller.upload,
);

export default router;