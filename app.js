'use strict';
//load environment variables from .env file
require('dotenv-safe').load();

//somehow only works in production
if(process.env.NODE_ENV !== 'development'){
    require('time')(Date);
}

//classes
const AutoLock = require('./application/auto-lock.js');
const DoorSensor = require('./application/door-sensor.js');
const LockDriver = require('./application/lock-driver.js');
const Telegram = require('./application/telegram.js');
const TextToSpeech = require('./application/tts.js');

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
const tts = new TextToSpeech(
    process.env.SONOS_ENDPOINT_HOST,
    process.env.SONOS_ENDPOINT_PORT, 
    process.env.SONOS_ENDPOINT_USER, 
    process.env.SONOS_ENDPOINT_PASS);
const lockDriver = new LockDriver(lock, sensor, tts);

//register commands
tg.registerCommand('arm', lockDriver.Arm.bind(lockDriver));
tg.registerCommand('disarm', lockDriver.Disarm.bind(lockDriver));
tg.registerCommand('lock', lockDriver.Lock.bind(lockDriver));
tg.registerCommand('unlock', lockDriver.Unlock.bind(lockDriver));
tg.registerCommand('status', lockDriver.Status.bind(lockDriver));

const cmdMap = {
    'l': lockDriver.Lock,
    'u': lockDriver.Unlock,
    'o': lockDriver.onDoorOpen,
    'c': lockDriver.onDoorClose,
    's': lockDriver.Status
};
rl.on('line', msg => {
    const f = cmdMap[msg];
    f && f.call(lockDriver);
});

//start telegram polling
tg.start();

log.write('Homesec started');
