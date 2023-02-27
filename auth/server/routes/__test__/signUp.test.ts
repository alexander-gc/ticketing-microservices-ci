import request from "supertest";

import app from "../../app";

describe("=> making many signup with incorrect body ", () => {
  const bodyList: { email?: string; password?: string }[] = [
    { email: "test@test.com", password: "p" },
    { email: "testtestcom", password: "password" },
    { email: "", password: "" },
    { email: "test@test.com" },
    { password: "password" },
  ];

  let i: number = 0;

  for (const body of bodyList) {
    // maybe to put this for of into a only "it", with many expects
    let response: any;
    i += 1;

    beforeAll(async () => {
      response = await request(app).post("/api/users/signUp").send(body);
    });

    describe(`* example ${i}`, () => {
      // add the description of that example
      it("returns a 400 on bad or incomplete body", async () => {
        expect(response.status).toEqual(400);
      });

      it("returns an errors array on bad or incomplete body", async () => {
        expect(response.body.errors).not.toBeUndefined();
        expect(response.body.errors).toBeInstanceOf(Array);
      });
    });
  }
});

describe("=> making a successful signup with correct body", () => {
  const body: { email: string; password: string } = {
    email: "test@test.com",
    password: "password",
  };

  let response: any;

  beforeAll(async () => {
    response = await request(app).post("/api/users/signUp").send(body);
  });

  it("returns a 201 on successful signup", async () => {
    expect(response.status).toEqual(201);
  });

  it("returns a correct response on successful signup", async () => {
    expect(response.body.email).toEqual(body.email);
    expect(response.body.id).not.toBeUndefined();
  });

  it("password and errors must be undefined", async () => {
    expect(response.body.password).toBeUndefined();
    expect(response.body.errors).toBeUndefined();
  });

  it("sets a cookie after successful signup", async () => {
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("=> making a signup with duplicate emails", () => {
  const body: { email: string; password: string } = {
    email: "test@test.com",
    password: "password",
  };

  it("disallows duplicate emails", async () => {
    await request(app).post("/api/users/signUp").send(body).expect(201);
    await request(app).post("/api/users/signUp").send(body).expect(400);
  });
});
