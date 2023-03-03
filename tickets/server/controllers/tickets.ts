import { Response, Request } from "express";
import { BadRequestError } from "@alexandergcorg/common";
import { Ticket } from "../models/Ticket";

/*interface AuthenticatedRequest extends Request {
  currentUser?: { id: string; email: string };
}

declare global {
  namespace Express { interface Request { user?: { id: string; email: string } } }
}*/

const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.user!.id,
  });

  await ticket.save();

  return res.status(201).send(ticket);
};

export { createTicket };
