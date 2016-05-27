'use strict';
const log = require('./logger.js').create('DOOR SENSOR');
const EventEmitter = require('events').EventEmitter;

var Gpio;
if(process.env.NODE_ENV !== 'development'){
    Gpio = require('pigpio').Gpio;
}else{
    Gpio = 
        class DebugSensor { 
            constructor(pin){
                this.pin = pin;
            }
            
            on(){}
        };
}

class DoorSensor extends EventEmitter {
    constructor(pinNumber){
        super();
        this.sensor = new Gpio(pinNumber, {   
                mode: Gpio.INPUT, 
                pullUpDown: Gpio.PUD_UP, 
                edge: Gpio.EITHER_EDGE });
        this.sensor.on('interrupt', this.onInterrupt.bind(this));
        this.timeout = null;
    }
    
    onInterrupt(){
        console.log("interrupt!");
        if(this.timeout) { return; }
        
        this.timeout = setTimeout(() => {
            var level = this.sensor.digitalRead();
            if(level == 1){
                this.emit('open');
            }else{
                this.emit('close');
            }
            this.timeout = null;
        }, 500);
    }
}

module.exports = DoorSensor;