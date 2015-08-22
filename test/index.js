/**
 * Created by patrickliu on 15/7/1.
 */

var app = require('../index'),
    statuses = require('statuses'),
    querystring = require('querystring'),
    koaApp = require('koa')();

statuses['608'] = 'fetch data error';


// listen events
koaApp.on('app_start', function() {
    console.log('app started');
});

// 错误处理, 以及返回值定制
koaApp
    .use(function* (next) {

        var req = this.request;

        try {

            // 处理一下请求

            // override the referer
            req.header.referer = req.path;
            // req.path 移掉前面的/:area/m等
            var pathArr = req.path.split('/');
            pathArr.shift(); // ''
            pathArr.shift(); // :area
            pathArr.shift(); // m
            pathArr.unshift(''); // push ''
            req.path = pathArr.join('/');

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
    });



// 初始化app
app(

    koaApp,
    {
    config: {
        templateRoot: __dirname + "/views"
    }

}).listen(11506);


