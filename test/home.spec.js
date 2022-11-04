const request = require("supertest");
const app = require("../index");

describe("Home Route", () => {
  it("Should return status true", async () => {
    const res = await request(app)
      .get("/")
      .set("content-type", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "successful" });
  });

  it("Should return error when routed to undefined route", async () => {
    const res = await request(app)
      .get("/undefined")
      .set("content-type", "application/json");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "route not found" });
  });
});
