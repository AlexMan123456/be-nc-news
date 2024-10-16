const db = require("../db/connection.js")

function fetchAllUsers(){
    return db.query("SELECT * FROM users").then((data) => {
        return data.rows
    })
}

function fetchUserByUsername(username){
    return db.query("SELECT * FROM users WHERE username = $1", [username]).then((data) => {
        if(data.rows.length === 0){
            return Promise.reject({status: 404, message: "User not found"})
        }
        return data.rows[0]
    })
}

module.exports = { fetchAllUsers, fetchUserByUsername }