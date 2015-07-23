/**
 * Created by patrickliu on 15/6/24.
 */

var fs = require('fs'),
    removeJsonComments = require('remove-json-comments');

// read log4js_configuration and convert to json object
var config = {};

try {
    config = JSON.parse(removeJsonComments(fs.readFileSync('conf/log4js_configuration.json', 'utf-8')));

} catch(e) {

}
module.exports = config;

exports.init = function(options) {

    return module.exports = extend(module.exports, options);
}
