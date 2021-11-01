const db = require("../db/connection")

exports.fetchAllCategories = (req, res) => {
    return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows }) => {
            return rows
        })
}