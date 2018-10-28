const qrTerm = require('qrcode-terminal');
const {FileBox} = require('file-box');
const _ = require('lodash');

const {Wechaty, Room, Message} = require('wechaty');

const bot = new Wechaty();

bot.on('scan', function(qrcode, status) {
  qrTerm.generate(qrcode, {small: true});
});

bot.on('login', function(user) {
  console.log(`${user} login`);
});

bot.on('logout', function(user) {
  console.log(`${user} logout`);
});

bot.on('message', async function(msg) {
  const contact = msg.from();
  const text = msg.text();
  const room = msg.room();
  const type = msg.type();

  if (msg.self()) {
    return;
  }

  if (room) {
    const topic = await room.topic();
    console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`);
  } else {
    console.log(`Contact: ${contact.name()} Text: ${text}`);
  }

  if (type !== Message.Type.Text) {
    const file = await msg.toFileBox();
    const name = file.name;
    const filepath = './files/' + name;
    console.log('Save file to: ' + filepath);
    file.toFile(filepath);

    return;
    //return msg.say(`图片狗蛋已经保存下来啦! ${name}`, contact);
  }

  if (/狗蛋还活着不/i.test(text)) {
    return msg.say('狗蛋还活的好好的', contact);
  }

  if (/喝酒$/i.test(text)) {
    const members = await room.memberList();
    const name = members[_.random(0, members.length - 1)].name();

    return msg.say(`狗蛋不想喝酒，狗蛋请${name}喝酒`, contact);
  }

  if (/^溜瓜皮$/i.test(text)) {
    return msg.say('咻~', contact);
  }
});

bot.start().catch(console.error);
