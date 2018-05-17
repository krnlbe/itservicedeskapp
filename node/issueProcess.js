'use strict';

module.exports = {
	logIssue: logIssue,
	getIssue: getIssue,
	editIssue: editIssue,
	setAssignee: setAssignee,
	setStatus: setStatus,
	setComment: setComment
};

let config = require("../config");
let utils = require("./utils");

let DEBUG = utils.DEBUG;
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function logIssue(response, user, summary, description, severity, priority, attach, callback) {
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
			utils.serveError(response);
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
						summary = summary.replace(/'/g, "\\'");
						description = description.replace(/'/g, "\\'");

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
								utils.serveError(response);
								return;
							} else {
								DEBUG(TERSE, INFO, "Added new issue to DB!");
								res = true;
								callback(res);
							}
						});

					}
				}
			});
		}
	});
}

function getIssue(response, idIssue, callback) {
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

			query = "SELECT idIssue, summary, description, severity, priority, status, reporter, assignee, attach, " + 
					"DATE_FORMAT(created, '%a %D %b %Y %T') as created, DATE_FORMAT(updated, '%a %D %b %Y %T') as updated " + 
					"FROM Issue WHERE idIssue = " + idIssue + ";";
			con.query(query, function (err, result, fields) {
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					let issueData = {
						idIssue: result[0].idIssue, 
						summary: result[0].summary, 
						description: result[0].description,
						severity: result[0].severity,
						priority: result[0].priority, 
						status: result[0].status,
						attach: result[0].attach,
						created: result[0].created,
						updated: result[0].updated
					};

					let reporterId = result[0].reporter;
					let assigneeId = result[0].assignee;

					query = "SELECT firstname, lastname FROM User WHERE id = " + reporterId + ";";
					con.query(query, function (err, result1, fields) {
						if (err) { 
							DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
							utils.serveError(response);
						} else {
							let reporter = {
								firstname: result1[0].firstname, 
								lastname: result1[0].lastname
							};

							query = "SELECT firstname, lastname FROM User WHERE id = " + assigneeId + ";";
							con.query(query, function (err, result2, fields) {
								if (err) { 
									DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
									utils.serveError(response);
								} else {
									let assignee = {
										firstname: result2[0].firstname, 
										lastname: result2[0].lastname
									};

									query = "SELECT Comment.text AS text, DATE_FORMAT(Comment.date, '%Y-%b-%d %H:%i:%s') as date, CONCAT(User.firstname, ' ', User.lastname) AS user " +
											"FROM Comment, User " +
											"WHERE Comment.issue = " + idIssue + " AND User.id = Comment.user;";
									con.query(query, function (err, result3, fields) {
										if(err) {
											DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
											utils.serveError(response);
										} else {
											let commentData = [];
											for(let i = 0; i < result3.length; i++) {
												commentData.push({text: result3[i].text, date: result3[i].date, user: result3[i].user});
											}

											let sqlData = {
												issueData: issueData,
												reporter: reporter,
												assignee: assignee,
												commentData: commentData
											};

											callback(sqlData);
										}
									});
								}
							});
						}
					});					
				}
			});
		}
	});
}

function editIssue(response, idIssue, summary, description, severity, priority, attach, callback) {
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

			summary = summary.replace(/'/g, "\\'");
			description = description.replace(/'/g, "\\'");

			if(attach) {
				query = "UPDATE Issue SET summary = '" + summary + "', " +
										  "description = '" + description + "', " +
										  "severity = '" + severity + "', " +
										  "priority = '" + priority + "', " +
										  "attach = '" + attach + "', " +
										  "updated = NOW() " + 
									"WHERE idIssue = " + idIssue + ";"; 
			} else {
				query = "UPDATE Issue SET summary = '" + summary + "', " +
										  "description = '" + description + "', " +
										  "severity = '" + severity + "', " +
										  "priority = '" + priority + "', " +
										  "updated = NOW() " + 
									"WHERE idIssue = " + idIssue + ";"; 
			}

			let res = false;
			con.query(query, function(err, result, fields) {
				if(err) {
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					callback(res);
				} else {
					DEBUG(TERSE, INFO, "Updated issue in DB!");
					res = true;
					callback(res);
				}
			});
		}
	});
}

function setAssignee(response, assignee, idIssue, callback) {
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

			let res = false;
			query = "SELECT id, CONCAT(firstname, ' ', lastname) as assignee FROM User HAVING assignee = '" + assignee + "';";
			con.query(query, function(err, result, fields) {
				if(err) {
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					callback(res);
				} else {
					if(!utils.isEmpty(result)) {
						query = "UPDATE Issue SET assignee = " + result[0].id + " WHERE idIssue = " + idIssue + ";";
						con.query(query, function(err, result, fields) {
							if(err) {
								DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
								callback(res);
							} else {
								DEBUG(TERSE, INFO, "Updated issue in DB!");
								res = true;
								callback(res);
							}
						});
					} else {
						callback(res);
					}
				}
			});
		}
	});
}

function setStatus(response, nextStatus, idIssue, callback) {
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

			let status;
			if(nextStatus == 'IN PROGRESS') {
				status = 'IN PROGRESS';
			} else if (nextStatus == 'FIX') {
				status = 'FIXED';
			} else if (nextStatus == 'CLOSE') {
				status = 'CLOSED';
			} else if (nextStatus == 'REOPEN') {
				status = 'OPEN';
			}

			let res = false;
			query = "UPDATE Issue SET status = '" + status + "' WHERE idIssue = " + idIssue + ";";
			con.query(query, function(err, result, fields) {
				if(err) {
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					callback(res);
				} else {
					DEBUG(TERSE, INFO, "Updated issue in DB!");
					res = true;
					callback(res);
				}
			});
		}
	});
}

function setComment(response, username, idIssue, commentText, callback) {
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

			query = "SELECT id, firstname, lastname FROM User WHERE username = '" + username + "';";
			con.query(query, function(err, result, fields) {
				if(err) {
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					if(!utils.isEmpty(result)) {
						let idUser = result[0].id;
						let firstname = result[0].firstname;
						let lastname = result[0].lastname;

						let currentTime = new Date();
						let timestampForDB = currentTime.getFullYear() + "-" + 
											 (currentTime.getMonth() < 10 ? '0' + (currentTime.getMonth() + 1) : (currentTime.getMonth() + 1)) + "-" + 
											 currentTime.getDate() + " " +
											 currentTime.getHours() + ":" + 
											 currentTime.getMinutes() + ":" + 
											 (currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds());						

						query = "INSERT INTO Comment (text, issue, user, date) VALUES ('" +
								commentText + "', " + idIssue + ", " + idUser + ", '" + timestampForDB + "');";

						con.query(query, function(err, result, fields) {
							if(err) {
								DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
								utils.serveError(response);
							} else {
								let month = currentTime.toLocaleString("en", {month: "short"});
								let timestampForView = currentTime.getFullYear() + "-" + 
											 month + "-" + 
											 currentTime.getDate() + " " +
											 currentTime.getHours() + ":" + 
											 currentTime.getMinutes() + ":" + 
											 (currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds());
								let responseBody = {
									success: true,
									firstname: firstname,
									lastname: lastname,
									date: timestampForView
								}

								callback(JSON.stringify(responseBody));
							}
						});
					} else {
						DEBUG(TERSE, ERROR, "There is no user " + username);
						utils.serveError(response);
					}
				}
			});
		}
	});
}