"use strict";
const restify = require('restify');

const logger = require('./logger.js');
const log = logger.create('WEB');

class WebInterface {
    constructor(){
        this.server = restify.createServer();
    }

    registerCommand(cmd, func){
        //register rest command
        this.server.get(`/${cmd}`, (req, res, next) => {
            log.write(req.url);
            var result = func();
            res.send(result || 200);
            return next();
        });
    }

    listen(port, cb){
        //start http server
        this.server.listen(port, cb);
    }
}

module.exports = WebInterface;
