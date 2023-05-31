import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 400 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const body = { title: "concert_1", price: 10 };

  await request(app)
    .put(`/api/tickets/update/${id}`)
    .set("Cookie", global.getCookie())
    .send(body)
    .expect(400);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const body = { title: "new_concert", price: 10 };

  const result = await request(app)
    .put(`/api/tickets/update/${id}`)
    .send(body)
    .expect(401);

  expect(result.body.errors[0].message).toEqual("Not Authorized");
});

it("returns a 401 if the user does not own the ticket", async () => {
  let id;
  let result;

  result = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "concert_1", price: 100 })
    .expect(201);

  id = result.body.id;

  result = await request(app)
    .put(`/api/tickets/update/${id}`)
    .set("Cookie", global.getCookie("99random99", "another@email.com")) // different user
    .send({ title: "new_concert", price: 200 })
    .expect(401);

  expect(result.body.errors[0].message).toEqual("Not Authorized");
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  let id;

  const result = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "title_1", price: 100 })
    .expect(201);

  id = result.body.id;

  await request(app)
    .put(`/api/tickets/update/${id}`)
    .set("Cookie", global.getCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/update/${id}`)
    .set("Cookie", global.getCookie())
    .send({ price: -10, title: "new_concert" })
    .expect(400);

  await request(app)
    .put(`/api/tickets/update/${id}`)
    .set("Cookie", global.getCookie())
    .send({
      title: "1010100101oloedldoelodelodedelodoeldeoldelodeoldelodeol",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  let id, title, price;

  const result = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "concert_1", price: 100 })
    .expect(201);

  id = result.body.id;
  title = result.body.title;
  price = result.body.price;

  const ticketUpdated = await request(app)
    .put(`/api/tickets/update/${id}`)
    .set("Cookie", global.getCookie())
    .send({ title: "new_concert", price: 200 })
    .expect(201);

  expect(ticketUpdated.body.title).not.toEqual(title);
  expect(ticketUpdated.body.price).not.toEqual(price);
});

it("publishes an event", async () => {
  const result = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "concert_1", price: 100 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/update/${result.body.id}`)
    .set("Cookie", global.getCookie())
    .send({ title: "new_concert", price: 200 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
