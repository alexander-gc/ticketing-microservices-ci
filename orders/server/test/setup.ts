import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../app";

declare global {
  var getCookie: (id?: string, email?: string) => string[];
}

jest.mock("../nats-wrapper.ts"); // redirects to => ./__mocks__/nats-wrapper.ts

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "secret_key_jwt";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  if (mongo) await mongo.stop();

  await mongoose.connection.close();
});

// To create a cookie manually
global.getCookie = (id?: string, email?: string) => {
  let payload; // new mongoose.Types.ObjectId().toHexString

  id && email
    ? (payload = { id, email })
    : (payload = { id: "12jfjf22", email: "test@random.com" });

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const sessionJSON = JSON.stringify({ jwt: token });

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};