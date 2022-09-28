const { createLogger, format, transports } = require("winston");
const fs = require('fs');
const rotate = require('winston-daily-rotate-file');

const {combine, timestamp, label, printf } = format
const config = require('../config/env/local');

let baseDir = __dirname.replace(/lib$/,'')
let loglevel = config.log.loglevel

if(process.env.NODE_LOG_LEVEL){
    loglevel = process.env.NODE_LOG_LEVEL
}

if (!fs.existsSync(config.log.dir)) {
    fs.mkdirSync(config.log.dir);
}

const myFomat = printf(info =>{
    if (info.hasOwnProperty('uuid')) {
        return `${info.timestamp} [${info.label}][log ID : ${info.uuid}] ${info.level}: ${info.message}`;
    }else{
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }
});

let getLabel = function(callingModule){
    return callingModule.filename.replace(baseDir,'');
}

module.exports = function (callingModule) {
    let logger = createLogger({
        format: combine(
            label({label: getLabel(callingModule)}),
            timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            myFomat
        ),
        transports: [
            new transports.Console(),
            new rotate({
                level: 'error',
                filename: `${config.log.dir}/error.log`,
                timestamp: {format: 'YYYY-MM-DD HH:mm:ss'},
                zippedArchive: true,
                datePattern: 'YYYY-MM-DD',
                prepend: true,
            }),
        ],
        level: loglevel
    });
    return logger
}