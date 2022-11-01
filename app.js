// 1. 引入模块
var http = require("http");
var urlModule = require("url");
const router = require("./router/router");

// 2. 创建服务器对象
var server = http.createServer();

// 3. 开启服务并监听端口
server.listen(3006, () => {
	console.log("the server is running at http://127.0.0.1:3006");
});

// 4.注册请求事件,监听请求
server.on("request", (req, res) => {
	router(req, res);
});
