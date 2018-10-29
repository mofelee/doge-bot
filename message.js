const signale = require('signale')

module.exports = async function(msg) {
  const text = msg.text()

  if ('狗蛋' === text) {
    return msg.say('我是一个没有灵魂的狗蛋')
  }
}
