"use strict";
const restify = require('restify');

const logger = require('./logger.js');
const log = logger.create('WEB');

class WebInterface {
    constructor(){
        this.server = restify.createServer();
        this.server.use(restify.queryParser());
    }

    registerCommand(cmd, func){
        //register rest command
        this.server.get(`/${cmd}`, (req, res, next) => {
            log.write(req.headers['x-forwarded-for'] || req.connection.remoteAddress + ":\n" + 
                req.url, true);

            var result = func(req.params.args);
            res.send(result || 200);
            if(cmd != 'status'){
                log.write(result.message);
            }
            return next();
        });
    }

    listen(port, cb){
        //start http server
        this.server.listen(port, cb);
    }
}

module.exports = WebInterface;
