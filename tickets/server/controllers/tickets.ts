import { Response, Request } from "express";
import { BadRequestError, NotAuthorizedError } from "@alexandergcorg/common";
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

/*
// de estas formas puedo agregar más props a una clase existente
interface AuthenticatedRequest extends Request {
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

  await new TicketCreatedPublisher("client").publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });

  return res.status(201).send(ticket);
};

const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  let ticket;

  try {
    ticket = await Ticket.findById(id);
  } catch (error) {
    console.error(error);
  }

  /*await Ticket.findById(id)
    .then((value) => (ticket = value))
    .catch((e) => console.error(e));*/

  if (!ticket) throw new BadRequestError("Ticket does not exist or invalid id");

  return res.status(200).send(ticket);
};

const getTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find();

  return res.status(200).send(tickets);
};

const updateTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const { id } = req.params;
  let ticket;

  try {
    ticket = await Ticket.findById(id);
  } catch (error) {
    console.error(error);
  }

  /*await Ticket.findById(id)
    .then((value) => (ticket = value))
    .catch((e) => console.error(e));*/

  if (!ticket) throw new BadRequestError("Ticket does not exist or invalid id");
  if (ticket.userId !== req.user!.id) throw new NotAuthorizedError();

  // ticket.set({ title, price }), await ticket.save();

  ticket.title = title; //title ? title : ticket.title;
  ticket.price = price; //price ? price : ticket.price;
  await ticket.save();

  return res.status(201).send(ticket);
};

export { createTicket, getTicketById, getTickets, updateTicket };
