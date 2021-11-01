const { query } = require("../connection");
const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return (
        db
          .query(`DROP TABLE IF EXISTS users;`)
          .then(() => {
            return db.query("DROP TABLE IF EXISTS categories;");
          })
          .then(() => {
            return db.query(`CREATE TABLE categories (
              slug VARCHAR PRIMARY KEY,
              description TEXT
      );`);
          })
          .then(() => {
            return db.query(`CREATE TABLE users (
              username VARCHAR PRIMARY KEY,
              avatar_url TEXT,
              name VARCHAR
      );`);
          })
          .then(() => {
            return db.query(`CREATE TABLE reviews (
              review_id SERIAL PRIMARY KEY,
              title VARCHAR,
              review_body TEXT,
              designer VARCHAR,
              review_image_url TEXT,
              votes INT,
              category VARCHAR REFERENCES categories(slug),
              owner VARCHAR REFERENCES users(username),
              created_at DATE
            );`);
          })
          .then(() => {
            return db.query(`CREATE TABLE comments (
                comment_id SERIAL PRIMARY KEY,
                author VARCHAR REFERENCES users(username),
                review_id INT REFERENCES reviews(review_id),
                votes INT,
                created_at DATE,
                body TEXT
              );`);
          })

          // 2. insert data

          .then(() => {
            const queryStr = format(
              `INSERT INTO categories 
            (slug, description)
            VALUES %L`,
              categoryData.map((category) => {
                return [category.slug, category.description];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO users 
            (username, avatar_url, name)
            VALUES %L`,
              userData.map((user) => {
                return [user.username, user.name, user.avatar_url];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO reviews
          (title, review_body, designer, review_image_url, votes, created_at, owner, category)
          VALUES %L`,
              reviewData.map((review) => {
                return [
                  review.title,
                  review.review_body,
                  review.designer,
                  review.review_image_url,
                  review.votes,
                  review.created_at,
                  review.owner,
                  review.category,
                ];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(`INSERT INTO comments
          (author, review_id, votes, created_at, body) VALUES %L`,
              commentData.map(comment => {
              return [comment.author, comment.review_id, comment.votes, comment.created_at, comment.body]
              }))
            return db.query(queryStr)
        })
      );
    });
};

module.exports = seed;
