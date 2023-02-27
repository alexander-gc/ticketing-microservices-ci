import { Response, Request } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "@alexandergcorg/common";
import { User } from "../models/User";
import { Password } from "../helpers/password";

const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const doesUserExist = await User.findOne({ email });

  if (doesUserExist) throw new BadRequestError("Email already exists");

  const user = User.build({ email, password });
  await user.save();

  // Generate JWT
  const payload: { id: string; email: string } = {
    id: user.id,
    email: user.email,
  };

  const userJwt = jwt.sign(payload, process.env.JWT_KEY!);

  // Store it on session object
  req.session = { jwt: userJwt };

  return res.status(201).send(user);
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new BadRequestError("User does not exist");

  // To compare passwords
  const passwordsMatch: boolean = await Password.toCompare(
    user.password,
    password
  );

  if (!passwordsMatch) throw new BadRequestError("Password is not correct");

  // Generate JWT
  const payload: { id: string; email: string } = {
    id: user.id,
    email: user.email,
  };

  const userJwt = jwt.sign(payload, process.env.JWT_KEY!);

  // Store it on session object
  req.session = { jwt: userJwt };

  return res.status(200).send(user);
};

const signOut = async (req: Request, res: Response) => {
  req.session = null;

  return res.status(200).send({});
};

export { signUp, signIn, signOut };
