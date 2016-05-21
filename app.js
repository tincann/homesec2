'use strict';
//load environment variables
require('dotenv').load();

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


//Start
const AutoLock = require('./application/auto-lock.js');
const lock = new AutoLock(process.env.LOCK_GPIOPIN);

rl.on('line', msg => {
    if(msg === 'l'){
        lock.Lock();
    }else if (msg === 'u'){
        lock.Unlock();
    }
});

console.log('Homesec started');