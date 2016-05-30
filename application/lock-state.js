
class LockState {
    constructor(state){
        this.state = state;
    }
    
    toString(){
        return `LOCK_STATE.${this.state}`;
    }
}

module.exports = LockState;
