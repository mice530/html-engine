/**
 * Created by patrickliu on 15/7/28.
 */


var koa_router = require('koa-router')(),
    sub_router = require('koa-router')(),
    app = require('koa')();

sub_router.get('/hehe', function* (next) {
    yield next;
});

sub_router.get(/.*?/)

koa_router.use('/haha', sub_router.routes());

app.use(koa_router.routes())
   .use(function* (next) {
    })
   .listen(8081);;
