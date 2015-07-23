/**
 * Created by patrickliu on 15/6/24.
 */
var log = require('../lib/log'),
    Emitter = require('../lib/EventEmitter'),
    path = require('path');

var filename = path.basename(__filename);

var mixed = function* (next) {
    var request = this.request,
        response = this.response;

    var templateContent = request.templateContent,
        userData = request.userData;

    // something is wrong?
    if(!templateContent || !userData) {

        if(!templateContent) {

            /*
            // 上报templateContent没有值
            monitor.send({
                attr_id: 'b210',
                value: 1,
                type: 'int'
            });
            */

            Emitter.emit('no_template');

            log.error('[%s] templateContent is %s', filename, typeof templateContent);
        }

        if(!userData) {

            /*
            // 上报userData没有值
            monitor.send({
                attr_id: 'b210',
                value: 1,
                type: 'int'
            });
            */

            Emitter.emit('no_data');

            log.error('[%s] userData is %s', filename, typeof userData);
        }

        this.throw(500, 'error template or userdata.');
    }

    try {
        log.info('[%s] userData is %s, templateContent is %s ', filename, JSON.stringify(userData), templateContent.toString());
    } catch(e) {

    }

    try {

        this.body = templateContent({ data: userData });
        this.set({
            'Content-Type': 'text/html;charset=UTF-8'
        });

    } catch(e) {

        /*
        // 上报mixed error
        monitor.send({
            attr_id: 'b210',
            value: 1,
            type: 'int'
        });
        */

        Emitter.emit('mixed_error');

        log.error('[%s] template error with %s', filename, e.message);
        this.throw(500, 'template error ' + e.message);
    }

    yield next;
};

module.exports = mixed;
