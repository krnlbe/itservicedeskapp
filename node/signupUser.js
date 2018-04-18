"use strict";

module.exports = {
	signUp: signUp
};

let config = require("../config");
let utils = require("./utils");

let DEBUG = utils.DEBUG;
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function signUp(firstname, lastname, email, username, passwd, callback) {
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
			utils.serveError(reponse);
		} else {
			DEBUG(TERSE, INFO, "Connected to " + config.database.db + "!");

			query = "SELECT username, email FROM User WHERE username = '" + username + "' OR email = '" + email +"';";
			con.query(query, function (err, result, fields) {
				let res = false;
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(reponse);
				} else {
					if(utils.isEmpty(result)) {
						query = "INSERT INTO User (username, firstname, lastname, email, password, created, lastLogin) VALUES ('" 
												+ username + "', '" + firstname + "', '" + lastname + "', '" + email + "', md5('" + passwd + "'), NOW(), NOW());";  
						con.query(query, function (err, result, fields) {
							if(err) {
								DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
								utils.serveError(reponse);
							} else {
								DEBUG(TERSE, INFO, "Added new user '" + username + "' to DB!");
							}
						});

						res = true;
					} else {
						DEBUG(TERSE, INFO, "Tried to add new user '" + username + "', but the user is already stored in the DB!");
					}

					callback(res);
				}
			});
		}
	});
}