const subscriptions = [];
const debugSubscriptions = [];

class Logger{        
    constructor(name){
        this.name = name;
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
        
        for(let f of debugSubscriptions){
            const body = `${datePrefix} | ${logLine}`;
            f(body);
        }
    }
}

module.exports = {
    addListener(listener, includeTimestamp){
        subscriptions.push({ listener, includeTimestamp });
    },
    
    addDebugListener(listener){
        debugSubscriptions.push(listener);
    },
    
    create(name){
        return new Logger(name);
    }
}
