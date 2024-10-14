const { fetchCommentByArticleId } = require("../models/comments-model")

function getCommentsByArticleId(request, response, next){
    fetchCommentByArticleId(request.params.article_id).then((comments) => {
        response.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getCommentsByArticleId }