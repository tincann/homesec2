const log = require('./logger.js').create('LOCK DRIVER');
const LockState = require('./lock-state.js');
const Stats = require('./stats.js');
const stats = new Stats(process.env.STATS_PATH);

const LOCK_STATE = {
    UNLOCKED: new LockState('UNLOCKED'),
    LOCKED: new LockState('LOCKED')
};

class LockDriver {
    constructor(lock, sensor){
        this.lock = lock;
        this.sensor = sensor;
        this.sensor.on('close', this.onDoorClose.bind(this));
        this.sensor.on('open', this.onDoorOpen.bind(this));
        this.armed = false;
        
        this.lockTimeout = null;
        this.state = LOCK_STATE.UNLOCKED;
    }
    
    Lock(){
        this.lock.Lock();
        this.state = LOCK_STATE.LOCKED;
        log.write('Locked');
        stats.write('locked');
        if(this.armed){
            this.Disarm(false);
        }
    }
    
    Unlock(){
        this.lock.Unlock();
        this.state = LOCK_STATE.UNLOCKED;
        log.write('Unlocked');
        stats.write('unlocked');
    }
    
    //auto lock when door is closed
    Arm(){
        this.armed = true;
        log.write('Armed');
    }
    
    Disarm(sendLog = true){
        this.armed = false;
        
        if(sendLog){
            log.write('Disarmed');
        }
    }
    
    onDoorClose(){
        if(this.armed){
            this.lockTimeout = setTimeout(() => {
                this.Lock();
            }, 3000);
        }
        stats.write('closed');
    }
    
    onDoorOpen(){
        //lock was manually opened
        if(this.state === LOCK_STATE.LOCKED){
            log.write('INTRUDER ALERT');
        }
        clearTimeout(this.lockTimeout);
        stats.write('opened');
    }
}

module.exports = LockDriver;
