const { connect } = require("./database");
const request = require("supertest");
const app = require("../index");
const { blogModel } = require("../models/blog");
const BlogsTest = require("./blog.test.data");
const { userModel } = require("../models/user");
const mongoose = require("mongoose");

describe("User: POST /user/signup", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const user = {
      firstName: "bliss",
      lastName: "felix",
      email: "blissfelix@gmail.com",
      password: "password",
    };
    const res = await request(app)
      .post("/user/signup")
      .set("content-type", "application/json")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("firstName", "bliss");
    expect(res.body.user).toHaveProperty("lastName", "felix");
    expect(res.body.user).toHaveProperty("email", "blissfelix@gmail.com");
  });
});

describe("User: POST /user/signin", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signin a user", async () => {
    const user = {
      firstName: "bliss",
      lastName: "felix",
      email: "blissfelix@gmail.com",
      password: "password",
    };

    await userModel.create(user);

    const res = await request(app)
      .post("/user/signin")
      .set("content-type", "application/json")
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
