import { Command } from 'commander'
import { WechatyBuilder, ScanStatus, log } from 'wechaty'
import inquirer from 'inquirer'
import qrTerminal from 'qrcode-terminal'
import dotenv from 'dotenv'

import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { defaultMessage } from './wechaty/sendMessage.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const env = dotenv.config().parsed // 环境参数
const { version, name } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))

// 扫码
function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    // 在控制台显示二维码
    qrTerminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log('onScan:', qrcodeImageUrl, ScanStatus[status], status)
  } else {
    log.info('onScan: %s(%s)', ScanStatus[status], status)
  }
}

// 登录
function onLogin(user) {
  console.log(`${user} has logged in`)
  const date = new Date()
  console.log(`Current time:${date}`)
  console.log(`Automatic robot chat mode has been activated`)
}

// 登出
function onLogout(user) {
  console.log(`${user} has logged out`)
}

// 收到好友请求
async function onFriendShip(friendship) {
  const frienddShipRe = /chatgpt|chat/
  if (friendship.type() === 2) {
    if (frienddShipRe.test(friendship.hello())) {
      await friendship.accept()
    }
  }
}

/**
 * 消息发送
 * @param msg
 * @param isSharding
 * @returns {Promise<void>}
 */
async function onMessage(msg) {
  // 默认消息回复
  await defaultMessage(msg, bot, serviceType)
  // 消息分片
  // await shardingMessage(msg,bot)
}

// 初始化机器人
const CHROME_BIN = process.env.CHROME_BIN ? { endpoint: process.env.CHROME_BIN } : {}
let serviceType = ''
export const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
  // puppet: 'wechaty-puppet-wechat', // 如果 wechaty-puppet-wechat 存在问题，也可以尝试使用上面的 wechaty-puppet-wechat4u ，记得安装 wechaty-puppet-wechat4u
  puppetOptions: {
    uos: true,
    ...CHROME_BIN,
  },
})

// 扫码
bot.on('scan', onScan)
// 登录
bot.on('login', onLogin)
// 登出
bot.on('logout', onLogout)
// 收到消息
bot.on('message', onMessage)
// 添加好友
bot.on('friendship', onFriendShip)
// 错误
bot.on('error', (e) => {
  console.error('❌ bot error handle: ', e)
  // console.log('❌ 程序退出,请重新运行程序')
  // bot.stop()

  // // 如果 WechatEveryDay.memory-card.json 文件存在，删除
  // if (fs.existsSync('WechatEveryDay.memory-card.json')) {
  //   fs.unlinkSync('WechatEveryDay.memory-card.json')
  // }
  // process.exit()
})

// 启动微信机器人
function botStart() {
  bot
    .start()
    .then(() => console.log('Start to log in wechat...'))
    .catch((e) => console.error('❌ botStart error: ', e))
}

process.on('uncaughtException', (err) => {
  if (err.code === 'ERR_ASSERTION') {
    console.error('❌ uncaughtException 捕获到断言错误: ', err.message)
  } else {
    console.error('❌ uncaughtException 捕获到未处理的异常: ', err)
  }
  // if (fs.existsSync('WechatEveryDay.memory-card.json')) {
  //   fs.unlinkSync('WechatEveryDay.memory-card.json')
  // }
})

// 控制启动
function handleStart(type) {
  serviceType = type
  console.log('🌸🌸🌸 / type: ', type)
  return botStart()
}

export const serveList = [
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
  handleStart('ChatGPT')
}

const program = new Command(name)
program
  .alias('we')
  .description('🤖一个基于 WeChaty 结合AI服务实现的微信机器人。')
  .version(version, '-v, --version, -V')
  .option('-s, --serve <type>', '跳过交互，直接设置启动的服务类型')
  // .option('-p, --proxy <url>', 'proxy url', '')
  .action(function () {
    const { serve } = this.opts()
    const args = this.args
    if (!serve) return init()
    handleStart(serve)
  })
  .command('start')
  .option('-s, --serve <type>', '跳过交互，直接设置启动的服务类型', '')
  .action(() => init())

// program
//   .command('config')
//   .option('-d, --depth <type>', 'Set the depth of the folder to be traversed', '10')
//   .action(() => {
//     // 打印当前项目的路径，而不是执行该文件时的所在路径
//     console.log('请手动修改下面路径中的 config.json 文件')
//     console.log(path.resolve(__dirname, '../.env'))
//   })
program.parse()
