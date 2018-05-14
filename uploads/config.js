"use strict";

let config = {
	server: {
        host: '127.0.0.1',
        port: '8080'
    },
	database: {
        host:   '127.0.0.1',
        port:   '3306',
        db:     'itadmin',
        user:   'itadmin',
        passwd: 'itadmin'
    },
    cookieSecret: 'dkjnac$#@RGDV$%GVVC$#r43fn43kncnsakjjfja',
    debug: true,
    debugType: {
        info: 'INFO',
        error: 'ERROR',
        warning: 'WARN'
    },
    debugVerbosity: 0,
    debugLevel: {
        terse: 0,
        verbose: 1
    },
    issueStatus: {
        opened: 'OPEN',
        inProgress: 'IN PROGRESS',
        fixed: 'FIXED',
        closed: 'CLOSED'
    }
}

module.exports = config;