import { Response, Request } from "express";
import { BadRequestError, NotAuthorizedError } from "@alexandergcorg/common";
//import { Order } from "../models/Orders";
//import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const createOrder = async (req: Request, res: Response) => {
  const {} = req.body;

  /*
  const order = Order.build({
    title,
    price,
    userId: req.user!.id,
  });

  await order.save();*/

  /*await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });*/

  return res.status(201).send("order");
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  let order;

  /*
  try {
    order = await Order.findById(id);
  } catch (error) {
    console.error(error);
  }
  */

  if (!order) throw new BadRequestError("Order does not exist or invalid id");

  return res.status(200).send(order);
};

const getOrders = async (req: Request, res: Response) => {
  //const orders = await Order.find();

  return res.status(200).send("orders");
};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  let order;

  /*
  try {
    order = await Order.findById(id);
  } catch (error) {
    console.error(error);
  }*/

  if (!order) throw new BadRequestError("Order does not exist or invalid id");
  //if (order.userId !== req.user!.id) throw new NotAuthorizedError();

  //order.status = '';
  //await order.save();

  /*
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });*/

  return res.status(200).send("Order deleted");
};

export { createOrder, getOrderById, getOrders, deleteOrder };
