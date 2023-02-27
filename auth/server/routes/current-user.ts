import { Request, Response, Router } from "express";

import { currentUser } from "@alexandergcorg/common";
//import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.get(
  "/",
  currentUser,
  //requireAuth,
  async (req: Request, res: Response) => {
    return res.status(200).send({ user: req.user || null });
  }
);

export { router as currentUserRouter };
