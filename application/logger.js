const util = require('util');
const subscriptions = [];
const debugSubscriptions = [];

var collectBuffer = "";

if(process.env.NODE_ENV === 'development'){
    Date.prototype.setTimezone = () => {};
    Date.prototype.toLocaleString = () => new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

class Logger{        
    constructor(name){
        this.name = name;
        this.collectTimeout = null;
        this.collectTimeoutDuration = process.env.COLLECT_TIMEOUT || 5000; //in ms
    }
        
    write(msg, onlyDebug){
	var d = new Date();
	d.setTimezone('Europe/Amsterdam');
        const datePrefix = d.toLocaleString();
        msg = typeof msg === 'string' ? msg : util.inspect(msg); 
        const logLine = `[${this.name}] ${msg}`;
        
        if(!onlyDebug){
            for(let s of subscriptions){
                var body = "";
                if(s.includeTimestamp){
                    body += datePrefix;  
                }
                
                body += logLine;
                
                //write logmessage to listener
                s.listener(body);                        
            }
        }
        
        //collect logs for a duration and then send them in a batch
        collectBuffer += `${datePrefix}\n ${logLine}\n`;
        
        if(this.collectTimeout){
            return;   
        }
        this.collectTimeout = setTimeout(() => {
            for(let f of debugSubscriptions){
                f(collectBuffer);
                collectBuffer = "";
                this.collectTimeout = null;
            }
        }, this.collectTimeoutDuration);
    }
}

module.exports = {
    addListener(listener, includeTimestamp){
        subscriptions.push({ listener, includeTimestamp });
    },
    
    addCollector(collector){
        debugSubscriptions.push(collector);
    },
    
    create(name){
        return new Logger(name);
    }
}
