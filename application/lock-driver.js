const log = require('./logger.js').create('LOCK DRIVER');
const LockState = require('./lock-state.js');
const Stats = require('./stats.js');
const stats = new Stats(process.env.STATS_PATH);

const LOCK_STATE = {
    UNLOCKED: new LockState('UNLOCKED'),
    LOCKED: new LockState('LOCKED')
};

class LockDriver {
    constructor(lock, sensor, tts){
        this.lock = lock;
        this.sensor = sensor;
        this.tts = tts;
        
        this.sensor.on('close', this.onDoorClose.bind(this));
        this.sensor.on('open', this.onDoorOpen.bind(this));
        this.armed = false;
        
        this.lockTimeout = null;
        this.state = LOCK_STATE.UNLOCKED;

        this.lastOpen = new Date();
        this.lastClose = new Date();
    }
    
    Lock(){
        this.lock.Lock();
        this.state = LOCK_STATE.LOCKED;
        stats.write('locked');
        this.tts.sayAll('Door is locked');
        if(this.armed){
            this.Disarm(false);
        }
        return 'Locked';
    }
    
    Unlock(){
        this.lock.Unlock();
        this.state = LOCK_STATE.UNLOCKED;
        stats.write('unlocked');
        this.tts.sayAll('Door is unlocked');
        return 'Unlocked';
    }

    Toggle(){
        if(this.state == LOCK_STATE.LOCKED){
            return this.Unlock();
        }else{
            return this.Lock();
        }
    }
    
    //auto lock when door is closed
    Arm(){
        this.armed = true;
        this.tts.sayAll('Door is armed');
        return 'Armed';
    }
    
    Disarm(sendLog = true){
        this.armed = false;
        this.tts.sayAll('Door is disarmed');
        if(sendLog){
            return 'Disarmed';
        }
    }

    Status(){
        var status = {
            state: this.state,
            armed: this.armed,
            lastOpen: this.lastOpen.toLocaleDateString(),
            lastClose: this.lastClose.toLocaleDateString()
        };
        return status;
    }
    
    onDoorClose(){
        if(this.armed){
            this.lockTimeout = setTimeout(() => {
                this.Lock();
            }, 3000);
        }
        stats.write('closed');
        this.lastClose = new Date();
    }
    
    onDoorOpen(){
        //lock was manually opened
        if(this.state === LOCK_STATE.LOCKED){
            log.write('INTRUDER ALERT');
        }
        clearTimeout(this.lockTimeout);
        stats.write('opened');
        if(this.armed){
            this.tts.sayAll('Warning: door is armed');
        }
        this.lastOpen = new Date();
    }
}

module.exports = LockDriver;
