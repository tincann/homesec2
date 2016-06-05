const http = require('http');
const log = require('./logger.js').create('TTS');

class TextToSpeech {
    constructor(host, port, username, password){
        this.host = host;
        this.port = port;
        this.auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    }
    
    sayAll(text){
        if(this.host && this.port){
            const options = {
                host: this.host,
                port: this.port,
                path: '/sayall/' + encodeURIComponent(text), 
                headers: { 'Authorization': this.auth }
            };
            http.get(options, (res) => {
                if(res.statusCode != 200){
                    log.write(`${res.statusCode} ${res.statusMessage}`);
                }
            });
        }else{
            log.write('Sonos not configured', true);
        }
    }    
}

module.exports = TextToSpeech;
