const qrTerm = require('qrcode-terminal')
const fs = require('fs')
const path = require('path')
const signale = require('signale')
const { format } = require('date-fns')

const { Wechaty, Message } = require('wechaty')

const bot = new Wechaty()

// 是否禁用自动重新加载模块
const DISABLE_AUTO_RELOAD = !!process.env.DISABLE_AUTO_RELOAD

// eslint-disable-next-line
bot.on('scan', function(qrcode, status) {
  qrTerm.generate(qrcode, { small: true })
})

bot.on('login', function(user) {
  signale.info(`${user} login`)
})

bot.on('logout', function(user) {
  signale.info(`${user} logout`)
})

bot.on('message', async function(msg) {
  await printMsg(msg)

  const handlerPath = getHandlerPath()
  const messageHandler = path.resolve(handlerPath, './message.js')

  if (!DISABLE_AUTO_RELOAD) {
    delete require.cache[messageHandler]
  }

  try {
    const fn = require(messageHandler)
    await fn(msg, {
      bot
    })
  } catch (e) {
    signale.fatal(e)
  }
})

bot.start().catch(signale.fatal)

////

/**
 * 获取handler的路径
 */
function getHandlerPath() {
  let handlerPath = path.resolve(__dirname, './bot-handlers')

  if (!fs.existsSync(handlerPath)) {
    handlerPath = __dirname
  }

  return handlerPath
}

/**
 * 根据消息的状态打印不同的消息
 */
async function printMsg(msg) {
  const contact = msg.from()
  const text = msg.text()
  const room = msg.room()
  const type = msg.type()

  const log = msg.self() ? signale.success : signale.info
  const topic = room ? await room.topic() : null

  const dateInfo = format(new Date(), 'YYYY-MM-DD hh:mm:ss')
  const roomInfo = topic ? `Room: ${topic}` : ''
  const contactInfo = `Contact: ${contact.name()}`
  let textInfo

  if (type === Message.Type.Text) {
    textInfo = `Text: ${text}`
  } else {
    textInfo = 'Text: 非文字类型'
  }

  log(`${dateInfo} ${roomInfo} ${contactInfo} ${textInfo}`)
}
