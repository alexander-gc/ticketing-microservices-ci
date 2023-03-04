import { body } from "express-validator";

const createTicketValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Title must be valid"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
];

const updateTicketValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Title must be valid"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
];

export { createTicketValidator, updateTicketValidator };
