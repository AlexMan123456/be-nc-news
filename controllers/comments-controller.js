const { fetchArticleById } = require("../models/articles-model")
const { fetchCommentsByArticleId, uploadCommentToArticle, removeComment, incrementCommentVoteCount } = require("../models/comments-model")

function getCommentsByArticleId(request, response, next){
    Promise.all([fetchCommentsByArticleId(request.params.article_id), fetchArticleById(request.params.article_id)])
    .then(([comments, article]) => {
        response.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

function postCommentToArticle(request, response, next){
    uploadCommentToArticle(request.body, request.params.article_id)
    .then((comment) => {
        response.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}

function deleteComment(request, response, next){
    removeComment(request.params.comment_id).then(() => {
        response.status(204).send({})
    }).catch((err) => {
        next(err)
    })
}

function patchCommentVoteCount(request, response, next){
    incrementCommentVoteCount(request.body.inc_votes, request.params.comment_id).then((updatedComment) => {
        response.status(200).send({updatedComment})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getCommentsByArticleId, postCommentToArticle, deleteComment, patchCommentVoteCount }