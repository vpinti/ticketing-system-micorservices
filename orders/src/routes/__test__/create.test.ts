import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId })
        .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // Create an order with the ticket
    const order = Order.build({
        ticket,
        userId: "1234",
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    // Try to create another order with the same ticket
    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it("reserves a ticket", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // Try to create an order with the ticket
    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it("emits an order created event", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // Try to create an order with the ticket
    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
