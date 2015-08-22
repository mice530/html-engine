var koa = require('koa'),
    app = koa();


app.use(function* (next) {
    var req = this.request;
    console.log(req.path);
    console.log(req.header);
    this.body = { "success": true };
});

app.listen(11507);
