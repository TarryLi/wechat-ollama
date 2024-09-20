import { Ollama } from 'ollama'

const host = 'https://tarrynas.top:3032'
// const host = 'http:192.168.31.50:11434'

const ollama = new Ollama({ host })

export async function getOllamaReply(prompt) {
  try {
    console.log('🌸🌸🌸 / prompt: ', prompt)
    const res = await ollama.chat({
      model: 'qwen2.5:7b',
      stream: false,
      messages: [{ role: 'user', content: prompt }],
    })
    console.log('🌸🌸🌸 / response: ', res?.message?.content)
    return res?.message?.content || '脑袋炸掉啦！'
  } catch (error) {
    console.error(error.code)
    console.error(error.message)
  }
}
