const { fetchAllTopics, createTopic } = require("../models/topics-model")


function getAllTopics(request, response, next){
    fetchAllTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

function postTopic(request, response, next){
    createTopic(request.body).then((newTopic) => {
        response.status(201).send({newTopic})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAllTopics, postTopic }