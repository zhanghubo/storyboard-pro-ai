/**
 * 高级配置面板 - 包含文本、图像、视频三个API配置
 */

import { useState } from 'react'
import { AIConfig, AIProvider, AI_PROVIDERS, validateAIConfig } from '../lib/aiService'
import { ImageConfig, ImageProvider, IMAGE_PROVIDERS } from '../lib/imageService'
import { VideoConfig, VideoProvider, VIDEO_PROVIDERS } from '../lib/videoService'

interface AdvancedConfigPanelProps {
  onConfigComplete: (config: AIConfig, imageConfig?: ImageConfig, videoConfig?: VideoConfig) => void
}

export default function AdvancedConfigPanel({ onConfigComplete }: AdvancedConfigPanelProps) {
  // 文本生成配置
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4')
  const [baseURL, setBaseURL] = useState('')
  
  // 图像生成配置
  const [enableImageGen, setEnableImageGen] = useState(true) // 默认启用
  const [imageProvider, setImageProvider] = useState<ImageProvider>('doubao-image')
  const [imageApiKey, setImageApiKey] = useState('')
  const [imageModel, setImageModel] = useState('')
  const [imageBaseURL, setImageBaseURL] = useState('')
  
  // 视频生成配置
  const [enableVideoGen, setEnableVideoGen] = useState(true) // 默认启用完整工作流
  const [videoProvider, setVideoProvider] = useState<VideoProvider>('doubao-video')
  const [videoApiKey, setVideoApiKey] = useState('')
  const [videoModel, setVideoModel] = useState('')
  const [videoBaseURL, setVideoBaseURL] = useState('')
  
  const [isValidating, setIsValidating] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const selectedProvider = AI_PROVIDERS.find(p => p.id === provider)
  const selectedImageProvider = IMAGE_PROVIDERS.find(p => p.id === imageProvider)
  const selectedVideoProvider = VIDEO_PROVIDERS.find(p => p.id === videoProvider)

  /**
   * 测试连接
   */
  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError('请先输入API密钥')
      return
    }

    setConnectionStatus('testing')
    setError('')

    const config: AIConfig = {
      provider,
      apiKey,
      model,
      baseURL: baseURL || undefined,
      temperature: 0.7,
      maxTokens: 2000,
    }

    const result = await validateAIConfig(config)
    
    if (result.success) {
      setConnectionStatus('success')
      setTimeout(() => {
        setConnectionStatus('idle')
      }, 3000)
    } else {
      setConnectionStatus('error')
      setError(result.error || 'API连接测试失败')
      setTimeout(() => {
        setConnectionStatus('idle')
      }, 5000)
    }
  }

  /**
   * 处理提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsValidating(true)

    const config: AIConfig = {
      provider,
      apiKey,
      model,
      baseURL: baseURL || undefined,
      temperature: 0.7,
      maxTokens: 2000,
    }

    // 验证配置
    const result = await validateAIConfig(config)
    
    setIsValidating(false)

    if (result.success) {
      setConnectionStatus('success')
      
      // 准备图像配置（如果启用）
      const imgConfig: ImageConfig | undefined = enableImageGen ? {
        provider: imageProvider,
        apiKey: imageApiKey,
        model: imageModel,
        baseURL: imageBaseURL || undefined,
      } : undefined
      
      // 准备视频配置（如果启用）
      const vidConfig: VideoConfig | undefined = enableVideoGen ? {
        provider: videoProvider,
        apiKey: videoApiKey,
        model: videoModel,
        baseURL: videoBaseURL || undefined,
      } : undefined
      
      onConfigComplete(config, imgConfig, vidConfig)
    } else {
      setConnectionStatus('error')
      setError(result.error || 'API配置验证失败')
    }
  }

  /**
   * 跳过配置
   */
  const handleSkip = () => {
    const demoConfig: AIConfig = {
      provider: 'openai',
      apiKey: 'demo-key',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    }
    onConfigComplete(demoConfig)
  }

  /**
   * 获取连接状态指示灯
   */
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'testing':
        return (
          <div className="flex items-center space-x-2 text-yellow-400">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-sm">测试中...</span>
          </div>
        )
      case 'success':
        return (
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
            <span className="text-sm font-semibold">✓ 连接成功</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-400">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-sm">✗ 连接失败</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-2 text-slate-500">
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            <span className="text-sm">未测试</span>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">⚙️ 完整AI配置</h2>
          {getStatusIndicator()}
        </div>
        
        {/* 工作流程说明 */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            🎬 完整工作流程
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div className="flex-1">
              <div className="text-3xl mb-2">📝</div>
              <div className="font-bold text-white mb-1">文字大模型</div>
              <div className="text-sm text-slate-300">生成分镜提示词</div>
            </div>
            <div className="text-2xl text-purple-400">→</div>
            <div className="flex-1">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-bold text-white mb-1">文生图模型</div>
              <div className="text-sm text-slate-300">生成分镜图片</div>
            </div>
            <div className="text-2xl text-purple-400">→</div>
            <div className="flex-1">
              <div className="text-3xl mb-2">🎬</div>
              <div className="font-bold text-white mb-1">图生视频模型</div>
              <div className="text-sm text-slate-300">合成最终视频</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/30">
            <p className="text-sm text-slate-300 text-center">
              💡 <strong className="text-yellow-300">提示</strong>：您可以选择只生成提示词、提示词+图片，或完整流程（提示词+图片+视频）
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 文本生成配置 */}
          <div className="border-2 border-purple-500/30 rounded-lg p-6 bg-purple-900/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
              文本生成API（必需）
            </h3>
            
            {/* 服务商选择 */}
            <div className="mb-4">
              <label className="block text-white font-semibold mb-3">AI服务商</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AI_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProvider(p.id)
                      setModel(p.defaultModel)
                      setConnectionStatus('idle')
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      provider === p.id
                        ? 'border-purple-500 bg-purple-900/30'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className="font-bold text-white text-xs">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 模型和API密钥 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  {provider === 'doubao' ? 'Endpoint ID' : '模型'}
                </label>
                {provider === 'doubao' ? (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input-field"
                    placeholder="ep-xxxxx-xxxxx"
                    required
                  />
                ) : (
                  <select value={model} onChange={(e) => setModel(e.target.value)} className="input-field" required>
                    {selectedProvider?.models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">API密钥</label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="input-field flex-1"
                    placeholder="sk-xxxxx"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    🔌 测试
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 图像生成配置 */}
          <div className="border-2 border-blue-500/30 rounded-lg p-6 bg-blue-900/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                  图像生成API
                </h3>
                <p className="text-blue-300 text-sm mt-1 ml-11">
                  🎨 为每个分镜生成图片 - <span className="text-green-400 font-bold">✓ 默认已启用</span>
                </p>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={enableImageGen}
                  onChange={(e) => setEnableImageGen(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className={`font-semibold transition-colors ${enableImageGen ? 'text-green-400' : 'text-slate-400'}`}>
                  {enableImageGen ? '✅ 已启用' : '❌ 已禁用'}
                </span>
              </label>
            </div>

            {enableImageGen && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {IMAGE_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setImageProvider(p.id)
                        setImageModel(p.defaultModel)
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        imageProvider === p.id
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className="font-bold text-white text-sm">{p.name}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Endpoint ID/模型</label>
                    <input
                      type="text"
                      value={imageModel}
                      onChange={(e) => setImageModel(e.target.value)}
                      className="input-field"
                      placeholder="ep-xxxxx-xxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">API密钥</label>
                    <input
                      type="password"
                      value={imageApiKey}
                      onChange={(e) => setImageApiKey(e.target.value)}
                      className="input-field"
                      placeholder="sk-xxxxx"
                    />
                  </div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-sm text-blue-200 font-semibold mb-2">
                    💡 如何使用：
                  </p>
                  <ul className="text-xs text-blue-300 space-y-1">
                    <li>• ✅ <strong className="text-green-300">填写配置</strong> → 自动生成图片（约2-10分钟）</li>
                    <li>• ❌ <strong className="text-yellow-300">不填写或取消勾选</strong> → 只生成文字提示词</li>
                    <li>• 💰 费用参考：15个分镜约 <span className="text-yellow-300 font-bold">¥1.2</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 3. 视频生成配置 */}
          <div className="border-2 border-green-500/30 rounded-lg p-6 bg-green-900/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                  视频生成API（高级功能）
                </h3>
                <p className="text-green-300 text-sm mt-1 ml-11">
                  🎬 将所有图片合成为视频 - <span className="text-green-400 font-bold">✓ 默认已启用</span>
                </p>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={enableVideoGen}
                  onChange={(e) => setEnableVideoGen(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className={`font-semibold transition-colors ${enableVideoGen ? 'text-green-400' : 'text-slate-400'}`}>
                  {enableVideoGen ? '✅ 已启用' : '❌ 已禁用'}
                </span>
              </label>
            </div>

            {enableVideoGen && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {VIDEO_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setVideoProvider(p.id)
                        setVideoModel(p.defaultModel)
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoProvider === p.id
                          ? 'border-green-500 bg-green-900/30'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{p.icon}</div>
                        <div className="text-left">
                          <div className="font-bold text-white text-sm">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Endpoint ID/模型</label>
                    <input
                      type="text"
                      value={videoModel}
                      onChange={(e) => setVideoModel(e.target.value)}
                      className="input-field"
                      placeholder="ep-xxxxx-xxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">API密钥</label>
                    <input
                      type="password"
                      value={videoApiKey}
                      onChange={(e) => setVideoApiKey(e.target.value)}
                      className="input-field"
                      placeholder="sk-xxxxx"
                    />
                  </div>
                </div>
                <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                  <p className="text-sm text-green-200 font-semibold mb-2">
                    💡 提示：
                  </p>
                  <ul className="text-xs text-green-300 space-y-1">
                    <li>• 视频合成需要<strong>先启用图像生成</strong></li>
                    <li>• 将自动把所有分镜图片合成为视频（约1-5分钟）</li>
                    <li>• 费用较高：15个分镜约 <span className="text-yellow-300 font-bold">¥22.5</span></li>
                    <li>• 建议先测试图像生成后再启用此功能</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* 按钮组 */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isValidating}
              className="btn-primary flex-1"
            >
              {isValidating ? '验证中...' : '完成配置并继续 →'}
            </button>
            <button type="button" onClick={handleSkip} className="btn-outline">
              演示模式
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

