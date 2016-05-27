const subscriptions = [];

class Logger{        
    constructor(name){
        this.name = name;
    }
        
    write(msg){
        for(let s of subscriptions){
            var prefix = "";
            if(s.includeTimestamp){
                prefix += new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
            }
            prefix += ` [${this.name}] `
            s.listener(prefix + msg);
        }
    }
}

module.exports = {
    addListener(listener, includeTimestamp){
        subscriptions.push({ listener, includeTimestamp });
    },
    
    create(name){
        return new Logger(name);
    }
}
