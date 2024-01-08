import { Publisher, OrderCancelledEvent, Subjects } from "@vpdgt/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}