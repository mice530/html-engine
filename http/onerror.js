// override error handler of koa
// enable debug mode
module.exports = function(err){
    if( 404 === err.status ) return;

    var msg = err.stack || err.toString();
    log.error(msg.replace(/^/gm, '  '));

    // debug mode
    this.status = err.status || 500;

    if( this.debug ){
        if( this.isJSON ){
            this.body = JSON.stringify({
                code: err.code,
                message: err.message,
                stack: err.stack
            });

            return;
        }

        // todo
        // use error template
        this.body = [
            'code:' + err.code,
            'message:' + err.message,
            'stack:' + err.stack.replace(/^/gm, '<br />')
        ].join('<br />');

        return;
    }
}