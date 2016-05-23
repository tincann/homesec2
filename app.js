'use strict';
//classes
const AutoLock = require('./application/auto-lock.js');
const LockDriver = require('./application/lock-driver.js');

//load environment variables
require('dotenv').load();

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

//add loggers
var logger = require('./application/logger.js');
logger.addListener(console.log);


//start
const lock = new AutoLock(process.env.LOCK_GPIOPIN);
const lockDriver = new LockDriver(lock);

rl.on('line', msg => {
    if(msg === 'l'){
        lockDriver.Lock();
    }else if (msg === 'u'){
        lockDriver.Unlock();
    }
});

console.log('Homesec started');