const { fetchArticleById, fetchAllArticles, incrementArticleVoteCount } = require("../models/articles-model")

function getArticleById(request, response, next){
    fetchArticleById(request.params.article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

function getAllArticles(request, response, next){
    fetchAllArticles(request.query.sort_by, request.query.order, request.query.topic).then((articles) => {
        response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

function patchArticleVoteCount(request, response, next){
    incrementArticleVoteCount(request.body.inc_votes, request.params.article_id).then((updatedArticle) => {
        response.status(200).send({updatedArticle})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById, getAllArticles, patchArticleVoteCount }