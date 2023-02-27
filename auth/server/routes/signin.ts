import { Router } from "express";

import { signIn } from "../controllers/sign";
import { validateRequest } from "@alexandergcorg/common";
import { signInValidator } from "../validators/sign";

const router = Router();

router.post("/", signInValidator, validateRequest, signIn);

export { router as signInRouter };
