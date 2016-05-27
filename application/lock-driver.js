const log = require('./logger.js').create('LOCK DRIVER');

class LockDriver {
    constructor(lock, sensor){
        this.lock = lock;
        this.sensor = sensor;
        this.sensor.on('close', this.onDoorClosed.bind(this));
        this.armed = false;
    }
    
    Lock(){
        this.lock.Lock();
        log.write('Locked');
    }
    
    Unlock(){
        this.lock.Unlock();
        log.write('Unlocked');
    }
    
    Arm(){
        this.armed = true;
        log.write('Armed');
    }
    
    Disarm(){
        this.armed = false;
        log.write('Disarmed');
    }
    
    onDoorClosed(){
        if(this.armed){
            setTimeout(() => {
                this.Lock();
                this.Disarm();    
            }, 1000);
        }
    }
}

module.exports = LockDriver;
