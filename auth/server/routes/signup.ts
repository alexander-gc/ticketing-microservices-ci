import { Router } from "express";

import { signUp } from "../controllers/sign";
import { signUpValidator } from "../validators/sign";
import { validateRequest } from "@alexandergcorg/common";

const router = Router();

router.post("/", signUpValidator, validateRequest, signUp);

export { router as signUpRouter };
