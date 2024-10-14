const db = require("../db/connection.js")

function fetchCommentByArticleId(articleId){
    return db.query(
        `SELECT comments.* 
        FROM comments INNER JOIN articles 
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        ORDER BY comments.created_at DESC`, [articleId])
        .then((data) => {
            if(data.rows.length === 0){
                return Promise.reject({status: 404, message: "Article not found"})
            }
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

module.exports = { fetchCommentByArticleId, uploadCommentToArticle }