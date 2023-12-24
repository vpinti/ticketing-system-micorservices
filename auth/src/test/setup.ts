import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

// This is a global function that can be used in all the tests
// It returns a cookie that can be used to authenticate a user
// It is used in auth/src/routes/__test__/current-user.test.ts
// and in auth/src/routes/__test__/signin.test.ts
declare global {
    var signin: () => Promise<string[]>;
}

let mongo: any;

// This is a hook function that runs before all tests
beforeAll(async () => {
    process.env.JWT_KEY = "asdf";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    // This deletes all the collections in the database
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = async () => {
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password,
        })
        .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;
};
