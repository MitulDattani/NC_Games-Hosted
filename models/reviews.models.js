const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
    // const queryStr = format(`SELECT * FROM reviews WHERE review_id = %L;`, [review_id])
    return db
        .query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
        .then(({ rows }) => {
            console.log(rows[0])
            return rows[0]
        })
    
};
