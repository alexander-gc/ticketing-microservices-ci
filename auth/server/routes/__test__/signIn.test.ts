import request from "supertest";

import app from "../../app";

describe("=> making a successful singin with correct body", () => {
  const body: { email: string; password: string } = {
    email: "test@test.com",
    password: "password",
  };

  let response: any;

  beforeAll(async () => {
    await request(app).post("/api/users/signUp").send(body);

    response = await request(app).post("/api/users/signIn").send(body);
  });

  it("returns a 201 on successful signin", async () => {
    expect(response.status).toEqual(200);
  });

  it("returns a response on successful signin", async () => {
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBeDefined();
  });

  it("password and errors must be undefined", async () => {
    expect(response.body.password).toBeUndefined();
    expect(response.body.errors).toBeUndefined();
  });

  it("sets a cookie after successful signin", async () => {
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("=> making a singin with incorrect password", () => {
  const body: { email: string; password: string } = {
    email: "test@test.com",
    password: "password",
  };

  let response: any;

  beforeAll(async () => {
    await request(app).post("/api/users/signUp").send(body);

    response = await request(app).post("/api/users/signIn").send({
      email: "test@test.com",
      password: "password123",
    });
  });

  it("returns a 400 on signin", async () => {
    expect(response.status).toEqual(400);
  });

  it("passwords do not match between them", async () => {
    expect(response.body.errors).not.toBeUndefined();
    expect(response.body.errors).toBeInstanceOf(Array);
  });

  it("response has an error msg", async () => {
    //toContain
    expect(response.body.errors[0]).toEqual({
      message: "Password is not correct",
    });
  });
});

describe("=> making a singin with non-exististing email", () => {
  let response: any;

  beforeAll(async () => {
    response = await request(app).post("/api/users/signIn").send({
      email: "test@test.com",
      password: "password",
    });
  });

  it("returns a 400 on signin", async () => {
    expect(response.status).toEqual(400);
  });

  it("email must not exist", async () => {
    expect(response.body.errors).not.toBeUndefined();
    expect(response.body.errors).toBeInstanceOf(Array);
  });
});
