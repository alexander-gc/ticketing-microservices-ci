import mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import { Ticket } from "../../models/Ticket";

it("returns an error if the user is not signed in", async () => {
  const ticket = Ticket.build({
    title: "new_concert",
    price: 100,
  });
  await ticket.save();

  const result = await request(app)
    .post("/api/orders/create")
    .send({ ticketId: ticket.id });

  expect(result.status).toEqual(401);
  expect(result.body.errors[0].message).toEqual("Not Authorized");
});

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const result = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: ticketId });

  expect(result.status).toEqual(400);
  expect(result.body.errors[0].message).toEqual("Ticket does not exist");
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "new_concert",
    price: 100,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  const result = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: ticket.id });

  expect(result.status).toEqual(400);
  expect(result.body.errors[0].message).toEqual("Ticket is already reserved");
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "new_concert",
    price: 100,
  });
  await ticket.save();

  const currentDate = new Date();
  const result = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: ticket.id });

  expect(result.status).toEqual(201);
  expect(result.body).toBeInstanceOf(Object);
  expect(result.body.status).toEqual("created");
  expect(result.body.ticket.id).toEqual(ticket.id);
  expect(result.body.ticket.title).toEqual(ticket.title);
  expect(result.body.ticket.price).toEqual(ticket.price);
  expect(+new Date(result.body.expiresAt)).toBeGreaterThan(+currentDate);
});

it.todo("emits an order created event");
