'use strict';

var Gpio;
if(!process.env.NODE_ENV == 'development'){
    Gpio = require('pigpio').Gpio;
}else{
    Gpio = { write() {}};
}

const LEFT = 500;
const RIGHT = 2300;

class AutoLock {
    constructor(gpioPin){
        this.gpioPin = gpioPin;
    }   
   
    Lock(){
        console.log('door locked');
        Gpio.write(RIGHT);
    }
    
    Unlock(){
        console.log('door unlocked');
        Gpio.write(LEFT);
    }
}

module.exports = AutoLock;