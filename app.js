const express = require("express")
const { getAllTopics } = require("./controllers/topics-controller.js")
const { invalidEndpoint, internalServerError } = require("./controllers/error-handling.js")
const app = express()


app.get("/api/topics", getAllTopics)

//Error handling
app.use(invalidEndpoint)
app.use(internalServerError)

module.exports = app