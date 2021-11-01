const { fetchAllCategories } = require("../models/categories.models");

exports.getAllCategories = (req, res) => {
    fetchAllCategories().then((categories) => {
      console.log({categories})
    res.status(200).send({ categories });
  });
};
