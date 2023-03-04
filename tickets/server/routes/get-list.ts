import { Router } from "express";

import { getTickets } from "../controllers/tickets";

const router = Router();

router.get("/", getTickets);

export { router as getListRouter };
