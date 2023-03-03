import request from "supertest";

import app from "../../app";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets/create").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets/create").send({}).expect(401);
});

it("returns a different status than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ price: 10 })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "title_1", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "title_1" })
    .expect(400);
});

it("creates a ticket with valid parameters", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.getCookie())
    .send({ title: "title_1", price: 100 })
    .expect(201);
});
