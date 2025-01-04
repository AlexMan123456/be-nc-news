const db = require("../db/connection.js")

function fetchArticleById(articleId){
    return db.query(
        `SELECT articles.*, COUNT(comments)::INT AS comment_count
        FROM articles LEFT JOIN comments
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [articleId])
        .then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Article not found"})
        }
        return data.rows[0]
    })
}

function fetchArticles(sortBy="created_at", order="DESC", topic, author, limit=10, pageNumber=1){
    let queryString = `
    SELECT articles.*, COUNT(comments)::INT AS comment_count
    FROM articles LEFT JOIN comments 
    ON comments.article_id = articles.article_id `
    
    const queryValues = []
    if(topic){
        queryValues.push(topic)
        queryString = queryString + `WHERE topic=$${queryValues.length} `
    }

    if(author){
        queryValues.push(author)
        queryString = queryString + `${topic ? "AND" : "WHERE"} articles.author=$${queryValues.length} `
    }

    queryString = queryString + "GROUP BY articles.article_id "

    const validSortByQueries = ["article_id", "author", "title", "topic", "created_at", "votes", "comment_count"]
    if(validSortByQueries.includes(sortBy) === false){
        return Promise.reject({status: 400, message: "Bad request"})
    }
    
    const validOrderQueries = ["ASC", "DESC"]
    if(validOrderQueries.includes(order.toUpperCase()) === false){
        return Promise.reject({status: 400, message: "Bad request"})
    }
    
    if(sortBy === "comment_count"){
        queryString = queryString + `ORDER BY comment_count ${order} `
    } else{
        queryString = queryString + `ORDER BY articles.${sortBy} ${order} `
    }

    queryValues.push(limit)
    queryString = queryString + `LIMIT $${queryValues.length} `

    const offset = ((pageNumber-1)*limit)
    queryValues.push(offset)
    queryString = queryString + `OFFSET $${queryValues.length}`

    return db.query(queryString, queryValues).then((data) => {
        data.rows.forEach((article) => {
            delete article.body
        })
        return data.rows
    })
}

function incrementArticleVoteCount(newVote, articleId){
    return db.query(`
    UPDATE articles 
    SET votes = votes+$1 
    WHERE article_id = $2 
    RETURNING *`, [newVote, articleId])
    .then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status:404, message: "Article not found"})
        }
        return data.rows[0]
    })
}

function uploadNewArticle(newArticle){
    Object.keys(newArticle).forEach((key) => {
        const validColumns = ["author", "title", "body", "topic", "article_img_url"]
        if(validColumns.includes(key) === false){
            delete newArticle[key]
        }
    })
    let queryString = "INSERT INTO articles"

    if(Object.keys(newArticle).includes("article_img_url")){
        queryString = queryString + "(author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    } else{
        queryString = queryString + "(author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *"
    }

    return db.query(queryString, Object.values(newArticle))
    .then((data) => {
        data.rows[0].comment_count = 0
        return data.rows[0]
    })
}

function removeArticle(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Article not found"})
        }
        return db.query("DELETE FROM comments WHERE article_id = $1", [articleId])
    }).then(() => {
        return db.query("DELETE FROM articles WHERE article_id = $1 RETURNING *", [articleId])
    })
}

module.exports = { fetchArticleById, fetchArticles, incrementArticleVoteCount, uploadNewArticle, removeArticle }