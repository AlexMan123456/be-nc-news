const fs = require("fs/promises")

function fetchAllEndpoints(){
    return fs.readFile(`./endpoints.json`, "utf-8").then((fileContents) => {
        return JSON.parse(fileContents)
    })
}

module.exports = { fetchAllEndpoints }