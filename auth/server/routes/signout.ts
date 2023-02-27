import { Router } from "express";

import { signOut } from "../controllers/sign";

const router = Router();

router.post("/", signOut);

export { router as signOutRouter };
