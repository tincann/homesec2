'use strict';

var Gpio;
if(!process.env.NODE_ENV == 'development'){
    Gpio = require('pigpio').Gpio;
}else{
    Gpio = 
        class DebugMotor { 
            constructor(pin){
                this.pin = pin;
            }
            
            servoWrite(pulseWidth) {
                console.log(`[DebugMotor] pin: ${this.pin} pw: ${pulseWidth}`);
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
        console.log('door locked');
        this.motor.servoWrite(RIGHT);
    }
    
    Unlock(){
        console.log('door unlocked');
        this.motor.servoWrite(LEFT);
    }
}

module.exports = AutoLock;