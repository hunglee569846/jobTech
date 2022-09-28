const config = require('../config/env/local')
const {Pool} = require('pg')
const pgPool = new Pool(config.pg)
const logger = require('../lib/logger')(module);
const isJSON = require('../lib/isJSON');

pgPool.on("error",function(err){
    logger.error("[pgPool] ide client error");
    logger.error(err.stack || err.message || err)
});

function _query(sql, params = []){
    return new Promise((resolve, reject) =>{
        pgPool.connect((err, client, release)=>{
            logger.debug('sql : '+ sql);
            logger.debug('sql params : ' + JSON.stringify(params)?.substring(0, 1000));
            if (err) {
                logger.error('Error acquiring client : ' + err.stack);
                reject(err)
                return
            }
            try {
                let startTime = new Date().getTime();
                client.query(sql, params,(err,result)=>{
                    let queryTime = new Date().getTime() - startTime;
                    // if (queryTime >= 3000) {
                    //     sendMonitoringMessage({
                    //         severity: 'Warning',
                    //         module: 'authen',
                    //         query: sql,
                    //         queryTime: `${que / 1000}`
                    //     }, 'pg')
                    // }
                    logger.debug('sql time: '+ queryTime)
                    release()
                    if (err) {
                        logger.error('Error excuting query: '+ err.stack)
                        reject(err)
                        return
                    }
                    resolve(result)
                })
            } catch (err) {
                logger.error("pg query error message: ", err);
                logger.error("pg query error queryText: ", sql);
                logger.error("pg query error params: ", params);
                release();
                reject(err);
            }
        })
    })   
}

// function isJSON(data){
//     try {
//         let json = JSON.parse(data);
//         return (typeof json === 'object')
//     } catch (error) {
//         return false;
//     }
// }

module.exports = {
    query: _query,

}