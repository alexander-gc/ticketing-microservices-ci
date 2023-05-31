import { Router } from "express";

import { getTicketById } from "../controllers/tickets";

const router = Router();

router.get("/:id", getTicketById);

export { router as getTicketRouter };
