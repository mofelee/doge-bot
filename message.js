module.exports = async function(msg) {
  const text = msg.text();

  console.log(text)

  if ('溜瓜皮' === text) {
    return msg.say('咻~2');
  }
};
