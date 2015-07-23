/**
 * Created by patrickliu on 15/4/23.
 */


var artTemplate = require('ued-art-template').getNative(),
    templateHelper = require('template-helper'),
    extend = require('extend'),
    path = require('path'),
    log = require('./log'),
    config = require('../conf/config'),
    removeJsonComments = require('remove-json-comments'),
    fs = require('fs');

var filename = path.basename(__dirname);

// 默认将 extname 设置为 ‘’
artTemplate.config('extname', '');

// 默认artTemplate会缓存，设置为false, 让它不要缓存了
// local 环境不让缓存
//if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV === 'local') {

// 暂时都false
artTemplate.config('cache', false);
//}

templateHelper(artTemplate);

// load localsjson
var templateRoot = config.templateRoot;
// name of localsJson
var localsJsonName = 'locals.json';

// readJson
function readLocalsJson() {
    var crtEnv = process.env.NODE_ENV || 'production',
        JSONObject = {};
    // read locals.json file and parse to json object
    try {

        log.info('[%s] read json from %s env is %s', filename, templateRoot + '/' + localsJsonName, crtEnv);

        JSONObject = JSON.parse(
            removeJsonComments(
                fs.readFileSync(templateRoot + '/' + localsJsonName, 'utf-8')
            )
        );

    } catch(e) {

        JSONObject = {};
    }

    log.info('[%s] locals json value is %s, crtEnv is %s', filename, JSON.stringify(extend(JSONObject['common'] || {}, JSONObject[crtEnv] || {})), crtEnv);

    return extend(JSONObject['common'] || {}, JSONObject[crtEnv] || {});
}

artTemplate.helper('locals', readLocalsJson());

fs.watch(templateRoot + '/' + localsJsonName, function() {
    artTemplate.helper('locals', readLocalsJson());
});


// override the onerror function
var onError = artTemplate.onerror;
artTemplate.onerror = function(e) {

    var error;

    onError.apply(this, [].splice.apply(arguments));

    if(process.env.NODE_ENV !== 'producton') {

        error = new Error(e.message);
        error.status = 608;

    } else {

        error = new Error('Internal error from template');
        error.status = 500;
    }

    throw error;

}

module.exports = artTemplate;
