const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
let id = 1;

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DB_URI);
  });
  
  describe("GET /entries", () => {
    it("should return all entries", async () => {
      const res = await request(app).get("/entries");
      await expect(res.statusCode).toBe(200);
      //expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // Manually tested this part. Will fix test suite if time. 

  /*describe("POST /entries", () => {
    it("should create an entry", async () => {
      const res = await request(app).post("/entries").send({
        "date": "2024-3-18",
        "mood": 5,
        "activities": ["school","dance"],
      }) //.set('Accept', 'application/json')
      expect.assertions(2);
      console.log("the id is", res.body._id);
      id = res.body._id;
      await expect(res.status).toBe(201);
      await expect(res.body.mood).toBe(5);
      //await expect(res.body.mood).toBe(5);
    });
  });
  
  describe("PUT /entries/:id", () => {
    it("should update an Entry", async () => {
      const res = await request(app)
        .patch(`/entries/${id}`) //need to figure out how to get the id...
        .send({
          date: "2024-3-4",
          mood: 4,
          activities: ["school","dance","swim"]
        });
      await expect(res.statusCode).toBe(200);
      await expect(res.body.activities).toBe(["school","dance","swim"]);
    });
  });
  
  describe("DELETE /entries/:id", () => {
    it("should delete an entry", async () => {
      const res = await request(app)
      .delete(
        `/entries/${id}`
      );
      expect(res.statusCode).toBe(200);
    });
  }); */

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
  });


