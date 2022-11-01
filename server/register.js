const connect = require("../model/user_db");
var verificationCode = require("../server/getCode");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

module.exports = {
	// 加载jQuery资源
	loadJquery: function (req, res) {
		fs.readFile(path.join(__dirname, "../js/jquery-1.12.2.js"), "utf-8", (err, data) => {
			if (err) return console.log(err.message);
			res.end(data);
		});
	},
	// ==================上面是加载第三方资源库=============================
	// ==================下面是页面业务处理=================================
	// 渲染主页面
	renderIndex: function (req, res) {
		// 读取静态文件,res.sendXXX  是express模块的API，不要与原生混淆
		fs.readFile(path.join(__dirname, "../views/index.html"), "utf-8", (err, data) => {
			if (err) return res.end(`读取文件失败：${err}`);
			res.end(data);
		});
	},
	// 验证用户名
	checkUser: function (req, res, query) {
		// 获取客户端传过来的用户名
		const { name } = query;
		const sql = "select * from roles where userName = ?";
		connect.query(sql, name, (err, result) => {
			// console.log(result instanceof Array, result.length);
			if (err) {
				const obj = {
					code: 201,
					msg: `数据查询失败：${err}`,
					data: result,
				};
				return res.setHeader("content-type", "text/html;charset=utf-8").end(JSON.stringify(obj));
			} else if (result.length) {
				const obj = {
					code: 200,
					msg: `${name}用户名已被提前注册...`,
					data: result,
				};
				return res.setHeader("content-type", "text/html;charset=utf-8").end(JSON.stringify(obj));
			} else {
				const obj = {
					code: 200,
					msg: `${name}用户名可用...`,
					data: result,
				};
				return res.setHeader("content-type", "text/html;charset=utf-8").end(JSON.stringify(obj));
			}
		});
	},
	// 获取验证码
	getCode: function (req, res) {
		// 获取验证码
		const code = verificationCode();
		// 原生用post请求是一块块的接收数据，而express直接调用req.body+中间件编码即可
		var mobile = "";
		req.on("data", chunk => {
			mobile += chunk;
		});
		// end事件：当POST数据接收完毕时，触发
		req.on("end", function () {
			const index = mobile.indexOf("=");
			mobile = mobile.slice(index + 1);
			if (mobile && code) {
				const obj = {
					code: 200,
					msg: `${mobile}：获取验证码成功`,
					data: code,
				};
				setTimeout(() => {
					res.setHeader("content-type", "text/html;charset=utf-8").end(JSON.stringify(obj));
				}, 4000);
			} else {
				const obj = {
					code: 201,
					msg: `${mobile}：获取验证码失败`,
					data: code,
				};
				res.setHeader("content-type", "text/html;charset=utf-8").end(JSON.stringify(obj));
			}
		});
	},
	// 用户注册
	addUser: function (req, res) {
		let user = "";
		// 获取传过来的数据
		req.on("data", chunk => {
			user += chunk;
		});
		req.on("end", () => {
			// querystring.parse(user)是将name=%E5%85%B3%E7%BE%BD&pass=147258369Lan%24&repass=147258369Lan%24&mobile=13012345678&code=45678格式
			// 数据转化为对象
			const userObj = querystring.parse(user);
			const { name, pass, mobile } = userObj;
			const sql = "insert into roles (userName,password,phone) values (?,?,?)";
			connect.query(sql, [name, pass, mobile], (err, result) => {
				if (err) return res.end(JSON.stringify({ code: 201, msg: `用户${name}注册失败：${err}` }));
				res.end(JSON.stringify({ code: 200, msg: `用户${name}注册成功` }));
			});
		});
	},
};
