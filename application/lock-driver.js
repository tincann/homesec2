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
        log.write('Locked');
        stats.write('locked');
        this.tts.sayAll('Door is locked');
        if(this.armed){
            this.Disarm(false);
        }
    }
    
    Unlock(){
        this.lock.Unlock();
        this.state = LOCK_STATE.UNLOCKED;
        log.write('Unlocked');
        stats.write('unlocked');
        this.tts.sayAll('Door is unlocked');
    }

    Toggle(){
        if(this.state == LOCK_STATE.LOCKED){
            this.Unlock();
        }else{
            this.Lock();
        }
    }
    
    //auto lock when door is closed
    Arm(){
        this.armed = true;
        log.write('Armed');
        this.tts.sayAll('Door is armed');
    }
    
    Disarm(sendLog = true){
        this.armed = false;
        if(sendLog){
            log.write('Disarmed');
        }
        this.tts.sayAll('Door is disarmed');
    }

    Status(){
        var msg = `\n${this.state}\n`;
        msg += `Armed: ${this.armed}\n`;
        msg += `LastOpen: ${this.lastOpen.toLocaleString()}\n`;
        msg += `LastClose: ${this.lastClose.toLocaleString()}`;
        log.write(msg);
        return msg;
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
