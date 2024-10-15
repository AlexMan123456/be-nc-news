const db = require("../db/connection.js")

function fetchAllUsers(){
    return db.query("SELECT * FROM users").then((data) => {
        return data.rows
    })
}

module.exports = {fetchAllUsers}