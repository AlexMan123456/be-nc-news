const express = require("express")
const { getAllTopics } = require("./controllers/topics-controller.js")
const { invalidEndpoint, internalServerError, sqlErrors, customErrors } = require("./controllers/error-handling.js")
const { getAllEndpoints } = require("./controllers/endpoints-controller.js")
const { getArticleById, getAllArticles } = require("./controllers/articles-controller.js")
const { getCommentsByArticleId } = require("./controllers/comments-controller.js")
const app = express()


app.get("/api", getAllEndpoints)
app.get("/api/topics", getAllTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

//Error handling
app.use(invalidEndpoint)
app.use(sqlErrors)
app.use(customErrors)
app.use(internalServerError)

module.exports = app