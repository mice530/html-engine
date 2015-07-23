'use strict'

var koa = require('koa'),
    path = require('path'),
    statuses = require('statuses'),
    extend = require('extend'),
    querystring = require('querystring'),
    Emitter = require('../lib/EventEmitter');

var filename = path.basename(__filename);

statuses['608'] = 'fetch data error';

module.exports = function(options) {

    var templateGetter = require('./templateGetter'),
        dataGetter = require('./dataGetter'),
        nativeTemplateGetter = require('./nativeTemplateGetter'),
        mixed = require('./mixed'),
        app = koa(),
        config = extend(require('../conf/config'), options),
        log = require('../lib/log'),
        koa_router = require('./router');


    log.info('[%s] server started, listening to %s', filename, config.port);

    Emitter.emit('app_start');

    // report 启动次数
    /*
    monitor.send({
        attr_id: 'b207',
        value: 1,
        type: 'int'
    });
    */

    app
        .use(function* (next) {

            var req = this.request;

            try {
                yield next;

            } catch(e) {

                this.status = e.status || 500;

                var querystringObj = querystring.parse(req.querystring);

                // 和浏览器调用约定好了，如果有isAjax的get字段，则返回json数据
                if(typeof querystringObj['isAjax'] !== 'undefined') {

                    try {

                        this.body = JSON.parse(e.message);

                    } catch(e) {

                        // production环境返回Internal server error
                        if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV === 'production') {

                            // 给前端浏览器返回一个错误值
                            this.body = { message: 'Internal server error' };

                        } else {
                            // 否则返回错误堆栈, 以防泄漏太多信息
                            this.body = { message: e.message + ' stack is ' + e.stack };
                        }
                    }

                } else {

                    // 如果没有isAjax字段，属于页面直接打开型，返回的是text/plain

                    // convert all none 404/500 to 500
                    (this.status === 404 || this.status === 500) || (this.status = 500);

                    // production环境返回Internal server error
                    if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV === 'production') {

                        this.body = 'Internal server error';

                    } else {
                        // 否则返回错误堆栈
                        this.body = e.message + ' stack is ' + e.stack;
                    }

                }

                this.app.emit('error', e, this);
            }
        })
        .use(koa_router.routes())
        // if /template is requested, we directly return the native template
        .use(nativeTemplateGetter)
        // get template
        .use(templateGetter)
        // get data from backend
        .use(dataGetter)
        // mix them together
        .use(mixed);

    app.listen(config.port);
};
