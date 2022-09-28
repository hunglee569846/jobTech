function isJSON(str){
    try {
        JSON.parse(str);
    } catch (error) {
        return false;
    }
    return false;
}

module.exports = isJSON;