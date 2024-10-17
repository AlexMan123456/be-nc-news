const { fetchArticleById, fetchArticles, incrementArticleVoteCount, uploadNewArticle } = require("../models/articles-model")
const { fetchAllTopics } = require("../models/topics-model")

function getArticleById(request, response, next){
    fetchArticleById(request.params.article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

function getArticles(request, response, next){
    const topicName = request.query.topic
    const promises = [fetchArticles(request.query.sort_by, request.query.order, topicName, request.query.limit, request.query.p)]
    if(topicName){
        promises.push(fetchAllTopics())
    }
    Promise.all(promises).then((result) => {
        if(topicName){
            let validTopic = false
            for(const topic of result[1]){
                if(topic.slug === topicName){
                    validTopic = true
                    break
                }
            }
            if(validTopic === false){
                return Promise.reject({status: 404, message: "Not found"})
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

module.exports = { getArticleById, getArticles, patchArticleVoteCount, postNewArticle }