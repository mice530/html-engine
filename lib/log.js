/**
 * Created by patrickliu on 15/5/12.
 */

var log4js = require('log4js'),
    fs = require('fs'),
    log4jsConfig = require('../conf/log4js_configuration'),
    isLocal = typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV === 'local';


var infoLogger,
    errorLogger;

// local不用log
if(!isLocal) {

    log4js.configure(log4jsConfig);
    infoLogger = log4js.getLogger('log');
    errorLogger = log4js.getLogger('error');
}



var logFun = ['trace', 'debug', 'log', 'info', 'warn', 'error', 'fatal'], log = {};

// add [%datetime] before every log
for(var i in logFun) {

    log[logFun[i]] = (function(i) {

        return function() {

            try {
                if(i >= 4) {

                    if(isLocal) {

                        console.error.apply(console.error, [].slice.apply(arguments));
                    } else {

                        errorLogger[logFun[i]].apply(errorLogger, [].slice.apply(arguments));
                    }
                    return;
                }

                if(isLocal) {

                    console.log.apply(console.log, [].slice.apply(arguments));

                } else {

                    infoLogger[logFun[i]].apply(infoLogger, [].slice.apply(arguments));
                }
            } catch(e) {

            }
        }
    })(i);
}

module.exports = log;
