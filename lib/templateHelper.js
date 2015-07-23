/**
 * templateHelper.js
 * 获取url匹配的template
 */
var glob = require('glob'),
    path = require('path'),
    extend = require('extend'),
    fs = require('fs'),
    log = require('./log'),
    node_url = require('url'),
    removeJsonComments = require('remove-json-comments');

var defaults = {
    templateConfig: 'conf/template/**/*.json'
};

var filename = path.basename(__filename);

var REGEXP_IS_EQUAL_PREFIX = /^=/;

var Helper = function(options) {

    this.init(options);
};

Helper.prototype.init = function(options) {

    this.defaults = extend(defaults, options);

    // 读入json,并根据优先级放入不同的队列当中
    this.sortedLocation = this.sortJsonArr(this.readTemplateJson());

};

// 获取所有的config json文件
Helper.prototype.glob = function() {

    return glob.sync(this.defaults.templateConfig);

};

Helper.prototype.readTemplateJson = function() {
    var jsonPathArr = this.glob(),
        jsonArr = [];

    // push json object to jsonArr
    jsonPathArr.forEach(function(jsonPath) {
        try {
            jsonArr.push(JSON.parse(removeJsonComments(fs.readFileSync(jsonPath, 'utf-8'))));
        } catch(e) {
            log.error('[%s] readTemplateJson error with %s', filename, e.message);
        }
    });

    return jsonArr;
};

// 根据jsonArr的格式, 进行分组
Helper.prototype.sortJsonArr = function(jsonArr) {
    // 全等模式  =/a/b/c 仅和 /a/b/c 匹配
    var totallyEqual = {},
        // 正则匹配
        // 最长匹配
        regexEqual = {};

    jsonArr.forEach(function(json) {
        for(var i in json) {
            if(i.match(REGEXP_IS_EQUAL_PREFIX)) {
                totallyEqual[i] = json[i];
            } else {
                regexEqual[i] = json[i];
            }
        }
    });


    // totallyEqual && regexEqual are all set
    return {
        totallyEqual: totallyEqual,
        regexEqual: regexEqual
    }
};


// 匹配url对应的template url
Helper.prototype.match = function(url) {

    var sortedLocationObj = this.sortedLocation,
        // 全匹配
        totallyEqual = sortedLocationObj.totallyEqual,

        // 正则匹配
        regexEqual = sortedLocationObj.regexEqual,
        matched = '',
        done = false;


    for(var i in totallyEqual) {
        var regexpstr = i.replace(/[\/\\]/g, function($1) { return '\\' + $1; });

        if(new RegExp('^' + regexpstr + '$').test('=' + url)) {
            matched = totallyEqual[i];
            done = true;
            break;
        }
    }

    // 如果还没有搜到
    if(!done) {
        // 获取匹配长度最长的那一个
        var longest = 0;
        for(var i in regexEqual) {
            var regexpstr = i.replace(/[\/\\]/g, function($1) { return $1 + $1; }),
                matchedArr = new RegExp(regexpstr).exec(i);

            if(matchedArr && matchedArr.length !== 0) {
                if(matchedArr[0].length > longest) {
                    longest = matchedArr[0].length;
                    matched = regexEqual[i];
                    done = true;
                }
            }
        }
    }

    // 如果还没有找到
    // return pathname by default
    if(!done) {
        var parsedUrl = node_url.parse(url);
        matched = parsedUrl.pathname;
    }

    return matched;
};

exports = module.exports = Helper;
