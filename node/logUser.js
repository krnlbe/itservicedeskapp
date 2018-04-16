"use strict";

module.exports = {
	logUser: logUser
};

let config = require("../config");
let utils = require("./utils");
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
		con.query("SELECT id, username, password FROM User WHERE username = '" + username + "'", function (err, result, fields) {
			let res = false;
			if (err) { 
				throw err;
			}

			if(!utils.isEmpty(result)) {
				res = (result[0].password.localeCompare(md5(passwd)) == 0);

				if(res) {
					con.query("UPDATE User SET lastLogin=NOW() WHERE id=" + result[0].id + ";", function(err, result, fields) {
						if(err) {
							throw err;
						}

						console.log('Updated "lastLogin" for user ' + result[0].username + '!');
					});
				}
			}

			callback(res);
		});
	});
}