'use strict'

var koa = require('koa'),
    path = require('path'),
    extend = require('extend'),
    querystring = require('querystring');

var filename = path.basename(__filename);


module.exports = function(app, options) {

    var templateGetter = require('./templateGetter'),
        dataGetter = require('./dataGetter'),
        nativeTemplateGetter = require('./nativeTemplateGetter'),
        mixed = require('./mixed'),
        config = extend(require('../conf/config'), options),
        log = require('../lib/log'),
        koa_router = require('./router');


    log.info('[%s] server started, listening to %s', filename, config.port);

    app.emit('app_start');

    // report 启动次数
    /*
    monitor.send({
        attr_id: 'b207',
        value: 1,
        type: 'int'
    });
    */

    app
        // routes for
        // 1. /template/a/b/c -> return native /a/b/c.html
        // 2. /a/b/c.html -> return native /a/b/c.html
        // 3. /a/b/c -> query backend with /a/b/c to get data and merge with /a/b/c.html
        .use(koa_router.routes())
        // if /template is requested, we directly return the native template
        .use(nativeTemplateGetter)
        // get template
        .use(templateGetter)
        // get data from backend
        .use(dataGetter)
        // mix them together
        .use(mixed);

    return app;
};
