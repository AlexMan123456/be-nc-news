const db = require("../db/connection.js")

function fetchCommentsByArticleId(articleId, limit=10, pageNumber=1){
    const offset = ((pageNumber-1)*limit)

    return db.query(`SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3`,
    [articleId, limit, offset])
        .then((data) => {
            return data.rows
        })
}

function uploadCommentToArticle(comment, articleId){
    if(comment.body === ""){
        return Promise.reject({status: 400, message: "Comment body must not be empty"})
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

function removeComment(commentId){
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [commentId]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Comment not found"})
        }
    })
}

function incrementCommentVoteCount(newVote, commentId){
    return db.query("UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING *", [newVote, commentId])
    .then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "Comment not found"})
        }
        return data.rows[0]
    })
}

module.exports = { fetchCommentsByArticleId, uploadCommentToArticle, removeComment, incrementCommentVoteCount }