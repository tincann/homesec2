'use strict';
//load environment variables from .env file
require('dotenv').load();

//classes
const AutoLock = require('./application/auto-lock.js');
const LockDriver = require('./application/lock-driver.js');
const Telegram = require('./application/telegram.js');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const tg = new Telegram(process.env.BOT_TOKEN, process.env.CHAT_ID);

//add loggers
const logger = require('./application/logger.js');
const log = logger.create('APP');
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

log.write('Homesec started');
