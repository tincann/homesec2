'use strict';
//load environment variables
require('dotenv').load();

const AutoLock = require('./application/auto-lock.js');

const lock = new AutoLock(5);

lock.Lock();

setTimeout(() => {
    lock.Unlock();    
}, 1000);
