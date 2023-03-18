import mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import { Ticket } from "../../models/Ticket";

it("returns an error if the order is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const result = await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", global.getCookie());

  expect(result.status).toEqual(400);
  expect(result.body.errors[0].message).toEqual("Order does not exist");
});

it("returns an error if the user is not signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const result = await request(app).get(`/api/orders/${id}`);

  expect(result.status).toEqual(401);
  expect(result.body.errors[0].message).toEqual("Not Authorized");
});

it("returns an error if the order does not belong to that user", async () => {
  const newTicket = Ticket.build({ title: "concert_1", price: 100 });
  await newTicket.save();

  const order = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: newTicket.id });

  const result = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set("Cookie", global.getCookie("123alex123", "alex@alex.com"));

  expect(result.status).toEqual(401);
  expect(result.body.errors[0].message).toEqual("Not Authorized");
});

it("returns successfully an order", async () => {
  const newTicket = Ticket.build({ title: "concert_1", price: 100 });
  await newTicket.save();

  const order = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: newTicket.id });

  const result = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set("Cookie", global.getCookie());

  expect(result.status).toEqual(200);
  expect(result.body).toBeInstanceOf(Object);
  expect(order.body.id).toEqual(result.body.id);
  expect(result.body.ticket).not.toBeUndefined();
});
