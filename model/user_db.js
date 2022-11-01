// 引入MySQL数据库
const mysql = require("mysql");

// 连接数据库
const connect = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "123456",
	database: "users",
	dateStrings: true,
});

// 暴露connect出去
module.exports = connect;
