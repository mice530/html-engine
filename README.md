# html-engine
An html middleware between browser and web-backend.

# Usage
1. `cnpm install @froad/html-hengine`

# HTML Engine 设计文档
-------------

**HTML Engine** 是基于nodejs的一套页面直出引擎。下面将通过以下几点来介绍基于HTML Engine的设计和优点。

1. [架构和流程图](#架构和流程图)。
2. [为什么要用HTML Engine](#为什么要用html-engine)。
3. [Q&A](#qa)


## 架构和流程图
![HTML Engine](images/htmlEngine.png?raw=true)

> 1. 用户打开页面。
> 2. nginx接入，将请求透传给htmlEngine nodejs后台。
> 3. htmlEngine加载本地模板文件，并向后台请求数据。
> 4. 后台将数据返回给htmlEngine。
> 5. htmlEngine将数据和模板进行拼接成完整的html, 并返回给nginx。
> 6. nginx将html文件返回给客户端。
> 7. 返回给用户的已经是一个有完整内容的html文件。不需要再次ajax请求动态内容。

----------

## 为什么要用HTML Engine
1. **看见首屏的速度更快**。
> 在HTML Engine中间层已经将动态内容生成html直出给客户端了，省去了多次ajax请求时间（多个RTT时间远大于HTML Engine中间层请求后台的时间，基本就是秒级优化到了毫秒级）。

2. **前后端完全解耦**。
> 后端只用关心数据层面，而不必关心页面view层逻辑和UI。

3. **解耦后，view层前端可做更多优化**
> view层前端维护之后，省掉了传统的套页面的沟通和维护成本。并且方便前端自动化构建以及细节优化（如缓存细化到文件级别)。

3. **和浏览器可以共享js 模板**
> nodejs的模板和浏览器可以无障碍完全共享（因为都是JS语言）。所以只用维护一套模板。减少出错率和降低维护成本。

4. **nodejs并发率高**
> Intel(R) Xeon(R) CPU E5-2620 v3 @ 2.40GHz 单核 1000并发，10000请求，QPS可达1800+。

## Q&A
1. 跟之前Java直出有什么区别？
> 1. 第4条，省去了维护多套模板。
> 2. 并且第2, 3条，由前端同学用熟悉的JS来写view直出，省掉了套页面的沟通成本，且方便后续的页面加载优化。

2. 和加载简易html页面，再通过ajax来动态加载首屏数据有什么区别？
> 1. 第1条，用户能更快看到首屏。HTML Engine做为中间层，内网请求一次后台数据花费在 **50ms** 以下。然后便可以给用户全量的首屏数据。而加载简易html再ajax请求。 一次ajax需要 **几百毫秒到几秒** 时间。并且对于移动端来说，因为网络不稳定，请求多了容易出现网络错误。

3. 这种模式有什么缺点吗？
> 给前端同学带来了新的运维压力。虽然同是js，但是基于服务端的程序，给前端同学带来了新的挑战，如之前很少关注的内存泄漏，优化unix参数等。

## more
更多前后端分离背景。
1. [Nicholas Zakas: nodejs and new web front end](http://www.nczonline.net/blog/2013/10/07/node-js-and-the-new-web-front-end/)
2. [美团全栈之路](http://mp.weixin.qq.com/s?__biz=MzAxNjAzMTQyMA==&mid=207597914&idx=1&sn=3496b37d4f080accaea18e96afef0dec&scene=5#rd)

