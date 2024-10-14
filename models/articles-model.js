const db = require("../db/connection.js")

function fetchArticleById(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Article not found"})
        }
        return data.rows[0]
    })
}

function fetchAllArticles(){
    return db.query(
        `SELECT articles.*, COUNT(comments)::INT AS comment_count
        FROM articles LEFT JOIN comments 
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`)
        .then((data) => {
            data.rows.forEach((article) => {
                delete article.body
                article.comment_count = Number(article.comment_count)
            })
            return data.rows
        })
}

module.exports = { fetchArticleById, fetchAllArticles }