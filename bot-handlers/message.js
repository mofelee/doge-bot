module.exports = async function(msg) {
  const text = msg.text()

  if ('狗蛋' === text) {
    return msg.say('咋地了')
  }
}
