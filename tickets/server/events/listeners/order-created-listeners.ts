import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@alexandergcorg/common";

import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ orderId: data.id });
    await ticket.save(); // + version

    //new TicketUpdatedPublisher(natsWrapper.client);

    msg.ack();
  }
}
