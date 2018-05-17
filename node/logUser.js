"use strict";

module.exports = {
	logUser: logUser,
	logoutUser: logout
};

let config = require("../config");
let utils = require("./utils");
let md5 = require("md5");

let DEBUG = utils.DEBUG;
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function logUser(response, username, passwd, callback) {
	let mysql = require('mysql');
	let query;

	let con = mysql.createConnection({
		host: config.database.host,
		user: config.database.user,
		password: config.database.passwd,
		database: config.database.db
	});

	con.connect(function(err) {
		if (err) {
			DEBUG(TERSE, ERROR, "Could not conect to DB. Here's the connection info: " + config.database);
			utils.serveError(response);
		} else {
			DEBUG(TERSE, INFO, "Connected to " + config.database.db + "!");

			query = "SELECT id, username, password FROM User WHERE username = '" + username + "'";
			con.query(query, function (err, result, fields) {
				let res = false;
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					if(!utils.isEmpty(result)) {
						res = (result[0].password.localeCompare(md5(passwd)) == 0);

						if(res) {
							query = "UPDATE User SET lastLogin=NOW() WHERE id=" + result[0].id + ";";
							con.query(query, function(err, result, fields) {
								if(err) {
									DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
									utils.serveError(response);
								} else {
									DEBUG(TERSE, INFO, 'User "' + username + '" has been logged into the App!');
									DEBUG(TERSE, INFO, 'Updated "lastLogin" for user "' + username + '"!');
								}
							});
						}
					}

					callback(res);
				}
			});
		}
	});
}

function logout(request) {
	let username = request.session.username;
	request.session.destroy();
	DEBUG(TERSE, INFO, 'Session ended for user "' + username + '"!');
}