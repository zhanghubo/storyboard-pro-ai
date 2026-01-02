/**
 * API路由：生成分镜场景
 * 处理AI生成请求的服务端端点
 */

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const { config, request } = req.body

    // 这里可以添加服务端的AI调用逻辑
    // 目前由客户端直接调用AI服务

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: '服务器错误' })
  }
}


