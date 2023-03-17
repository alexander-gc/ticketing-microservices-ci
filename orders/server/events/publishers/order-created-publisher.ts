import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@alexandergcorg/common";

export class OrderCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
