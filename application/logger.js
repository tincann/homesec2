const funcs = [];

class Logger{        
    constructor(name){
        this.name = name;
    }
        
    write(msg){
        for(let f of funcs){
            f(`[${this.name}] ${msg}`);
        }
    }
}

module.exports = {
    addListener(func){
        funcs.push(func);
    },
    
    create(name){
        return new Logger(name);
    }
}
