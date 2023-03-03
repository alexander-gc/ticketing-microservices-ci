import { Response, Request } from "express";
import { BadRequestError } from "@alexandergcorg/common";

const createTicket = async (req: Request, res: Response) => {
  return res.status(201).send({});
};

export { createTicket };
