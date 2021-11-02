const db = require("../db/connection");
const checkExists = require("../db/utils");

exports.fetchReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${review_id}`,
        });
      }
      return review;
    });
};

exports.fetchAndUpdateReviewVotes = (review_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Patch body is empty",
    });
  }

  if (/^[\d]|^-[\d]/.test(inc_votes) === false) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input for inc_votes",
    });
  }

  let queryArr = [review_id];
  let queryStr = `UPDATE reviews `;

  if (inc_votes < 0) {
    let votes = String(inc_votes).slice(1);
    queryArr.push(votes);
    queryStr += `SET votes = votes - $1 WHERE review_id = $2 RETURNING *;`;
  } else {
    queryArr.push(inc_votes);
    queryStr += `SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;
  }

  return db.query(queryStr, queryArr).then(({ rows }) => {
    return rows[0];
  });
};

exports.fetchReviews = (sort_by = "created_at", order_by = "ASC", category) => {
  if (
    ![
      "review_id",
      "owner",
      "title",
      "category",
      "review_img_url",
      "votes",
      "created_at",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      msg: "sort_by query invalid input",
    });
  }

  if (!["ASC", "asc", "DESC", "desc"].includes(order_by)) {
    return Promise.reject({
      status: 400,
      msg: "order_by query invalid input",
    });
  }

  let queryStr = `SELECT 
                    reviews.review_id,
                    reviews.owner,
                    reviews.title,
                    reviews.category,
                    reviews.review_img_url,
                    reviews.votes,
                    reviews.created_at,
                  COUNT(comments.comment_id) AS comment_count
                  FROM reviews LEFT JOIN comments on reviews.review_id = comments.review_id`;

  let queryArr = [];

  if (category) {
    queryArr.push(category);
    queryStr += ` WHERE reviews.category = $1`;
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order_by}`;

  return db.query(queryStr, queryArr).then(({ rows }) => {
    if (!rows.length) {
      return checkExists("categories", "slug", category).then(() => {
        return Promise.reject({
          status: 400,
          msg: "Category has no reviews",
        });
      });
    }

    return rows;
  });
};
