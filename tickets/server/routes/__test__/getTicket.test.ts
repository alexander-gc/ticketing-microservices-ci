import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";

it("returns a 400 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/show/${id}`).expect(400);
});

it("returns the ticket if the ticket is found", async () => {
  const body = { title: "concert", price: 20 };

  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send(body)
    .expect(201);

  const ticketById = await request(app)
    .get(`/api/tickets/show/${response.body.id}`)
    .expect(200);

  expect(ticketById.body.title).toEqual(body.title);
  expect(ticketById.body.price).toEqual(body.price);
});
