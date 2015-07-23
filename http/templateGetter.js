/**
 * Created by patrickliu on 15/6/24.
 */

var templateHelper = require('../lib/templateHelper'),
    templateRoot = require('../conf/config').templateRoot,
    config = require('../conf/config'),
    extName = config.extName,
    log = require('../lib/log'),
    fs = require('fs'),
    artTemplate = require('../lib/artTemplate'),
    path = require('path');

// helper to get url's template path
var helper = new templateHelper(config);

var filename = path.basename(__filename);

// 获取template的接口
var templateGetter = function* (next) {
    var req = this.request,
        res = this.response,
        reqPath = req.path;

    // get matchedUrl from helper
    var matchedUrl = helper.match(reqPath);

    // by default matchedUrl is an absolute url, like /hmtl/product/detail
    // if it's not an absolute url
    // there must be something wrong
    if(!path.isAbsolute(matchedUrl)) {

        log.error('[%s] matchedUrl is %s, such kind of url is not allowed.', filename, matchedUrl);
        this.throw('500', 'no such template');
        return;
    }

    // final template url
    var templatePath = path.join(templateRoot, matchedUrl + extName);

    templatePath = path.normalize(templatePath);

    try {

        log.info('[%s] read template from %s', filename, templatePath);

        var templateContent = artTemplate(templatePath);
        req.templateContent = templateContent;


    } catch(e) {

        log.error('[%s] templatePath is %s, error is %s.', filename, templatePath, e.message);
        this.throw('500', 'no such template');
    }

    yield next;
};

module.exports = templateGetter;
