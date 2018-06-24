'use strict';

let http = require('http');
let fs = require('fs');
let logUser = require('./node/logUser');
let signupUser = require('./node/signupUser');
let issueProcess = require('./node/issueProcess');
let dashboard = require('./node/dashboard');
let config = require('./config');
let utils = require("./node/utils");
let express = require('express');
let session = require('express-session');
let app = express();
let bodyParser = require('body-parser');
let formidable = require('formidable');
let path = require('path');
let search = require('./node/search');

let expSession;

let servePage = utils.servePage;
let DEBUG = utils.DEBUG;
let INFO = config.debugType.info;
let WARN = config.debugType.warning;
let ERROR = config.debugType.error;
let TERSE = config.debugLevel.terse;
let VERBOSE = config.debugType.verbose;

app.use(express.static('.'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: config.cookieSecret,
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port);
	servePage(request, response, 'pages/home');
});

app.get('/login', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/login');
	servePage(request, response, 'pages/login');
});

app.get('/signup', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/singup');
	response.render('pages/signup');
});

app.get('/serverError', function(request, response) {
	DEBUG(TERSE, ERROR, request.method + ' ' + config.server.host + ':' + config.server.port + '/serverError');
	response.render('pages/serverError');
});

app.get('/logIssue', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/logIssue');
	servePage(request, response, 'pages/logIssue');
});

app.get('/dashboard', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/dashboard');
	servePage(request, response, 'partials/dashboard');
});

app.get('/ITSD-*', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + request.url);
	servePage(request, response, 'partials/issue');
});

app.get('/search', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/search');
	servePage(request, response, 'partials/search');
});

app.get('/searchIssues', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/searchIssues');
	servePage(request, response, 'partials/searchIssues');
});

app.get('/myIssues', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/myIssues');
	servePage(request, response, 'partials/myIssues');
});

app.get('/reportedByMe', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/reportedByMe');
	servePage(request, response, 'partials/reportedByMe');
});

app.post('/logUser', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/logUser');

	expSession = request.session;
	logUser.logUser(response, request.body.username, request.body.password, function(result) {
		if(result) {
			expSession.username = request.body.username;
		}

		response.end(result + '');
	});
});

app.post('/signupUser', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/signupUser');

	expSession = request.session;
	signupUser.signUp(request.body.firstname, request.body.lastname, request.body.email, request.body.username, request.body.password, function(result) {
		if(result) {
			expSession.username = request.body.username;	
		} 

		response.end(result + '');
	});
});

app.post('/logoutUser', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/logoutUser');

	expSession = request.session;
	logUser.logoutUser(request);
	response.end('true');
});

app.post('/uploadFile', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/uploadFile');

	let form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname, './uploads');

	form.on('file', function(field, file) {
	    fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	form.on('error', function(err) {
		DEBUG(TERSE, ERROR, 'Could not save uploaded file ' + form.file.name + '!');
		response.end('fail');		
	});

	form.on('end', function() {
		response.end('success');
	});

	form.parse(request);
});

app.post('/logIssue', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/logIssue');

	expSession = request.session;

	let user = expSession.username;
	let summary = request.body.summary;
	let description = request.body.description;
	let severity = request.body.severity;
	let priority = request.body.priority;
	let attach = request.body.file;

	issueProcess.logIssue(response, user, summary, description, severity, priority, attach, function(result) {
		response.end(result + '');
	});
});

app.post('/editIssue', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/editIssue');

	expSession = request.session;

	let user = expSession.username;
	let idIssue = request.body.idIssue;
	let summary = request.body.summary;
	let description = request.body.description;
	let severity = request.body.severity;
	let priority = request.body.priority;
	let attach = request.body.file;

	issueProcess.editIssue(response, idIssue, summary, description, severity, priority, attach, function(result) {
		response.end(result + '');
	});
});

app.post('/getIssue', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/searchIssue');

	search.searchIssue(response, request.body.idIssue, function (found) {
		response.end(found + '');
	});
});

app.post('/assignReq', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/assignReq');

	search.getUsers(response, function (users) {
		response.end(JSON.stringify(users));
	});
});

app.post('/assignIssue', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/assignIssue');

	issueProcess.setAssignee(response, request.body.assignee, request.body.idIssue, function (result) {
		response.end(result + '');
	});
});

app.post('/issueStatus', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/issueStatus');

	issueProcess.setStatus(response, request.body.nextStatus, request.body.idIssue, function (result) {
		response.end(result + '');
	});
});

app.post('/issueComment', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/issueComment');

	issueProcess.setComment(response, request.session.username, request.body.idIssue, request.body.comment, function (result) {
		response.end(result);
	});
});

app.listen(config.server.port);