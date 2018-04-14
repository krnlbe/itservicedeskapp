"use strict";

module.exports = {
	logUser: logUser
};

let config = require("../config");
let md5 = require("md5");

function logUser(username, passwd, callback) {
	let mysql = require('mysql');

	let con = mysql.createConnection({
		host: config.database.host,
		user: config.database.user,
		password: config.database.passwd,
		database: config.database.db
	});

	con.connect(function(err) {
		if (err) {
			throw err;
		}

		console.log("Connected to " + config.database.db + "!");
		con.query("SELECT username, password FROM User WHERE username = '" + username + "'", function (err, result, fields) {
			let res = false;
			if (err) { 
				throw err;
			}

			if(!isEmpty(result)) {
				res = (result[0].password.localeCompare(md5(passwd)) == 0);
			}

			callback(res);
		});
	});
}

function isEmpty(obj) {
  return !Object.keys(obj).length > 0;
}