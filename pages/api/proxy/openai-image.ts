/**
 * OpenAI DALL-E 3 图像API代理
 * 解决CORS跨域问题
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
    const { authorization, baseURL, ...body } = req.body
    
    if (!authorization) {
      return res.status(400).json({ error: 'Missing authorization' })
    }

    const targetUrl = `${baseURL || 'https://api.openai.com/v1'}/images/generations`
    
    console.log('[DALL-E代理] 转发请求到:', targetUrl)
    console.log('[DALL-E代理] 提示词长度:', body.prompt?.length || 0)

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify(body),
    })

    console.log('[DALL-E代理] API响应状态:', response.status)

    const data = await response.json()

    if (!response.ok) {
      console.error('[DALL-E代理] API错误:', data)
      return res.status(response.status).json(data)
    }

    console.log('[DALL-E代理] 图像生成成功')
    return res.status(200).json(data)
    
  } catch (error) {
    console.error('[DALL-E代理] 请求失败:', error)
    return res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        type: 'proxy_error'
      }
    })
  }
}


