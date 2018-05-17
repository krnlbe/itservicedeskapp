"use strict";

module.exports = {
	getUserIssues: getUserIssues
};

let config = require("../config");
let utils = require("./utils");

let DEBUG = utils.DEBUG; 
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function getUserIssues(response, username, callback) {
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

			query = "SELECT Issue.idIssue, Issue.summary, Issue.priority FROM User, Issue" + 
					" WHERE User.username = '" + username + "' AND (Issue.reporter = User.id OR Issue.assignee = User.id) ORDER BY Issue.created DESC limit 6;";
			con.query(query, function (err, result1, fields) {
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					if(!utils.isEmpty(result1)) {
						let userIssues = [];
						for(let i = 0; i < result1.length; i++) {
							userIssues.push({idIssue: result1[i].idIssue, summary: result1[i].summary, priority: result1[i].priority});
						}	

						query = "SELECT Issue.idIssue, Issue.summary, Issue.priority, Issue.reporter FROM Issue ORDER BY Issue.created DESC limit 6;";
						con.query(query, function (err, result2, fields) {
							if (err) { 
								DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
								utils.serveError(response);
							} else {
								if(!utils.isEmpty(result2)) {
									let allIssues = [];
									for(let i = 0; i < result2.length; i++) {
										allIssues.push({idIssue: result2[i].idIssue, summary: result2[i].summary, priority: result2[i].priority, reporter: result2[i].reporter});
									}

									query = "SELECT Issue.status, COUNT(Issue.status) AS numbers FROM Issue GROUP BY Issue.status;";
									con.query(query, function (err, result3, fields) {
										if (err) { 
											DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
											utils.serveError(response);
										} else {
											if(!utils.isEmpty(result3)) {
												let issuesStatus = [];
												for(let i = 0; i < result3.length; i++) {
													issuesStatus.push({status: result3[i].status, numbers: result3[i].numbers});
												}

												query = "SELECT Issue.priority, COUNT(Issue.priority) AS numbers FROM Issue GROUP BY Issue.priority;";
												con.query(query, function (err, result4, fields) {
													if (err) { 
														DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
														utils.serveError(response);
													} else {
														if(!utils.isEmpty(result4)) {
															let issuesPriority = [];
															for(let i = 0; i < result4.length; i++) {
																issuesPriority.push({priority: result4[i].priority, numbers: result4[i].numbers});
															}

															let sqlData = {
																userIssues: userIssues,
																allIssues: allIssues,
																issuesStatus: issuesStatus,
																issuesPriority: issuesPriority
															}

															callback(sqlData);
														}
													}
												});
											}
										}
									});
								}
							}
						});
					}
				}
			});
		}
	});
}
