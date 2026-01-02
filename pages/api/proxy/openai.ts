/**
 * OpenAI API代理
 * 解决浏览器CORS跨域问题
 */

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { apiKey, model, messages, temperature, max_tokens, baseURL } = req.body

    if (!apiKey || !model || !messages) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      })
    }

    const apiUrl = `${baseURL || 'https://api.openai.com/v1'}/chat/completions`
    
    console.log('[OpenAI代理] 转发请求到:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 2000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[OpenAI代理] API错误:', data)
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)

  } catch (error) {
    console.error('[OpenAI代理] 错误:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}

