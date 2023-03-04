import { Router } from "express";
import { validateRequest, requireAuth } from "@alexandergcorg/common";

import { updateTicket } from "../controllers/tickets";
import { updateTicketValidator } from "../validators/tickets";

const router = Router();

router.put(
  "/:id",
  requireAuth,
  updateTicketValidator,
  validateRequest,
  updateTicket
);

export { router as updateTicketRouter };
