const { retrieveAllEndpoints } = require("../models/endpoints-model")

function getAllEndpoints(request, response, next){
    retrieveAllEndpoints().then((endpoints) => {
        response.status(200).send({endpoints})
    }).catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports = { getAllEndpoints }