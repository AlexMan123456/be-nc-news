const db = require("../db/connection.js")

function fetchCommentsByArticleId(articleId){
    return db.query(
        `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`, [articleId])
        .then((data) => {
            return data.rows
        })
}

function uploadCommentToArticle(comment, articleId){
    if(Object.keys(comment).includes("username") === false){
        return Promise.reject({status: 400, message: "Request must contain username"})
    }
    if(Object.keys(comment).includes("body") === false){
        return Promise.reject({status: 400, message: "Request must contain body"})
    }
    return db.query(
        `INSERT INTO comments(body, article_id, author) VALUES
        ($1, $2, $3)
        RETURNING *`,
        [comment.body, articleId, comment.username]
    ).then((data) => {
        return data.rows[0]
    })
}

module.exports = { fetchCommentsByArticleId, uploadCommentToArticle }