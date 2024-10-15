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
    return db.query(
        `INSERT INTO comments(body, article_id, author) VALUES
        ($1, $2, $3)
        RETURNING *`,
        [comment.body, articleId, comment.username]
    ).then((data) => {
        return data.rows[0]
    })
}

function removeComment(commentId){
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [commentId]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Comment not found"})
        }
    })
}

module.exports = { fetchCommentsByArticleId, uploadCommentToArticle, removeComment }