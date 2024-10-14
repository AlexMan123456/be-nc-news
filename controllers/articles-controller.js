const { fetchArticleById, fetchAllArticles } = require("../models/articles-model")

function getArticleById(request, response, next){
    fetchArticleById(request.params.article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

function getAllArticles(request, response, next){
    fetchAllArticles().then((articles) => {
        response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById, getAllArticles }