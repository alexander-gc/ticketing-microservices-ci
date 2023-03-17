import { Router } from "express";
import { validateRequest, requireAuth } from "@alexandergcorg/common";

import { createOrder } from "../controllers/orders";
import { createOrderValidator } from "../validators/orders";

const router = Router();

router.post(
  "/",
  requireAuth,
  createOrderValidator,
  validateRequest,
  createOrder
);

export { router as createOrderRouter };
