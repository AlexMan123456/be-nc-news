const db = require("../db/connection.js")

function fetchArticleById(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Article not found"})
        }
        return data.rows[0]
    })
}

module.exports = { fetchArticleById }