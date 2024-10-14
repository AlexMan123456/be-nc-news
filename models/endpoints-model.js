const fs = require("fs/promises")

function retrieveAllEndpoints(){
    return fs.readFile(`./endpoints.json`, "utf-8").then((fileContents) => {
        const endpoints = JSON.parse(fileContents)
        return endpoints
    })
}

module.exports = { retrieveAllEndpoints }