'use strict';
//classes
const AutoLock = require('./application/auto-lock.js');
const LockDriver = require('./application/lock-driver.js');
const Telegram = require('./application/telegram.js');

//load environment variables from .env file
require('dotenv').load();

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var tg = new Telegram(process.env.BOT_TOKEN, process.env.CHAT_ID);

//add loggers
var logger = require('./application/logger.js');
logger.addListener(console.log);
logger.addListener(tg.log.bind(tg));

//start
const lock = new AutoLock(process.env.LOCK_GPIOPIN);
const lockDriver = new LockDriver(lock);

//register commands
tg.registerCommand('arm', lockDriver.Arm.bind(lockDriver));
tg.registerCommand('disarm', lockDriver.Disarm.bind(lockDriver));
tg.registerCommand('lock', lockDriver.Lock.bind(lockDriver));
tg.registerCommand('unlock', lockDriver.Unlock.bind(lockDriver));

rl.on('line', msg => {
    if(msg === 'l'){
        lockDriver.Lock();
    }else if (msg === 'u'){
        lockDriver.Unlock();
    }
});

//start telegram polling
tg.start();

console.log('Homesec started');