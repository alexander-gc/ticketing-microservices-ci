import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "@alexandergcorg/common";
import { NotFoundError } from "@alexandergcorg/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
// secure means that cookies will only be shared when the request is HTTPS

app.use("/api/users/currentUser", currentUserRouter);
app.use("/api/users/signIn", signInRouter);
app.use("/api/users/signUp", signUpRouter);
app.use("/api/users/signOut", signOutRouter);

app.get("/api/users/home", (req, res) => {
  res.status(200).send("Hi there!");
});

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
  //return next(new NotFoundError()); // with next() and async
});

app.use(errorHandler);

export default app;
