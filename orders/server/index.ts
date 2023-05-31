import mongoose from "mongoose";

import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const startUp = async () => {
  // To create a secret by Kubernetes and then to specify it in a manifest
  console.log("Orders service starting up...");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must be defined");

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // TODO: to make some request from ticket services
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error(error);
  }

  app.listen(8000, () => {
    console.log("Listening at port 8000...");
  });
};

startUp();