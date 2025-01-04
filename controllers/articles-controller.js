const { fetchArticleById, fetchArticles, incrementArticleVoteCount, uploadNewArticle, removeArticle } = require("../models/articles-model")
const { fetchAllTopics } = require("../models/topics-model")
const { fetchAllUsers, fetchUserByUsername } = require("../models/users-model")
const isPropertyPresent = require("../utils/is-item-present")

function getArticleById(request, response, next){
    fetchArticleById(request.params.article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

function getArticles(request, response, next){
    const {sort_by, order, topic, author, limit, p} = request.query
    const promises = [fetchArticles(sort_by, order, topic, author, limit, p)]
    if(topic){
        promises.push(fetchAllTopics())
    }
    if(author){
        promises.push(fetchUserByUsername(author))
    }
    Promise.all(promises).then((result) => {
        if(topic){
            const validTopic = isPropertyPresent(result[1], "slug", topic)
            if(validTopic === false){
                return Promise.reject({status: 404, message: "Topic not found"})
            }
        }

        response.status(200).send({articles: result[0], total_count: result[0].length})
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

function postNewArticle(request, response, next){
    uploadNewArticle(request.body).then((postedArticle) => {
        response.status(201).send({postedArticle})
    }).catch((err) => {
        next(err)
    })
}

function deleteArticle(request, response, next){
    removeArticle(request.params.article_id).then(() => {
        response.status(204).send({})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById, getArticles, patchArticleVoteCount, postNewArticle, deleteArticle }