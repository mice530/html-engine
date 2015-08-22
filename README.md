# html-engine
An html middleware between browser and web-backend.

use `cnpm install @froad/html-hengine` to install html-engine.

> We have build a company npm in our company with @froad as a prefix. So @froad/* is a private npm package hosted in
our own npm server.
Use `npm config set registry http://10.43.1.203:11504` to access our own npm server.

# Design Docs
see [design docs](DESIGN.md?raw=true);

# Usage
上面设计文档当中大致讲了html-engine的设计思路，这一节我们就专门讲html-engine的使用方法。

1. html-engine支持的路由种类:
    1) /template, 获取目录下的template文件，以text/html的content-type返回，供用户调用。

    ![templateSequence](images/templateSequence.png?raw=true)

    2) 以html结尾，也将返回对应的纯html文件（未经任何处理)。

    ![htmlSequence](images/htmlSequence.png?raw=true)

    3) 正常请求，将同时去后台拉取json数据，和模板进行合并。

    ![normalSequence](images/normalSequence.png?raw=true)

    4) 正常请求，如果query当中带有nodata=1, 则省去向后台请求，而是在get参数作为替代后台data。

    ![nodataSequence](images/nodataSequence.png?raw=true)

2. 如果url形式和1中路由不符合，可以如test/index.js中所示，在koa中先使用一个中间件来保证传入path的正确性。

