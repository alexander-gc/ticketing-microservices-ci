// To listen to events
import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedListener } from "./events/ticket-created-listener";

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

  new TicketCreatedListener(stan).listen();
});

// first it closes nats client and then closes the node app
process.on("SIGINT", () => stan.close()); // interrumpt signals
process.on("SIGTERM", () => stan.close()); // terminate signals
