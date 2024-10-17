const db = require("../db/connection.js")

function fetchAllTopics(){
    return db.query("SELECT * FROM topics").then((data) => {
        return data.rows
    })
}

function createTopic(newTopic){
    const validKeys = ["description", "slug"]
    Object.keys(newTopic).forEach((key) => {
        if(validKeys.includes(key) === false){
            delete newTopic[key]
        }
    })
    return db.query("INSERT INTO topics(description, slug) VALUES ($1, $2) RETURNING *", Object.values(newTopic))
    .then((data) => {
        return data.rows[0]
    })
}

module.exports = { fetchAllTopics, createTopic }