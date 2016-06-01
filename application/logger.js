const subscriptions = [];
const debugSubscriptions = [];

var collectBuffer = "";

class Logger{        
    constructor(name){
        this.name = name;
        this.collectTimeout = null;
        this.collectTimeoutDuration = process.env.COLLECT_TIMEOUT || 5000; //in ms
    }
        
    write(msg, onlyDebug){
        const datePrefix = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
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
