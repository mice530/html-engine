/**
 * Created by patrickliu on 15/6/24.
 */



var app = require('./http/app'),
    config = require('./conf/config'),
    log4jsConfig = require('./conf/log4js_configuration');

exports = module.exports = function(options) {

    // init conf/config
    if(options && options.config) {
        config.init(options.config);
    }

    // init log4js config
    if(options && options.log4jsConfig) {
        log4jsConfig.init(options.log4jsConfig);
    }

    app(options);
};

/*
exports({
    config: {
        templateRoot: __dirname + '/test/views/',
        backendHost: "http://localhost:11507/api",
        extName: '.html',
        port: 11506
    }
});
*/
