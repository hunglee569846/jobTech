const common = require('../../config/common');

let config = {
    ...common,
    port: 5000,
    sessionTimeOut: 30,
    log:{
        dir: './log',
        loglevel: 'debug',
    },
    pg:{
        host: 'localhost',
        user: 'postgres',
        password: 'hung569846',
        port: 5432,
        database:'postgres',

        max: 10,
        idleTimeoutMillis: 30000,
        idle_in_transaction_session_timeout: 30000,
        connectionTimeoutMillis: 5000, // number of milliseconds before a statement in query will time out, default is not time out
        statement_timeout: 5000,// number of milliseconds before a query call will timeout, default is not time out
        query_timeout: 5000, //Select * frompg_stat --for checking conntion status
        application_name: "authen"
    }
}

module.exports = config;