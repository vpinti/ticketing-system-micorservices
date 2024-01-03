import { Publisher, Subjects, TicketCreatedEvent } from "@vpdgt/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}