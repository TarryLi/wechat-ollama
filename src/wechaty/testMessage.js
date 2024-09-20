import { getGptReply } from '../openai/index.js'

// 控制启动
async function handleRequest(type) {
  console.log('type: ', type)
  const message = await getGptReply('hello')
  console.log('🌸🌸🌸 / reply: ', message)
  return
}

function init() {
  handleRequest('ChatGPT')
}

init()
