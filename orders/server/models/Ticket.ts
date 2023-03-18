import mongoose from "mongoose";

import { Order, OrderStatus } from "./Order";

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  updatedAt: string;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// "statics" works for adding more custom methods directly to the ticket model itself. Ticket.build();
ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc =>
  new Ticket(attrs);

// it works for adding a new method to a document (row). await ticket.isReserved();
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called
  const isTicketReserved = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
      ],
    },
  });

  return !!isTicketReserved;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
