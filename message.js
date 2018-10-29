const signale = require('signale')

module.exports = async function(msg) {
  const text = msg.text()

  if ('测试机器人' === text) {
    return msg.say('您还未创建自定义handler')
  }
}
