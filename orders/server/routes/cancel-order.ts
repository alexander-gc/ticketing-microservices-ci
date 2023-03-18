import { Router } from "express";
import { requireAuth } from "@alexandergcorg/common";

import { cancelOrder } from "../controllers/orders";

const router = Router();

router.delete("/:id", requireAuth, cancelOrder);

export { router as cancelOrderRouter };
