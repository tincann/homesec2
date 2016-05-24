'use strict';
var log = require('./logger.js').create('AUTO LOCK');

var Gpio;
if(process.env.NODE_ENV !== 'development'){
    Gpio = require('pigpio').Gpio;
}else{
    Gpio = 
        class DebugMotor { 
            constructor(pin){
                this.pin = pin;
            }
            
            servoWrite(pulseWidth) {
                log.write(`##debug: pin: ${this.pin} pw: ${pulseWidth}`);
            }
        };
}

const LEFT = 500;
const RIGHT = 2300;

class AutoLock {
    constructor(gpioPin){
        this.motor = new Gpio(gpioPin, { mode: Gpio.OUTPUT}); 
    }   
   
    Lock(){
        log.write('Locking');
        this.motor.servoWrite(RIGHT);        
    }
    
    Unlock(){
        log.write('Unlocking');
        this.motor.servoWrite(LEFT);        
    }
}

module.exports = AutoLock;