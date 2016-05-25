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
        this.t.hears(`/${cmd}`, function * (){ 
            if(this.chat && this.chat.id === this.chatId){
                func();
            }
        });
    }
       
    log(msg){
        // for(let chatId of this.chats){
        //     this.t.sendMessage(chatId, msg);
        // }
        
        this.t.sendMessage(this.chatId, msg);
    }
    
    registerEvents(){        
        //for debugging purposes
        this.t.on('text', function * () {
            
           console.log(this.chat); 
            if(this.chat && this.chat.id !== this.chatId){
                return;
            }
           console.log(this.chat); 
        });
    }
}

module.exports = Telegram;