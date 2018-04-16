'user strict';

let http = require('http');
let fs = require('fs');
let logUser = require('./node/logUser');
let signupUser = require('./node/signupUser');
let config = require('./config');
let express = require('express');
let session = require('express-session');
let app = express();
let bodyParser = require('body-parser');

let expSession;

app.use(express.static('.'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: config.cookieSecret,
    resave: false,
    saveUninitialized: true
}));

app.get('/', function(request, response) {
	console.log("Root requested");
	expSession = request.session;
	if(expSession.username) {
		console.log("*" + expSession.username + "*");
		sendFileContent(response, 'home.html', 'text/html');
	} else {
		sendFileContent(response, 'login.html', 'text/html');
	}
});

app.get('/login', function(request, response) {
	expSession = request.session;
	sendFileContent(response, 'login.html', 'text/html');
});

app.get('/signup', function(request, response) {
	expSession = request.session;
	sendFileContent(response, 'signup.html', 'text/html');
});

app.post('/logUser', function(request, response) {
	expSession = request.session;
	logUser.logUser(request.body.username, request.body.password, function(result){
		response.end(result + '');
	});
});

app.post('/signupUser', function(request, response) {
	expSession = request.session;
	signupUser.signUp(request.body.firstname, request.body.lastname, request.body.email, request.body.username, request.body.password, function(result){
		response.end(result + '');
	});
});

app.listen(8080);

function sendFileContent(response, fileName, contentType){
	'use strict';
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write('Not Found!');
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}