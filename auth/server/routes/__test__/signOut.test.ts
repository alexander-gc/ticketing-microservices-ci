import request from "supertest";

import app from "../../app";

describe("=> making a signout", () => {
  const body: { email: string; password: string } = {
    email: "test@test.com",
    password: "password",
  };

  let response: any;

  beforeAll(async () => {
    await request(app).post("/api/users/signUp").send(body).expect(201);

    response = await request(app).post("/api/users/signOut");
  });

  it("returns a 200 on signout", async () => {
    expect(response.status).toEqual(200);
  });

  it("clears the cookie after signing out", async () => {
    expect(response.get("Set-Cookie")[0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
