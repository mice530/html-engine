#conf

##Usage
* global.json, 全局的设置
* 暂时只有下面几种格式
    * 里面的格式如 带＝号表式完全匹配。{ "=/home/index": "/home/index1"} // 将/home/index映射到/home/index1.html上
    * 里面的格式如 正则，取最长匹配 { "/home/index": "/home/index1", "/home/ind": "/home/index2" } // 将/home/index映射到/home/index1.html上

