import mongoose from "mongoose";
import request from "supertest";
import MongoMemoryServer from "mongodb-memory-server";
let app;

describe("Auth Routes", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    // require app after env set
    app = require("../index.js"); // server should export express app for testing
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("POST /api/auth/register - registers user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      })
      .expect(201);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      name: "Test",
      email: "test@example.com",
    });
  });

  test("POST /api/auth/login - logs in user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "LogIn", email: "login@example.com", password: "pw" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "pw" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("login@example.com");
  });
});
