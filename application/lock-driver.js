var log = require('./logger.js').create('LOCK DRIVER');

class LockDriver {
    constructor(lock){
        this.lock = lock;
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
}

module.exports = LockDriver;