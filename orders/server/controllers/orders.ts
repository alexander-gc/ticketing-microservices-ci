import { Response, Request } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
} from "@alexandergcorg/common";

import { Order } from "../models/Order";
import { Ticket } from "../models/Ticket";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) throw new BadRequestError("Ticket does not exist");

  const isTicketReserved = await ticket.isReserved();

  if (isTicketReserved) throw new BadRequestError("Ticket is already reserved");

  const expiration = new Date(); // current date

  expiration.setMinutes(expiration.getMinutes() + 15); // date with 15 more min

  const order = Order.build({
    userId: req.user!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: ticket,
  });
  await order.save();

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    userId: order.userId,
    status: order.status,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  return res.status(201).send(order);
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  let order;

  try {
    order = await Order.findById(id).populate("ticket");
  } catch (error) {
    console.error(error);
  }

  if (!order) throw new BadRequestError("Order does not exist");
  if (req.user!.id !== order.userId) throw new NotAuthorizedError();

  return res.status(200).send(order);
};

const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.user!.id,
  }).populate("ticket");

  return res.status(200).send(orders);
};

const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  let order;

  try {
    order = await Order.findById(id).populate("ticket");
  } catch (error) {
    console.error(error);
  }

  if (!order) throw new BadRequestError("Order does not exist");
  if (req.user!.id !== order.userId) throw new NotAuthorizedError();

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: { id: order.ticket.id },
  });

  return res.status(200).send(order);
};

export { createOrder, getOrderById, getOrders, cancelOrder };
