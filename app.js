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
const commands = {
    'arm': lockDriver.Arm,
    'disarm': lockDriver.Disarm,
    'lock': lockDriver.Lock,
    'unlock': lockDriver.Unlock,
    'toggle': lockDriver.Toggle,
    'status': lockDriver.Status
}

const restify = require('restify');
var server = restify.createServer();

Object.keys(commands).forEach(cmd => {
    var func = commands[cmd];

    //register telegram commands
    tg.registerCommand(cmd, func.bind(lockDriver));

    //register rest command
    server.get(`/${cmd}`, (req, res, next) => {
        log.write(req);
        var result = func.call(lockDriver);
        res.send(result || 200);
        return next();
    });
})

//register terminal commands
rl.on('line', msg => {
    const f = commands[msg];
    f && f.call(lockDriver);
});

//start telegram polling
tg.start();

//start http server
const port = process.env.WEB_INTERFACE_PORT || 8000;
server.listen(port, () => {
    console.log(`Web interface listening on http://localhost:${port}`);
});

log.write('Homesec started');
