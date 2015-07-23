var fs = require('fs'),
    extend = require('extend'),
    removeJsonComments = require('remove-json-comments');


var defaults = {};

// read config.json, and parse to json object
var config = {};

try {
    config = JSON.parse(removeJsonComments(fs.readFileSync('conf/config.json', 'utf-8')));
} catch(e) {

}

exports = module.exports = extend(defaults, config);

exports.init = function(options) {

    return module.exports = extend(module.exports, options);

};