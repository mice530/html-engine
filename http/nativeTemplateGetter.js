/**
 * Created by patrickliu on 15/6/30.
 */

var fs = require('fs'),
    path = require('path'),
    templateHelper = require('../lib/templateHelper'),
    log = require('../lib/log'),
    config = require('../conf/config'),
    templateRoot = require('../conf/config').templateRoot,
    extName = config.extName;


var filename = path.basename(__filename);

// helper to get url's template path
var helper = new templateHelper(config);

var nativeTemplateGetter = function* (next) {

    var req = this.request,
        res = this.response;


    // if get native template === true
    if(typeof req.nativeTemplate !== 'undefined') {

        // slice /template/a.html -> /a.html
        var matchedUrl = helper.match(req.nativeTemplate);

        // by default matchedUrl is an absolute url, like /hmtl/product/detail
        // if it's not an absolute url
        // there must be something wrong
        if(!path.isAbsolute(matchedUrl)) {

            log.error('[%s] matchedUrl is %s, such kind of url is not allowed.', filename, matchedUrl);
            this.throw('500', 'no such template');
            return;
        }

        // final template url
        // if matchedUrl with extname return matchedUrl
        // /a/b/c.html -> /a/b/c.html
        // /a/b/c -> /a/b/c + '.html' -> /a/b/c.html
        var templatePath = path.join(templateRoot, path.extname(matchedUrl) === extName ? matchedUrl : (matchedUrl + extName));

        templatePath = path.normalize(templatePath);

        try {

            var fileContents = fs.readFileSync(templatePath, 'utf-8');
            this.body = fileContents;
            return;

        } catch(e) {
            log.error('[%s] read templatePath is %s, error is %s', filename, templatePath, e.message);
            this.throw('500', 'read templatePath error ' + templatePath);
        }
    } else {

        // else call next
        yield next;
    }
};

exports = module.exports = nativeTemplateGetter;
