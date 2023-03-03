import { Router } from "express";
import { validateRequest, requireAuth } from "@alexandergcorg/common";

import { createTicket } from "../controllers/tickets";
import { createTicketValidator } from "../validators/tickets";

const router = Router();

//router.post("/", signUpValidator, validateRequest, signUp);

router.post(
  "/",
  requireAuth,
  createTicketValidator,
  validateRequest,
  createTicket
);

export { router as createTicketRouter };
