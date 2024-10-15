const { retrieveAllTopics } = require("../models/topics-model")


function getAllTopics(request, response, next){
    retrieveAllTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAllTopics }