import { Publisher, Subjects, OrderCreatedEvent } from "@alexandergcorg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
