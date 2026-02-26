const request = require("supertest");
const app = require("../app");
require("./setup");

describe("Auth API", () => {
  test("User Signup", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        accountType: "personal",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.balance).toBe(0);
    expect(res.body.token).toBeDefined();
  });

  test("User Login", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Login User",
        email: "login@example.com",
        accountType: "personal",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Get Current User (Protected Route)", async () => {
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Protected User",
        email: "protected@example.com",
        accountType: "personal",
        password: "123456"
      });

    const token = signup.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("protected@example.com");
  });
});