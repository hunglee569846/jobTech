let product_type = process.env.PRODUCT_TYPE ? process.env.PRODUCT_TYPE: "podo"
let config = require(`./${product_type}/env/${env()}`)

config.env = env

function env(){
    let NODE_SERVER_TYPE = process.env.NODE_SERVER_TYPE
    let env_string = "local"
    return env_string
}
module.exports = config;