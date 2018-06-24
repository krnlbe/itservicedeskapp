'use strict';

module.exports = {
	searchIssue: searchIssue,
	getUsers: getUsers,
	getAllIssues: getAllIssues,
	getMyIssues: getMyIssues,
	getReportedByMe: getReportedByMe
};

let config = require("../config");
let utils = require("./utils");

let DEBUG = utils.DEBUG;
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function searchIssue(response, idIssue, callback) {
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

			query = "SELECT * FROM Issue WHERE idIssue = " + idIssue + ";";
			con.query(query, function (err, result, fields) {
				let res = false;
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					if(!utils.isEmpty(result)) {
						callback(true);
					} else {
						callback(false);
					}
				}
			});
		}
	});
}

function getUsers(response, callback) {
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

			query = "SELECT firstname, lastname FROM User;";
			con.query(query, function (err, result, fields) {
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					if(!utils.isEmpty(result)) {
						let users = [];

						for(let i = 0; i < result.length; i++) {
							users.push({
								value: result[i].firstname + ' ' + result[i].lastname,
								data: 'any'
							});
						}	

						callback(users);
					} 
				}
			});
		}
	});
}

function getAllIssues(response, searchText, callback) {
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

			let whereClause = searchText == '' ? ";" : " WHERE Issue.summary LIKE '%" + searchText + "%' OR Issue.description LIKE '%" + searchText + "%';";
			
			query = "SELECT " +
							"Issue.idIssue, " + 
							"Issue.summary, " +
					        "(SELECT CONCAT(User.firstname, ' ', User.lastname) " +
							"FROM User " +
					        "WHERE User.id = Issue.assignee) AS assignee, " + 
					        "(SELECT CONCAT(User.firstname, ' ', User.lastname) " +
							"FROM User " +
					        "WHERE User.id = Issue.reporter) AS reporter, " +
					        "Issue.severity, " +
					        "Issue.priority, " +
					        "Issue.status, " +
					        "DATE_FORMAT(Issue.created, '%d-%b-%Y') AS created, " +
					        "DATE_FORMAT(Issue.updated, '%d-%b-%Y') AS updated " +
					"FROM Issue" +
					whereClause;
			
			con.query(query, function (err, result, fields) {
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					let issueData = [];

					for(let i = 0; i < result.length; i++) {
						issueData.push({
							idIssue: result[i].idIssue,
							summary: result[i].summary,
							assignee: result[i].assignee,
							reporter: result[i].reporter,
							severity: result[i].severity,
							priority: result[i].priority,
							status: result[i].status,
							created: result[i].created,
							updated: result[i].updated
						});
					}	

					callback(issueData);
				}
			});
		}
	});
}

function getMyIssues(response, username, callback) {
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

			query = "SELECT " +
							"Issue.idIssue, " + 
							"Issue.summary, " +
					        "(SELECT CONCAT(User.firstname, ' ', User.lastname) " +
							"FROM User " +
					        "WHERE User.id = Issue.assignee) AS assignee, " + 
					        "(SELECT CONCAT(User.firstname, ' ', User.lastname) " +
							"FROM User " +
					        "WHERE User.id = Issue.reporter) AS reporter, " +
					        "Issue.severity, " +
					        "Issue.priority, " +
					        "Issue.status, " +
					        "DATE_FORMAT(Issue.created, '%d-%b-%Y') AS created, " +
					        "DATE_FORMAT(Issue.updated, '%d-%b-%Y') AS updated " +
					"FROM Issue " +
					"INNER JOIN User ON Issue.reporter = User.id OR Issue.assignee = User.id " +
					"WHERE User.username = '" + username + "';";

			con.query(query, function (err, result, fields) {
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					let issueData = [];

					for(let i = 0; i < result.length; i++) {
						issueData.push({
							idIssue: result[i].idIssue,
							summary: result[i].summary,
							assignee: result[i].assignee,
							reporter: result[i].reporter,
							severity: result[i].severity,
							priority: result[i].priority,
							status: result[i].status,
							created: result[i].created,
							updated: result[i].updated
						});
					}	

					callback(issueData);
				}
			});	
		}
	});
}

function getReportedByMe(response, username, callback) {
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

			query = "SELECT " +
							"Issue.idIssue, " + 
							"Issue.summary, " +
					        "(SELECT CONCAT(User.firstname, ' ', User.lastname) " +
							"FROM User " +
					        "WHERE User.id = Issue.assignee) AS assignee, " + 
					        "(SELECT CONCAT(User.firstname, ' ', User.lastname) " +
							"FROM User " +
					        "WHERE User.id = Issue.reporter) AS reporter, " +
					        "Issue.severity, " +
					        "Issue.priority, " +
					        "Issue.status, " +
					        "DATE_FORMAT(Issue.created, '%d-%b-%Y') AS created, " +
					        "DATE_FORMAT(Issue.updated, '%d-%b-%Y') AS updated " +
					"FROM Issue " +
					"INNER JOIN User ON Issue.reporter = User.id " +
					"WHERE User.username = '" + username + "';";

			con.query(query, function (err, result, fields) {
				if (err) { 
					DEBUG(TERSE, ERROR, "Something went wrong with the DB connection. Here's the query: " + query);
					utils.serveError(response);
				} else {
					let issueData = [];

					for(let i = 0; i < result.length; i++) {
						issueData.push({
							idIssue: result[i].idIssue,
							summary: result[i].summary,
							assignee: result[i].assignee,
							reporter: result[i].reporter,
							severity: result[i].severity,
							priority: result[i].priority,
							status: result[i].status,
							created: result[i].created,
							updated: result[i].updated
						});
					}	

					callback(issueData);
				}
			});	
		}
	});
}