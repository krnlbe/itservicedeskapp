"use strict";

module.exports = {
	signUp: signUp
};

let config = require("../config");
let utils = require("./utils");

function signUp(firstname, lastname, email, username, passwd, callback) {
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
		con.query("SELECT username, email FROM User WHERE username = '" + username + "' OR email = '" + email +"';", function (err, result, fields) {
			let res = false;
			if (err) { 
				throw err;
			}

			if(utils.isEmpty(result)) {
				let queryStatement = "INSERT INTO User (username, firstname, lastname, email, password, created, lastLogin) VALUES ('" 
										+ username + "', '" + firstname + "', '" + lastname + "', '" + email + "', md5('" + passwd + "'), NOW(), NOW());";  
				con.query(queryStatement, function (err, result, fields) {
					if(err) {
						throw err;
					}

					console.log("Added new user '" + username + "' to DB!");
				});

				res = true;
			} else {
				console.log("Tried to add new user '" + username + "', but the user is already stored in the DB!");
			}

			callback(res);
		});
	});
}