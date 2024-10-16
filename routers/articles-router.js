const express = require("express")
const { getAllArticles, getArticleById, patchArticleVoteCount } = require("../controllers/articles-controller")
const { getCommentsByArticleId, postCommentToArticle } = require("../controllers/comments-controller")
const router = express.Router()

router.get("/", getAllArticles)

router.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentToArticle)

router.route("/:article_id")
.get(getArticleById)
.patch(patchArticleVoteCount)

module.exports = router