import { Publisher, Subjects, TicketUpdatedEvent } from "@vpdgt/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}