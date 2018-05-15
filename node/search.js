'use strict';

module.exports = {
	searchIssue: searchIssue,
	getUsers: getUsers
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
			utils.serveError(reponse);
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
			utils.serveError(reponse);
		} else {
			DEBUG(TERSE, INFO, "Connected to " + config.database.db + "!");

			query = "SELECT firstname, lastname FROM User;";
			con.query(query, function (err, result, fields) {
				let res = false;
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