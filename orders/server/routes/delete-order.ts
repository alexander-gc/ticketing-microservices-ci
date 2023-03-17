import { Router } from "express";
import { requireAuth } from "@alexandergcorg/common";

import { deleteOrder } from "../controllers/orders";

const router = Router();

router.delete("/:id", requireAuth, deleteOrder);

export { router as deleteOrderRouter };
