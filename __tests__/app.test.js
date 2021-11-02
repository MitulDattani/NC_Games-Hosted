const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/categories", () => {
  describe("GET /", () => {
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
          expect(response.body.msg).toBe("Bad review_id");
        });
    });

    test('Status 404: Returns 404 with "No review found for review_id: 9999" id exceeds this', () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("No review found for review_id: 9999");
        });
    });
  });

  describe("PATCH /api/reviews/:review_id", () => {
    test("Status 200: Correctly increments votes (Positive)", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(2);
        });
    });

    test("Status 200: Correctly decrements votes (Negative)", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(0);
        });
    });

    test("Status 200: Ignores other properties on the object if multiple keys are passed", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "1", name: "mitch" })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(2);
        });
    });

    test("Status 400: Responds with message if body is empty", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send()
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Patch body is empty");
        });
    });

    test("Status 400: Responds with message if inc_votes is not a number", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "dog" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid input for inc_votes");
        });
    });
  });

  describe("GET /api/reviews", () => {
    test("Status 200: Correctly returns an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              review_id: expect.any(Number),
              owner: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    test("Status 404: Responds with invalid url if not recognised", () => {
      return request(app)
        .get("/api/reviewsssss")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid URL");
        });
    });

    describe("?sort_by", () => {
      test("Status 200: Accepts sort_by query sorting columns", () => {
        return request(app)
          .get("/api/reviews?sort_by=category")
          .expect(200)
          .then(({ body: { reviews } }) => {
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                review_id: expect.any(Number),
                owner: expect.any(String),
                title: expect.any(String),
                category: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
                comment_count: expect.any(String),
              });
            });
            expect(reviews).toBeSortedBy("category");
          });
      });

      test("Status 400: sort_by must be valid column in the table", () => {
        return request(app)
          .get("/api/reviews?sort_by=not-a-column")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("sort_by query invalid input");
          });
      });
    });

    describe("?order_by", () => {
      test("Status 200: Accepts order_by query to change from ASC/DESC", () => {
        return request(app)
          .get("/api/reviews?order_by=DESC")
          .expect(200)
          .then(({ body: { reviews } }) => {
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                review_id: expect.any(Number),
                owner: expect.any(String),
                title: expect.any(String),
                category: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
                comment_count: expect.any(String),
              });
            });
            expect(reviews).toBeSortedBy("created_at", { descending: true });
          });
      });

      test("Status 400: order_by must be ASC/DESC", () => {
        return request(app)
          .get("/api/reviews?order_by=something-else")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("order_by query invalid input");
          });
      });
    });

    describe("?category", () => {
      test("Status 200: Accepts category query", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body: { reviews } }) => {
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                review_id: expect.any(Number),
                owner: expect.any(String),
                title: expect.any(String),
                category: "dexterity",
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
                comment_count: expect.any(String),
              });
            });
            expect(reviews).toBeSortedBy("created_at");
          });
      });

      test("Status 404: category that is not in the database", () => {
        return request(app)
          .get("/api/reviews?category=not-in-db")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Category does not exist");
          });
      });

      test("Status 404: category has no reviews", () => {
        return request(app)
          .get("/api/reviews")
          .query({ category: "children's games" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Category has no reviews");
          });
      });
    });
  });
});
