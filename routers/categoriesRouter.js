const { getAllCategories } = require("../controllers/categories.controller")

const categoriesRouter = require("express").Router();

categoriesRouter.route('/').get(getAllCategories);

module.exports = categoriesRouter;