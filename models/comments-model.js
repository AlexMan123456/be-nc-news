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

module.exports = { fetchCommentByArticleId }