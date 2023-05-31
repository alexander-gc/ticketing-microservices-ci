import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@alexandergcorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
