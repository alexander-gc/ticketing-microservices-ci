import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";

it("can fetch a list of tickets", async () => {
  const tickets = [
    { title: "concert_1", price: 250 },
    { title: "concert_2", price: 100 },
    { title: "concert_3", price: 200 },
  ];

  for (const ticket of tickets) {
    await request(app)
      .post("/api/tickets/create")
      .set("Cookie", global.getCookie())
      .send(ticket)
      .expect(201);
  }

  const result = await request(app).get("/api/tickets/show").expect(200);

  expect(result.body.length).toEqual(tickets.length);
  expect(result.body).toBeInstanceOf(Array);
});
