const EventEmitter = require('events').EventEmitter;
const Telegraf = require('telegraf');

const log = require('./logger.js').create('TG');

class Telegram extends EventEmitter {
    constructor(token, chatId, botUsername){
        if(!botUsername){
            throw new Error("Bot username missing");
        }
        super();
        this.chatId = chatId;
        this.botUsername = botUsername;
        this.t = new Telegraf(token);
        this.registerEvents();
    }
    
    start(){
        this.t.startPolling();
    }
    
    registerCommand(cmd, func){
        const chatId = this.chatId;
        
        //if string
        let match = '/' + cmd + '@' + this.botUsername;
        const isStringCommand = typeof(cmd) === 'string';
        
        if (!isStringCommand){ //if regex
            match = cmd;
        }
        
        this.t.hears(match, ctx => {
            if(ctx.chat && ctx.chat.id == chatId){
                var parameter = ctx.message.text;
                if(!isStringCommand){
                    parameter = match.exec(parameter)[1];
                }
                var response = func(parameter);
                if(response){
                    log.write(response.message);
                }
            }
        });
    }
       
    log(msg, chatId){
        if(!msg) {return;}
        //override chatid?
        chatId = chatId || this.chatId;
        this.t.telegram.sendMessage(chatId, `<pre>${msg}</pre>`, { parse_mode: 'HTML'});
    }
    
    registerEvents(){        
        //for debugging purposes
        const chatId = this.chatId;
        // this.t.on('text', ctx => {
        //    if(ctx.chat && ctx.chat.id == chatId){
        //         console.log(ctx);
        //     }           
        // });
    }
}

module.exports = Telegram;