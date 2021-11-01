const db = require("../db/connection");

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
