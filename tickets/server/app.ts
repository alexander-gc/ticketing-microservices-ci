import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@alexandergcorg/common";
import { createTicketRouter } from "./routes/create-ticket";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser); // req.currentUser = {} || null

app.use("/api/tickets/create", createTicketRouter);

app.get("/api/tickets/home", (req, res) => {
  res.status(200).send("Hi there!");
});

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
  //return next(new NotFoundError()); // with next() and async
});

app.use(errorHandler);

export default app;
