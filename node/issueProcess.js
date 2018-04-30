'use strict';

module.exports = {
	logIssue: logIssue
};

let config = require("../config");
let utils = require("./utils");

let DEBUG = utils.DEBUG;
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function logIssue(user, summary, description, severity, priority, attach, callback) {
	let mysql = require('mysql');
	let query;
	let status = config.issueStatus.opened;

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

			query = "SELECT id FROM User WHERE username = '" + user + "'";
			con.query(query, function (err, result, fields) {
				let res = false;
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					if(!utils.isEmpty(result)) {
						let reporter = result[0].id;

						if(attach) {
							query = "INSERT INTO Issue (summary, description, severity, priority, reporter, assignee, status, attach, created, updated) VALUES ('"
										+ summary + "', '" + description + "', '" + severity + "', '" + priority + "', '" + reporter + "', '" 
										+ 1 + "', '" + status + "', '" + attach + "', NOW(), NOW());";
						} else {
							query = "INSERT INTO Issue (summary, description, severity, priority, reporter, assignee, status, attach, created, updated) VALUES ('"
										+ summary + "', '" + description + "', '" + severity + "', '" + priority + "', '" + reporter + "', '" 
										+ 1 + "', '" + status + "', 'NULL', NOW(), NOW());";
						}

						con.query(query, function(err, result, fields) {
							if(err) {
								DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
								utils.serveError(reponse);
								return;
							} else {
								DEBUG(TERSE, INFO, "Added new issue to DB!");
							}
						});

						res = true;
					}
				}

				callback(res);
			});
		}
	});
}