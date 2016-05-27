const log = require('./logger.js').create('LOCK DRIVER');

class LockDriver {
    constructor(lock, sensor){
        this.lock = lock;
        this.sensor = sensor;
        this.sensor.on('close', this.onDoorClose.bind(this));
        this.sensor.on('open', this.onDoorOpen.bind(this));
        this.armed = false;
        
        this.lockTimeout = null;
    }
    
    Lock(){
        this.lock.Lock();
        log.write('Locked');
        if(this.armed){
            this.Disarm();
        }
    }
    
    Unlock(){
        this.lock.Unlock();
        log.write('Unlocked');
    }
    
    //auto lock when door is closed
    Arm(){
        this.armed = true;
        log.write('Armed');
    }
    
    Disarm(){
        this.armed = false;
        log.write('Disarmed');
    }
    
    onDoorClose(){
        if(this.armed){
            this.lockTimeout = setTimeout(() => {
                this.Lock();
            }, 3000);
        }
    }
    
    onDoorOpen(){
        clearTimeout(this.lockTimeout);
    }
}

module.exports = LockDriver;
