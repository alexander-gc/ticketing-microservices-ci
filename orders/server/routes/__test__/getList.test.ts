import mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import { Ticket } from "../../models/Ticket";

const buildTicket = async (title: string, price: number) => {
  const newTicket = Ticket.build({ title, price });
  await newTicket.save();

  return newTicket;
};

it("returns an error if the user is not signed in", async () => {
  const result = await request(app).get("/api/orders");

  expect(result.status).toEqual(401);
  expect(result.body.errors[0].message).toEqual("Not Authorized");
});

it("returns successfully my orders", async () => {
  const ticketOne = await buildTicket("concert_1", 250);
  const ticketTwo = await buildTicket("concert_2", 300);
  const ticketThree = await buildTicket("concert_3", 500);

  // User 1
  await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie("123alex", "alex@alex.com"))
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // User 2
  await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  // User 2
  await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.getCookie())
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const result = await request(app)
    .get("/api/orders")
    .set("Cookie", global.getCookie());

  expect(result.status).toEqual(200);
  expect(result.body).toBeInstanceOf(Array);
  expect(result.body.length).toEqual(2);
  expect(result.body[0].ticket).not.toBeUndefined();
  expect(result.body[1].ticket).not.toBeUndefined();
});
