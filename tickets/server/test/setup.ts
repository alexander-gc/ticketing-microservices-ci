import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import app from "../app";

declare global {
  var getCookie: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "secret_key_jwt";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  if (mongo) await mongo.stop();

  await mongoose.connection.close();
});

// To sign up correctly and get a cookie
global.getCookie = async () => {
  const body: { email: string; password: string } = {
    email: "test@test.com",
    password: "password",
  };

  // To sign up
  const response = await request(app).post("/api/users/signUp").send(body);

  // To save cookie
  const cookie = response.get("Set-Cookie");

  return cookie;
};
