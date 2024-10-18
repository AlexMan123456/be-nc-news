const express = require("express")
const { getArticles, getArticleById, patchArticleVoteCount, postNewArticle, deleteArticle } = require("../controllers/articles-controller")
const { getCommentsByArticleId, postCommentToArticle } = require("../controllers/comments-controller")
const router = express.Router()

router.route("/")
.get(getArticles)
.post(postNewArticle)

router.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentToArticle)

router.route("/:article_id")
.get(getArticleById)
.patch(patchArticleVoteCount)
.delete(deleteArticle)

module.exports = router