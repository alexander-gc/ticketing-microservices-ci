import { Router } from "express";
import { requireAuth } from "@alexandergcorg/common";

import { getOrders } from "../controllers/orders";

const router = Router();

router.get("/", requireAuth, getOrders);

export { router as getListRouter };
