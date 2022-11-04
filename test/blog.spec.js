const request = require("supertest");
const { connect } = require("./database");
const app = require("../index");
const moment = require("moment");
const { blogModel } = require("../models/blog");
const BlogsTest = require("./blog.test.data");
const { userModel } = require("../models/user");

describe("Blog Route", () => {
  let conn;
  let token;

  beforeAll(async () => {
    conn = await connect();

    await userModel.create({
      firstName: "bliss",
      lastName: "felix",
      email: "blissfelix@gmail.com",
      password: "password",
      state: "draft",
    });

    const signInResponse = await request(app)
      .post("/user/signin")
      .set("content-type", "application/json")
      .send({
        firstName: "bliss",
        lastName: "felix",
        email: "blissfelix@gmail.com",
        password: "password",
      });

    token = signInResponse.body.token;
  });

  beforeEach(async () => {
    for (const blogTest of BlogsTest) {
      const blogData = new blogModel({
        _id: blogTest._id,
        body: blogTest.body,
        title: blogTest.title,
        description: blogTest.description,
        tags: blogTest.tags,
        state: blogTest.state,
      });
      await blogData.save();
    }
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return created blogs", async () => {
    const res = await request(app)
      .post("/blog")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        body: "rat are amazing for real????",
        title: "My wonderful rat",
        tags: "@rat",
        description: "my desc",
        timestamps: moment().toDate(),
        reading_time: "2min",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("blog");
  });

  it("should return all blogs", async () => {
    const res = await request(app)
      .get("/blog")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("blogs");
  });

  it("should return single blog", async () => {
    const blog = await blogModel.findOne();

    const res = await request(app)
      .get(`/blog/${blog._id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should publish blog state", async () => {
    const blog = await blogModel.findOne();

    const res = await request(app)
      .patch(`/blog/${blog._id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        state: "published",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("blog");
  });

  it("should update blog", async () => {
    const blog = await blogModel.findOne();

    const res = await request(app)
      .put(`/blog/${blog._id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        body: "new body hello",
        title: "new title relax",
        description: "new desc",
        tags: "@new",
        state: "published",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("blog");
  });

  it("should delete post", async () => {
    const blog = await blogModel.findOne();
    const res = await request(app)
      .delete(`/blog/${blog._id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
