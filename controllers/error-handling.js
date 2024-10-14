function invalidEndpoint(request, response, next){
    response.status(404).send({message: "Invalid endpoint"})
}

function sqlErrors(err, request, response, next){
    if(err.code === "22P02"){
        response.status(400).send({message: "Bad request"})
    }
    next(err)
}

function customErrors(err, request, response, next){
    if(err.status && err.message){
        response.status(err.status).send({message: err.message})
    }
    next(err)
}

function internalServerError(err, request, response, next){
    response.status(500).send({message: "Internal server error"})
}


module.exports = { invalidEndpoint, internalServerError, sqlErrors, customErrors }