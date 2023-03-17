import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@alexandergcorg/common";
import { createOrderRouter } from "./routes/create-order";
import { deleteOrderRouter } from "./routes/delete-order";
import { getListRouter } from "./routes/get-list";
import { getOrderRouter } from "./routes/get-order";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser); // req.user = { id, email } || null

app.use("/api/orders/create", createOrderRouter);
app.use("/api/orders/delete", deleteOrderRouter);
app.use("/api/orders", getListRouter);
app.use("/api/orders", getOrderRouter);

app.get("/api/tickets/home", (req, res) => {
  res.status(200).send("Hi there!");
});

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
