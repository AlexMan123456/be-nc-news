const express = require("express")
const { getAllArticles, getArticleById, patchArticleVoteCount, postNewArticle } = require("../controllers/articles-controller")
const { getCommentsByArticleId, postCommentToArticle } = require("../controllers/comments-controller")
const router = express.Router()

router.route("/")
.get(getAllArticles)
.post(postNewArticle)

router.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentToArticle)

router.route("/:article_id")
.get(getArticleById)
.patch(patchArticleVoteCount)

module.exports = router