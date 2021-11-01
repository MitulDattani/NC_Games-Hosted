const categoriesRouter = require("./categoriesRouter");
const reviewsrouter = require("./reviewsRouter")

const apiRouter = require("express").Router();

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsrouter)

module.exports = { apiRouter };
