'user strict';

let http = require('http');
let fs = require('fs');
let logUser = require('./node/logUser');
let signupUser = require('./node/signupUser');
let config = require('./config');
let utils = require("./node/utils");
let express = require('express');
let session = require('express-session');
let app = express();
let bodyParser = require('body-parser');

let expSession;
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

app.get('/', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port);

	expSession = request.session;
	if(expSession.username) {
		DEBUG(TERSE, INFO, 'Session available for "' + expSession.username + '". Sending Home page.');
		sendFileContent(response, 'home.html', 'text/html');
	} else {
		DEBUG(TERSE, INFO, 'User is not logged in. Will redirect to "login" page.');
		sendFileContent(response, 'login.html', 'text/html');
	}
});

app.get('/login', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/login');

	expSession = request.session;
	sendFileContent(response, 'login.html', 'text/html');
});

app.get('/signup', function(request, response) {
	DEBUG(TERSE, INFO, request.method + ' ' + config.server.host + ':' + config.server.port + '/singup');

	expSession = request.session;
	sendFileContent(response, 'signup.html', 'text/html');
});

app.get('/serverError', function(request, response) {
	DEBUG(TERSE, ERROR, request.method + ' ' + config.server.host + ':' + config.server.port + '/serverError');

	sendFileContent(response, 'serverError.html', 'text/html');
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

app.listen(config.server.port);

function sendFileContent(response, fileName, contentType) {
	'use strict';
	fs.readFile(fileName, function(err, data) {
		if(err) {
			console.log("wekhjjdwhsldjosjcldsjdsjclsj");
			response.writeHead(404);
			response.write('Not Found!');
		} else {
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}

		response.end();
	});
}