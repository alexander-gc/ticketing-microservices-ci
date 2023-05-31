import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@alexandergcorg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
