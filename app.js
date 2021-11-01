const express = require('express');
const { handlesHomeMadeErrors, handles500errors } = require('./controllers/errors.controller');
const { apiRouter } = require("./routers/apiRouter")

const app = express();

app.use(express.json())

app.use('/api', apiRouter)

app.all("*", (req, res) => {
    res.status(404).send({msg: "Invalid URL"})
})

app.use(handlesHomeMadeErrors)
app.use(handles500errors)

module.exports = app