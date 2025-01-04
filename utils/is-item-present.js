function isPropertyPresent(array, property, itemtoFind){
    for(const currentItem of array){
        if(currentItem[property] === itemtoFind){
            return true
        }
    }
    return false
}

module.exports = isPropertyPresent