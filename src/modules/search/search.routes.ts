import { Router } from "express";

import { SearchController } from "./search.controller";
import { optionalAuthMiddleware } from "../../middleware/optionalAuth.middleware";

const router = Router();

const controller = new SearchController();

router.get("/", optionalAuthMiddleware, controller.search);

export default router;
