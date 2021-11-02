const {
  fetchReviewById,
  fetchAndUpdateReviewVotes,
  fetchReviews,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.updateReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  fetchAndUpdateReviewVotes(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order_by, category } = req.query;

  fetchReviews(sort_by, order_by, category)
      .then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch(next);
};
