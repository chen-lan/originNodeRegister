const fs = require("fs");
const urlModule = require("url");
const register = require("../server/register");

module.exports = function (req, res) {
	// 获取提交方法  method
	const method = req.method;
	// 获取url提交路径地址
	// const url = req.url; 这样获取请求地址是会带参数的，而引入url模块处理请求地址只拿端口后面参数前面的地址
	const url = urlModule.parse(req.url, true); //此对象当中有两个常用属性，一个是pathname保存地址,一个是query保存参数
	// console.log(typeof url, url); //object类型
	const query = url.query; //对象形式
	const pathname = url.pathname;
	// console.log(query, pathname);
	// 渲染出默认的主页面
	if (method === "GET" && (pathname === "/" || pathname === "/index.html" || pathname === "/index")) {
		register.renderIndex(req, res);
	} else if (method === "GET" && pathname === "/validateName") {
		register.checkUser(req, res, query);
	} else if (method === "POST" && pathname === "/getCode") {
		register.getCode(req, res);
	} else if (method == "GET" && pathname === "/js/jquery-1.12.2.js") {
		register.loadJquery(req, res);
	} else if (method === "POST" && pathname === "/adduser") {
		register.addUser(req, res);
	} else {
		res.end("404");
	}
};
