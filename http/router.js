/**
 * Created by patrickliu on 15/6/30.
 */

var koa_router = require('koa-router')(),
    router = {},
    querystring = require('querystring');

router.getNativeTemplate = function* (next) {
    var req = this.request;

    // 将req.path的/template去掉
    req.nativeTemplate = req.path.slice('template'.length + 1);

    yield next;
};

// starts with /template, directly return the template file without get the data
koa_router.get(/^\/template\/*?/, router.getNativeTemplate);

router.getNativeHTML = function* (next) {
    var req = this.request;

    req.nativeTemplate = req.path;

    yield next;
};

koa_router.get(/^.*\.html/, router.getNativeHTML);


// others match here
koa_router.get(/^.*$/, function* (next) {

    var req = this.request,
        querystringObj = querystring.parse(req.querystring);

    // if ?nodata=1 is passed, we set this to req.data = true
    if(querystringObj && querystringObj['nodata'] == 1) {

        req.nodata = true;
    }

    yield next;
});

module.exports = koa_router;
