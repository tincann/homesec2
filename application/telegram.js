const EventEmitter = require('events').EventEmitter;
const Telegraf = require('telegraf');

class Telegram extends EventEmitter {
    constructor(token, chatId){
        super();
        this.chatId = chatId;
        this.t = new Telegraf(token);
        this.registerEvents();
    }
    
    start(){
        this.t.startPolling();
    }
    
    registerCommand(cmd, func){
        const self = this;
        const chatId = this.chatId;
        this.t.hears(`/${cmd}`, function * (){ 
            if(this.chat && this.chat.id == chatId){
                var response = func();
                if(response){
                    self.log(JSON.stringify(response));
                }
            }
        });
    }
       
    log(msg, chatId){
        if(!msg) {return;}
        //override chatid?
        chatId = chatId || this.chatId;
        this.t.sendMessage(chatId, `<pre>${msg}</pre>`, { parse_mode: 'HTML'});
    }
    
    registerEvents(){        
        //for debugging purposes
        const chatId = this.chatId;
        this.t.on('text', function * () {
           if(this.chat && this.chat.id == chatId){
                console.log(this.chat);
            }           
        });
    }
}

module.exports = Telegram;