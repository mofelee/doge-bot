const fetch = require('node-fetch')
const _ = require('lodash')
const signale = require('signale')

const TULING_API_KEY = process.env.TULING_API_KEY || 'EXAMPLE_TULING_API_KEY'

class TulingBot {
  constructor(key){
    this.key = key
  }

  setKey(key){
    this.key = key
  }

  ask(text, userId){
    return fetch('http://openapi.tuling123.com/openapi/api/v2', {
      method: 'POST',
      body: JSON.stringify({
        reqType: 0,
        perception: {
          inputText: {
            text: text
          }
        },
        userInfo: {
          apiKey: this.key,
          userId: userId
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res=>res.json())
      .then(res=>_.get(res, 'results[0].values.text', '图灵api发生未知状态'))
      .catch(signale.fatal)
  }
}

const tulingBot = new TulingBot(TULING_API_KEY)

module.exports = tulingBot
