// To listen to events
import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// Client
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true); // acknowledge manually

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log("Received event #" + msg.getSequence(), "with data: " + data);
    }

    msg.ack(); // has been acknowledged
  });
});

// first it closes nats client and then closes the node app
process.on("SIGINT", () => stan.close()); // interrumpt signals
process.on("SIGTERM", () => stan.close()); // terminate signals
