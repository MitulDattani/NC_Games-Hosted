const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/categories", () => {
  describe("GET", () => {
    test("Status 200: Returns object of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });

    test("Status 404: Responds with invalid url if not recognised", () => {
      return request(app)
        .get("/api/not-a-route")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid URL");
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET /api/reviews/:review_id", () => {
    test("Status 200: Correctly return a single review based on id", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 1,
          });
        });
    });

    test('Status 404: Returns 404 with "Bad review id" if bad path used', () => {
      return request(app)
        .get("/api/reviews/dog")
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe("Bad review_id")
      })
    });

    test('Status 404: Returns 404 with "No review found for review_id: 9999" id exceeds this', () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe("No review found for review_id: 9999")
      })
    });
  });

  describe('PATCH /api/reviews/:review_id', () => {
    test('Status 200: Correctly increments votes (Positive)', () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(2)
        })
    });

    test('Status 200: Correctly decrements votes (Negative)', () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(0)
        })
    });

  });

});
