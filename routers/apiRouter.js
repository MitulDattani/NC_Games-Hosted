const { getAllCategories } = require("../controllers/categories.controller");
const { categoriesRouter } = require("./categoriesRouter")

const apiRouter = require("express").Router();

apiRouter.use('/categories', getAllCategories)

module.exports = {apiRouter}