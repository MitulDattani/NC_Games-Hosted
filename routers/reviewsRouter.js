const {getReviewById, updateReviewVotesById, getReviews} = require("../controllers/reviews.controller")

const reviewsRouter = require("express").Router()

reviewsRouter.route('/:review_id').get(getReviewById).patch(updateReviewVotesById)
reviewsRouter.route('/').get(getReviews)

module.exports = reviewsRouter;