import { Router } from "express";
import { requireAuth } from "@alexandergcorg/common";

import { getOrderById } from "../controllers/orders";

const router = Router();

router.get("/:id", requireAuth, getOrderById);

export { router as getOrderRouter };
