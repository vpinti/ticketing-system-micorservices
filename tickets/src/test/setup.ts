import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// This is a global function that can be used in all the tests
// It returns a cookie that can be used to authenticate a user
// It is used in auth/src/routes/__test__/current-user.test.ts
// and in auth/src/routes/__test__/signin.test.ts
declare global {
    var signin: () => string[];
    var createMongoId: () => string;
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

global.signin = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: createMongoId(),
        email: 'test@test.com'
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
};

global.createMongoId = () => {
    return new mongoose.Types.ObjectId().toHexString();
}
