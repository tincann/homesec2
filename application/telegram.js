const Telegraf = require('telegraf');

class Telegram {
    constructor(token, chatId){
        this.chatId = chatId;
        this.t = new Telegraf(token);
        this.t.on('text', function * (){
            if(this.chat.id === chatId){
                
            }
           console.log(this.chat); 
        });
        this.t.startPolling();
    }
    
    log(msg){
        // for(let chatId of this.chats){
        //     this.t.sendMessage(chatId, msg);
        // }
        
        this.t.sendMessage(this.chatId, msg);
    }
}

module.exports = Telegram;