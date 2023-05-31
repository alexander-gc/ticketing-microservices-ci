import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@alexandergcorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
