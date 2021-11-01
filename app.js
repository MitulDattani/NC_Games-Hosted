const express = require('express')
const { apiRouter } = require("./routers/apiRouter")

const app = express();


app.use('/api', apiRouter)

app.all("*", (req, res) => {
    res.status(404).send({msg: "Invalid URL"})
})

module.exports = app