import request from "supertest";

import app from "../../app";

describe("=> responds with details about the current user", () => {
  const email: string = "test@test.com";
  let response: any;

  beforeAll(async () => {
    const cookie = await global.getCookie();

    response = await request(app)
      .get("/api/users/currentUser")
      .set("Cookie", cookie);
  });

  it("returns a 200 on current user", async () => {
    expect(response.status).toEqual(200);
  });

  it("to get the details", async () => {
    expect(response.body.user).not.toBeNull();
    expect(response.body.user).toBeInstanceOf(Object);
    expect(response.body.user.email).toEqual(email);
  });
});

describe("=> responds with a null if not authenticated", () => {
  it("returns a null", async () => {
    const response = await request(app).get("/api/users/currentUser");

    expect(response.body.user).toEqual(null);
  });
});
