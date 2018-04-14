'user strict';

let http = require('http');
let fs = require('fs');
let logUser = require('./node/logUser');
let config = require('./config');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(express.static('.'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response) {
	sendFileContent(response, 'index.html', 'text/html');
});

app.get('/login', function(request, response) {
	sendFileContent(response, 'login.html', 'text/html');
});

app.get('/signup', function(request, response) {
	sendFileContent(response, 'signup.html', 'text/html');
});

app.post('/logUser', function(request, response) {
	// console.log('body: ' + JSON.stringify(request.body));
	// let username = request.body.username;

	// console.log('username: ' + username);

	logUser.logUser(request.body.username, request.body.password, function(result){
		console.log(result + ': ' + request.body.username + ', ' + request.body.password);
		response.end(result + '');
	});
});

app.listen(8080);

// http.createServer(function(request, response) {
// 	if(request.method === 'POST') {
// 		let body = '';
//         request.on('data', function (data) {
//             body += data;
//             if (body.length > 1e6) { 
//                 request.connection.destroy();
//             }
//         });
//         request.on('end', function () {
//         	let data = qs.parse(body);

//         	if(request.url.toString() === '/logUser') {
// 				let logged = logUser.logUser(data.username, data.password, function(result){
// 					console.log('*' + result + '*');
// 					response.end(result + '');
// 				});
// 			}	

//         });
// 	} else {
// 		if(request.url === '/'){
// 			sendFileContent(response, 'index.html', 'text/html');
// 		} else if( request.url === '/login'){
// 			sendFileContent(response, 'login.html', 'text/html');
// 		} else if( request.url === '/signup'){
// 			sendFileContent(response, 'signup.html', 'text/html');
// 		}else if(request.url.toString().endsWith('.js')){
// 			sendFileContent(response, request.url.toString().substring(1), 'text/javascript');
// 		} else if(request.url.toString().endsWith('.css')){
// 			sendFileContent(response, request.url.toString().substring(1), 'text/css');
// 		} else if(request.url.toString().endsWith('.jpg')){
// 			sendFileContent(response, request.url.toString().substring(1), 'image/jpeg');
// 		} else if(request.url.toString().endsWith('.png')){
// 			sendFileContent(response, request.url.toString().substring(1), 'image/png');
// 		} else if(request.url.toString().endsWith('.ico')){
// 			sendFileContent(response, request.url.toString().substring(1), 'image/ico');
// 		} else if(request.url.toString().includes('.ttf')){
// 			sendFileContent(response, request.url.toString().substring(1), 'text/ttf');
// 		} else if(request.url.toString().includes('.woff')){
// 			sendFileContent(response, request.url.toString().substring(1).split('?')[0], 'text/woff');
// 		}else if(request.url.toString().endsWith('.js.map')){
// 			sendFileContent(response, request.url.toString().substring(1), 'text/javascript');
// 		} else if(request.url.toString().endsWith('.css.map')){
// 			sendFileContent(response, request.url.toString().substring(1), 'text/css');
// 		} else{
// 			console.log('Requested URL:' + request.url.toString());
// 			response.end();
// 		}
// 	}
// }).listen(config.server.port);

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