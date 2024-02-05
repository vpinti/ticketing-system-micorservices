import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@vpdgt/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 99,
        userId: "asdf",
    });
    await ticket.save();

    // Create a fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "alskdfj",
        expiresAt: "alskdjf",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };
    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    return { listener, ticket, data, msg };
}

it("sets the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    
    // Write assertions to make sure a ticket was created!
    const updatedTicket = await Ticket.findById(ticket.id);
    console.log(ticket)
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
    const { listener, ticket, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function is called
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // @ts-ignore
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});
