import { ExpirationCompleteEvent, Publisher, Subjects } from "@vpdgt/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
