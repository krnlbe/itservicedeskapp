"use strict";

module.exports = {
	isEmpty: isEmpty,
	DEBUG: debug,
	serveError: serveError,
	servePage: servePage
};

let config = require('../config.js');
let dashboard = require('./dashboard');
let issueProcess = require('./issueProcess');
let search = require('./search');

let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

function isEmpty(obj) {
  return !Object.keys(obj).length > 0;
}

function debug(level, type, message) {
	if(config.debug && level <= config.debugVerbosity) {
		console.log(new Date() + ' ### ' + type + ' ### ' + message);
	}
}

function serveError(response) {
	response.status(500);
	response.render('pages/serverError');
	response.end();
}

function servePage(request, response, page) {
	let expSession = request.session;
	if(expSession.username) {
		debug(TERSE, INFO, 'Session available for "' + expSession.username + '". Sending page.');
		if(page == 'partials/dashboard') {
			dashboard.getUserIssues(response, request.session.username, function(result) {
				response.render(page, {
					userIssues: result.userIssues,
					allIssues: result.allIssues,
					issuesStatus: result.issuesStatus,
					issuesPriority: result.issuesPriority
				});
			});
		} else if(page == 'partials/issue') {
			let fields = request.url.split("-");
			let idIssue = fields[1];
			issueProcess.getIssue(response, idIssue, function(result) {
				response.render(page, {
					issueData: result.issueData,
					reporter: result.reporter,
					assignee: result.assignee,
					commentData: result.commentData
				});
			});
		} else if(page == 'partials/search') {
			search.getAllIssues(response, '', function(result) {
				response.render(page, {
					issueData: result
				});
			});
		} else if(page == 'partials/searchIssues') {
			search.getAllIssues(response, request.query.searchToken, function(result) {
				response.render('partials/search', {
					issueData: result
				});
			});
		} else if(page == 'partials/myIssues') {
			search.getMyIssues(response, request.session.username, function(result) {
				response.render('partials/search', {
					issueData: result
				});
			});
		} else if(page == 'partials/reportedByMe') {
			search.getReportedByMe(response, request.session.username, function(result) {
				response.render('partials/search', {
					issueData: result
				});
			});
		} else {
			response.render(page);
		}
	} else {
		debug(TERSE, INFO, 'User is not logged in. Will redirect to "login" page.');
		response.render('pages/login');
	}
}

function sendFileContent(response, fileName, contentType) {
	'use strict';
	fs.readFile(fileName, function(err, data) {
		if(err) {
			response.writeHead(404);
			response.write('Not Found!');
		} else {
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}

		response.end();
	});
}