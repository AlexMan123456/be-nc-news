const { fetchAllEndpoints } = require("../models/endpoints-model")

function getAllEndpoints(request, response, next){
    fetchAllEndpoints().then((endpoints) => {
        response.status(200).send({endpoints})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAllEndpoints }