import { getGptReply } from '../openai/index.js'

/**
 * 获取ai服务
 * @param serviceType 服务类型 'GPT' | 'Kimi'
 * @returns {Promise<void>}
 */
export function getServe(serviceType) {
  return getGptReply
}
