/**
 * Created by patrickliu on 15/6/30.
 */

var koa_router = require('koa-router')(),
    router = {},
    querystring = require('querystring');

router.getNativeTemplate = function* (next) {
    var req = this.request,
        res = this.response;

    // /:area/m/template/a/b/c -> /a/b/c
    var pathArr = req.path.split('/');
    pathArr.shift(); // ''
    pathArr.shift(); // :area
    pathArr.shift(); // m
    pathArr.shift(); // template

    pathArr.unshift(''); // push ''

    req.path = req.nativeTemplate = pathArr.join('/');

    yield next;
};

koa_router.get(/^\/[^\/]*?\/m\/template/, router.getNativeTemplate);

router.getNativeHTML = function* (next) {
    var req = this.request,
        res = this.response;

    // /:area/m/a/b/c.html -> /a/b/c.html
    var pathArr = req.path.split('/');
    pathArr.shift(); // ''
    pathArr.shift(); // :area
    pathArr.shift(); // m

    pathArr.unshift(''); // push ''

    req.path = req.nativeTemplate = pathArr.join('/');

    yield next;
};

koa_router.get(/^\/[^\/]*?\/m\/.*?\.html/, router.getNativeHTML);

koa_router.get(/^\/[^\/]*?\/m\/.*?/, function* (next) {

    var req = this.request,
        res = this.response,
        querystringObj = querystring.parse(req.querystring);

    // if ?nodata=1 is passed, we set this to req.data = true
    if(querystringObj && querystringObj['nodata'] == 1) {

        req.nodata = true;

    }


    // /:area/m/a/b/c -> /a/b/c
    var pathArr = req.path.split('/');
    pathArr.shift(); // ''
    pathArr.shift(); // :area
    pathArr.shift(); // m
    pathArr.unshift(''); // push ''

    req.path = pathArr.join('/');

    yield next;
});

koa_router.get(/.*/, function* (next) {

    this.throw(500, 'error url');
});

module.exports = koa_router;
