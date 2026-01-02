/**
 * 火山引擎豆包API代理
 * 解决浏览器CORS跨域问题
 */

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { apiKey, model, messages, temperature, max_tokens, baseURL } = req.body

    // 验证必需参数
    if (!apiKey || !model || !messages) {
      return res.status(400).json({ 
        error: 'Missing required parameters: apiKey, model, or messages' 
      })
    }

    // 调用火山引擎API
    const apiUrl = `${baseURL || 'https://ark.cn-beijing.volces.com/api/v3'}/chat/completions`
    
    console.log('[代理] 转发请求到:', apiUrl)
    console.log('[代理] Endpoint ID:', model)

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

    console.log('[代理] API响应状态:', response.status)

    if (!response.ok) {
      console.error('[代理] API错误:', data)
      return res.status(response.status).json(data)
    }

    console.log('[代理] 请求成功')
    return res.status(200).json(data)

  } catch (error) {
    console.error('[代理] 错误:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}

