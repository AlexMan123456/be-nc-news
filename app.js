//Imports
const express = require("express")
const cors = require("cors")
const { invalidEndpoint, internalServerError, sqlErrors, customErrors } = require("./controllers/error-handling.js")
const articles = require("./routers/articles-router.js")
const topics = require("./routers/topics-router.js")
const users = require("./routers/users-router.js")
const endpoints = require("./routers/endpoints-router.js")
const comments = require("./routers/comments-router.js")
const app = express()

//Allow Cross Origin Resource Sharing
app.use(cors())
//Needed to parse request body
app.use(express.json())

app.use("/api", endpoints)
app.use("/api/topics", topics)
app.use("/api/users", users)
app.use("/api/articles", articles)
app.use("/api/comments", comments)

//Error handling
app.use(invalidEndpoint)
app.use(sqlErrors)
app.use(customErrors)
app.use(internalServerError)

module.exports = app