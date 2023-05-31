import { body } from "express-validator";
import mongoose from "mongoose";

const createOrderValidator = [
  body("ticketId")
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided"),
];

export { createOrderValidator };
