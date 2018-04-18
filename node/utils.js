"use strict";

let config = require('../config.js');

module.exports = {
	isEmpty: isEmpty,
	DEBUG: debug
};

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
	response.send('500 server Error');
	response.end();
}