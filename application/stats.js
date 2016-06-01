const fs = require('fs');
const log = require('./logger.js').create('STATS');

class Stats {
    constructor(path){
        this.path = path;
    }
    
    write(name, value){
        const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        fs.appendFile(this.path, Stats.format(date, name, value), (err) => {
            if(err){ 
                log.write("Couldn't append log file! " + err);
            }else{
                if(Math.random() < 0.1){
                    fs.stat(this.path, (err, stats) => {
                        log.write(`Stats size: ${stats.size / 1024} KB`, true);
                    });
                }
            }
        });
    }
    
    static format(date, name, value = ""){
        return `${date}|${name}=${value}\n`;
    }
    
}

module.exports = Stats;
