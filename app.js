'use strict';
//load environment variables from .env file
require('dotenv-safe').load();

//classes
const AutoLock = require('./application/auto-lock.js');
const DoorSensor = require('./application/door-sensor.js');
const LockDriver = require('./application/lock-driver.js');
const Telegram = require('./application/telegram.js');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const tg = new Telegram(process.env.BOT_TOKEN, process.env.CHAT_ID);

//add loggers
const logger = require('./application/logger.js');
const log = logger.create('APP');
logger.addListener(console.log, true);
logger.addListener(tg.log.bind(tg), false);
if(process.env.DEBUG_LISTENER_CHATID){
    logger.addCollector((msg) => { tg.log(msg, process.env.DEBUG_LISTENER_CHATID);});
}

//start
const lock = new AutoLock(process.env.LOCK_GPIOPIN);
const sensor = new DoorSensor(process.env.SENSOR_GPIOPIN);
const lockDriver = new LockDriver(lock, sensor);

//register commands
tg.registerCommand('arm', lockDriver.Arm.bind(lockDriver));
tg.registerCommand('disarm', lockDriver.Disarm.bind(lockDriver));
tg.registerCommand('lock', lockDriver.Lock.bind(lockDriver));
tg.registerCommand('unlock', lockDriver.Unlock.bind(lockDriver));

const cmdMap = {
    'l': lockDriver.Lock,
    'u': lockDriver.Unlock,
    'o': lockDriver.onDoorOpen,
    'c': lockDriver.onDoorClose
};
rl.on('line', msg => {
    const f = cmdMap[msg];
    f && f.call(lockDriver);
});

//start telegram polling
tg.start();

log.write('Homesec started');
