import { body } from "express-validator";

const signUpValidator = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be valid"),
  /*(req: Request, res: Response, next: NextFunction) => {
    return next();
  },*/
];

const signInValidator = [
  body("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("You must supply an email"),
  body("password").trim().notEmpty().withMessage("You must supply a password"),
];

export { signUpValidator, signInValidator };
