import mongoose from "mongoose";
import request from "supertest";
import MongoMemoryServer from "mongodb-memory-server";
let app;

describe("Sweets Routes", () => {
  let mongoServer;
  let userToken;
  let adminToken;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    app = require("../src/server");

    // create regular user
    const u = await request(app).post("/api/auth/register").send({
      name: "User",
      email: "user@example.com",
      password: "pw",
    });
    userToken = u.body.token;

    // create admin user
    const a = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@example.com",
      password: "pw",
      role: "admin",
    });
    adminToken = a.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("POST /api/sweets - create sweet (protected)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 20,
        quantity: 50,
      })
      .expect(201);

    expect(res.body.name).toBe("Gulab Jamun");
  });

  test("GET /api/sweets - get sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("POST /api/sweets/:id/purchase - purchase reduces quantity", async () => {
    const create = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Ladoo", category: "Indian", price: 15, quantity: 5 });

    const id = create.body._id;
    const purchaseRes = await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ qty: 2 })
      .expect(200);

    expect(purchaseRes.body.quantity).toBe(3);
  });

  test("POST /api/sweets/:id/restock - admin only", async () => {
    const create = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Barfi", category: "Indian", price: 10, quantity: 2 });

    const id = create.body._id;
    const r = await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ qty: 5 })
      .expect(200);

    expect(r.body.quantity).toBe(7);
  });
});
