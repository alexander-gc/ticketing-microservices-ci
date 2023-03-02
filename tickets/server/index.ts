import mongoose from "mongoose";

import app from "./app";

const startUp = async () => {
  // To create a secret by Kubernetes and then to specify it in a manifest
  console.log("Tickets service starting up...");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error(error);
  }

  app.listen(8000, () => {
    console.log("Listening at port 8000...");
  });
};

startUp();
