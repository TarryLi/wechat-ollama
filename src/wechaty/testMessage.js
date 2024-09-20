import { getGptReply } from '../openai/index.js'
import dotenv from 'dotenv'
import inquirer from 'inquirer'
const env = dotenv.config().parsed // 环境参数

// 控制启动
async function handleRequest(type) {
  console.log('type: ', type)
  const message = await getGptReply('hello')
  console.log('🌸🌸🌸 / reply: ', message)
  return
}

const serveList = [
  { name: 'ChatGPT', value: 'ChatGPT' },
  { name: 'Kimi', value: 'Kimi' },
  { name: 'Xunfei', value: 'Xunfei' },
  { name: 'deepseek-free', value: 'deepseek-free' },
  { name: '302AI', value: '302AI' },
  { name: 'dify', value: 'dify' },
  // ... 欢迎大家接入更多的服务
]
const questions = [
  {
    type: 'list',
    name: 'serviceType', //存储当前问题回答的变量key，
    message: '请先选择服务类型',
    choices: serveList,
  },
]
function init() {
  inquirer
    .prompt(questions)
    .then((res) => {
      handleRequest(res.serviceType)
    })
    .catch((error) => {
      console.log('🚀error:', error)
    })
}
init()
