const db = require("../db/connection.js")

function retrieveAllTopics(){
    return db.query("SELECT * FROM topics").then((data) => {
        return data.rows
    })
}

module.exports = { retrieveAllTopics }