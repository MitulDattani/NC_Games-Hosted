const {getReviewById, updateReviewVotesById} = require("../controllers/reviews.controller")

const reviewsRouter = require("express").Router()

reviewsRouter.route('/:review_id').get(getReviewById).patch(updateReviewVotesById)

module.exports = reviewsRouter;