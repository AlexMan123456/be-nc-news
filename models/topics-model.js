const db = require("../db/connection.js")

function fetchAllTopics(){
    return db.query("SELECT * FROM topics").then((data) => {
        return data.rows
    })
}

module.exports = { fetchAllTopics }