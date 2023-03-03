import mongoose from "mongoose";

interface TicketAttrs {
  title: string; // type of typescript
  price: number;
  userId: string;
}

// Collection is similar to a table in a RDB. (User Table)
// Document is similar to a row in a RDB table. (User Record #1)
interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String, // type of mongoose
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // Ticket Document, Return
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc =>
  new Ticket(attrs);

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
