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
        this.state = this.sensor.digitalRead();
    }
    
    onInterrupt(){
        console.log("interrupt!");
        if(this.timeout) { return; }
        
        this.timeout = setTimeout(() => {
            this.timeout = null;
            var state = this.sensor.digitalRead();
            if(state === this.state) { return; }
            this.state = state;
            
            if(state == 1){
                log.write('Opened');
                this.emit('open');
            }else{
                log.write('Closed');
                this.emit('close');
            }                        
        }, 500);
    }
}

module.exports = DoorSensor;