function invalidEndpoint(request, response, next){
    response.status(404).send({message: "Invalid endpoint"})
}

function internalServerError(err, request, response, next){
    response.status(500).send({message: "Internal server error"})
}

module.exports = { invalidEndpoint, internalServerError }