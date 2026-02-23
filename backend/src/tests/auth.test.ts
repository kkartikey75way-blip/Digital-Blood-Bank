import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

describe("Auth Integration Tests", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.disconnect(); // Disconnect from real DB if connected
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    const testUser = {
        name: "Test Donor",
        email: "test@example.com",
        password: "password123",
        role: "DONOR",
        phone: "+1234567890",
    };

    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(testUser.email);
    });

    it("should login the user", async () => {
        // Register first
        await request(app).post("/api/auth/register").send(testUser);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
    });

    it("should fail with invalid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: "wrongpassword",
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});
