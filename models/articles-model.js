const db = require("../db/connection.js")

function fetchArticleById(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Article not found"})
        }
        return data.rows[0]
    })
}

function fetchAllArticles(sortBy="created_at", order="DESC"){
    let queryString = `
    SELECT articles.*, COUNT(comments)::INT AS comment_count
    FROM articles LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id `

    const validSortByQueries = ["article_id", "author", "title", "topic", "created_at", "votes", "comment_count"]
    if(validSortByQueries.includes(sortBy) === false){
        return Promise.reject({status: 400, message: "Bad request"})
    }
    
    const validOrderQueries = ["ASC", "DESC"]
    if(validOrderQueries.includes(order.toUpperCase()) === false){
        return Promise.reject({status: 400, message: "Bad request"})
    }
    
    if(sortBy === "comment_count"){
        queryString = queryString + `ORDER BY comment_count ${order}`
    } else{
        queryString = queryString + `ORDER BY articles.${sortBy} ${order}`
    }

    return db.query(queryString)
        .then((data) => {
            data.rows.forEach((article) => {
                delete article.body
            })
            return data.rows
        })
}

function incrementVoteCount(newVote, articleId){
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

module.exports = { fetchArticleById, fetchAllArticles, incrementVoteCount }