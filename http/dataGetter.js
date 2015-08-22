/**
 * Created by patrickliu on 15/6/24.
 */
var log = require('../lib/log'),
    path = require('path'),
    url = require('url'),
    querystring = require('querystring'),
    request = require('request'),
    extend = require('extend'),
    backendHost = require('../conf/config').backendHost;

var filename = path.basename(__filename);

var TIME_OUT = 3000;

// 透传浏览器请求，重新获取新的后台数据
var dataGetter = function* (next) {

    var req = this.request,
        res = this.response,
        app = this.app;

    // if nodata is set,
    // we use the querystringObj as the user data directly
    if(typeof req.nodata !== 'undefined' && req.nodata === true) {

        req.userData = querystring.parse(req.querystring);

    } else {

        // must be json format
        var responseData = yield requestBackend(req, this),
            userData = {};

        try {
            userData = JSON.parse(responseData.body);

        } catch(e) {
            log.error('[%s] backend data is not json format', filename);

            /*
            // 上报not json format次数
            monitor.send({
                attr_id: 'b208',
                value: 1,
                type: 'int'
            });
            */

            app.emit('data_format_error');

            this.throw(500, 'data format error');
        }

        // save the userData
        req.userData = userData;
        res.set(responseData.response.headers);
    }

    yield next;
};


function requestBackend(userRequest, ctx) {

    var app = ctx.app;

    return new Promise(function(resolve, reject) {

        var requestedUrl = backendHost + userRequest.url;
        log.info('[%s] request %s ', filename, requestedUrl);
        log.info('[%s] request headers is %s ', filename, JSON.stringify(userRequest.header));
        log.info('[%s] request url is %s', filename, userRequest.href);

        request({
            url: requestedUrl,
            // 透传header
            // headers: extend(userRequest.header, { referer: userRequest.href,  memberCode: ctx.cookies.get('memberCode'), token: ctx.cookies.get('u_login_token') }),
            headers: userRequest.header,
            timeout: TIME_OUT
        }, function(err, response, body) {
            if(err) {

                /*
                // 上报请求后台错误
                monitor.send({
                    attr_id: 'b209',
                    value: 1,
                    type: 'int'
                });
                */

                app.emit('back_end_error');

                log.error('[%s] request backend failed with err %s, url is %s', filename, err.message, requestedUrl);
                reject(err);
                return;
            }

            if(response.statusCode === 200) {
                log.info('[%s] request backend success with data %s', filename, body);
                resolve({
                    body: body,
                    response: response
                });

            } else {

                /*
                // 上报请求后台错误
                monitor.send({
                    attr_id: 'b209',
                    value: 1,
                    type: 'int'
                });
                */

                app.emit('back_end_error');

                log.error('[%s] request error, statusCode is %d, url is %s, body is ', filename, response.statusCode, requestedUrl, body);

                var backendError = new Error(body);
                backendError.status = response.statusCode;
                reject(backendError);
            }
        });
    });
}


module.exports = dataGetter;

