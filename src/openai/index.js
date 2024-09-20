import axios from 'axios'

function setConfig(prompt) {
  return {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://tarrynas.top:3032/api/chat',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: JSON.stringify({
      model: 'qwen2:7b',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
    }),
  }
}

// 获取 chatGPT 的回复
export async function getGptReply(prompt) {
  try {
    const config = setConfig(prompt)
    console.log('🌸🌸🌸 / config: ', config)
    const res = await axios(config)
    console.log('🌸🌸🌸 / response: ', res)
    return res?.data?.message?.content
  } catch (error) {
    console.error(error.code)
    console.error(error.message)
  }
}
