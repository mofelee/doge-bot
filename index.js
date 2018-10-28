const qrTerm = require('qrcode-terminal');
const {FileBox} = require('file-box');
const util = require('util');
const fs = require('fs');
const path = require('path');
const signale = require('signale');

const readFile = util.promisify(fs.readFile);
const _ = require('lodash');

const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

const {Wechaty, Room, Message} = require('wechaty');

const bot = new Wechaty();

bot.on('scan', function(qrcode, status) {
  qrTerm.generate(qrcode, {small: true});
});

bot.on('login', function(user) {
  signale.info(`${user} login`);
});

bot.on('logout', function(user) {
  signale.info(`${user} logout`);
});

bot.on('message', async function(msg) {
  let handlerPath = path.resolve(__dirname, '../bot-handlers');

  if (!fs.existsSync(path)) {
    handlerPath = __dirname;
  }

  const messageHandler = path.resolve(handlerPath, './message.js');
  if(!process.env.DISABLE_AUTO_LOAD){
    delete require.cache[messageHandler];
  }

  try {
    const fn = require(messageHandler);
    await fn(msg, {
      bot,
    });
  } catch (e) {
    signale.fatal(e);
  }
});

bot.start().catch(console.error);
