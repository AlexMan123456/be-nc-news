//Imports
const express = require("express")
const { getAllTopics } = require("./controllers/topics-controller.js")
const { invalidEndpoint, internalServerError, sqlErrors, customErrors } = require("./controllers/error-handling.js")
const { getAllEndpoints } = require("./controllers/endpoints-controller.js")
const { getArticleById, getAllArticles } = require("./controllers/articles-controller.js")
const { getCommentsByArticleId, postCommentToArticle } = require("./controllers/comments-controller.js")
const app = express()

//Needed to parse request body
app.use(express.json())

//Get requests
app.get("/api", getAllEndpoints)
app.get("/api/topics", getAllTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

//Post requests
app.post("/api/articles/:article_id/comments", postCommentToArticle)

//Error handling
app.use(invalidEndpoint)
app.use(sqlErrors)
app.use(customErrors)
app.use(internalServerError)

module.exports = app