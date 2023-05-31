// To emit events
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// Client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  try {
    const publisher = new TicketCreatedPublisher(stan);

    await publisher.publish({
      id: "123",
      title: "concert_1",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  /*const data = JSON.stringify({
    id: "123",
    title: "concert_1",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });*/
});
