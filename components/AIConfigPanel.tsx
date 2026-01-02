/**
 * AI配置面板组件
 * 用于设置AI模型的API密钥和相关配置
 */

import { useState } from 'react'
import { AIConfig, AIProvider, AI_PROVIDERS, validateAIConfig } from '../lib/aiService'
import { ImageConfig, ImageProvider, IMAGE_PROVIDERS, validateImageConfig } from '../lib/imageService'

interface AIConfigPanelProps {
  onConfigComplete: (aiConfig: AIConfig, imageConfig: ImageConfig) => void
}

export default function AIConfigPanel({ onConfigComplete }: AIConfigPanelProps) {
  // AI文本生成配置
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4')
  const [baseURL, setBaseURL] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  // AI绘画配置
  const [imageProvider, setImageProvider] = useState<ImageProvider>('none')
  const [imageApiKey, setImageApiKey] = useState('')
  const [imageModel, setImageModel] = useState('dall-e-3')
  const [imageBaseURL, setImageBaseURL] = useState('')
  const [imageConnectionStatus, setImageConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  const selectedProvider = AI_PROVIDERS.find(p => p.id === provider)
  const selectedImageProvider = IMAGE_PROVIDERS.find(p => p.id === imageProvider)

  /**
   * 测试API连接
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
   * 测试绘画API连接
   */
  const handleTestImageConnection = async () => {
    if (imageProvider === 'none') {
      setImageConnectionStatus('success')
      return
    }

    if (!imageApiKey.trim()) {
      setError('请先输入绘画API密钥')
      return
    }

    setImageConnectionStatus('testing')
    setError('')

    const config: ImageConfig = {
      provider: imageProvider,
      apiKey: imageApiKey,
      model: imageModel,
      baseURL: imageBaseURL || undefined,
    }

    const result = await validateImageConfig(config)
    
    if (result.success) {
      setImageConnectionStatus('success')
      setTimeout(() => {
        setImageConnectionStatus('idle')
      }, 3000)
    } else {
      setImageConnectionStatus('error')
      setError(result.error || '绘画API连接测试失败')
      setTimeout(() => {
        setImageConnectionStatus('idle')
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

    const aiConfig: AIConfig = {
      provider,
      apiKey,
      model,
      baseURL: baseURL || undefined,
      temperature: 0.7,
      maxTokens: 2000,
    }

    const imageConfig: ImageConfig = {
      provider: imageProvider,
      apiKey: imageProvider === 'none' ? '' : imageApiKey,
      model: imageModel,
      baseURL: imageBaseURL || undefined,
    }

    // 验证AI文本生成配置
    const aiResult = await validateAIConfig(aiConfig)
    
    if (!aiResult.success) {
      setIsValidating(false)
      setConnectionStatus('error')
      setError(aiResult.error || 'AI配置验证失败')
      return
    }

    // 如果选择了绘画服务，也验证绘画配置
    if (imageProvider !== 'none') {
      const imageResult = await validateImageConfig(imageConfig)
      if (!imageResult.success) {
        setIsValidating(false)
        setImageConnectionStatus('error')
        setError(imageResult.error || '绘画API配置验证失败')
        return
      }
    }
    
    setIsValidating(false)
    setConnectionStatus('success')
    setImageConnectionStatus(imageProvider === 'none' ? 'idle' : 'success')
    onConfigComplete(aiConfig, imageConfig)
  }

  /**
   * 跳过配置（使用默认配置）
   */
  const handleSkip = () => {
    // 使用默认配置（用于演示）
    const demoAIConfig: AIConfig = {
      provider: 'openai',
      apiKey: 'demo-key',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    }
    const demoImageConfig: ImageConfig = {
      provider: 'none',
      apiKey: '',
      model: '',
    }
    onConfigComplete(demoAIConfig, demoImageConfig)
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
    <div className="max-w-3xl mx-auto">
      <div className="card animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">⚙️ AI模型配置</h2>
          {getStatusIndicator()}
        </div>
        <p className="text-slate-300 mb-8">
          请配置您的AI模型API以启用智能分镜生成功能
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 服务商选择 */}
          <div>
            <label className="block text-white font-semibold mb-3">
              AI服务商
            </label>
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
                  className={`p-4 rounded-lg border-2 transition-all ${
                    provider === p.id
                      ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className="font-bold text-white mb-1 text-sm">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 模型选择 */}
          <div>
            <label className="block text-white font-semibold mb-2">
              {provider === 'doubao' ? '模型Endpoint ID' : '模型名称'}
            </label>
            {provider === 'doubao' ? (
              <input
                type="text"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  setConnectionStatus('idle')
                }}
                className="input-field"
                placeholder="输入您的endpoint ID，如：ep-20241218xxxxx-xxxxx"
                required
              />
            ) : (
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  setConnectionStatus('idle')
                }}
                className="input-field"
                required
              >
                {selectedProvider?.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
            {provider === 'doubao' && (
              <p className="text-sm text-slate-400 mt-2">
                在火山引擎控制台创建推理接入点后获得endpoint ID
              </p>
            )}
          </div>

          {/* API密钥 */}
          <div>
            <label className="block text-white font-semibold mb-2">
              API密钥
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setConnectionStatus('idle')
                }}
                className="input-field flex-1"
                placeholder="请输入您的API密钥"
                required
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={!apiKey.trim() || connectionStatus === 'testing'}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {connectionStatus === 'testing' ? '测试中...' : '🔌 测试连接'}
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              您的API密钥仅在本地使用，不会被上传或存储
            </p>
          </div>

          {/* 自定义Base URL（可选） */}
          <div>
            <label className="block text-white font-semibold mb-2">
              自定义API地址（可选）
            </label>
            <input
              type="url"
              value={baseURL}
              onChange={(e) => {
                setBaseURL(e.target.value)
                setConnectionStatus('idle')
              }}
              className="input-field"
              placeholder="https://api.example.com/v1"
            />
            <p className="text-sm text-slate-400 mt-2">
              如使用代理或第三方API，可在此填入自定义地址
            </p>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-slate-700 my-8"></div>

          {/* AI绘画配置标题 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">🎨 AI绘画配置（可选）</h3>
            {imageProvider !== 'none' && (
              <div>
                {imageConnectionStatus === 'testing' && (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                    <span className="text-sm">测试中...</span>
                  </div>
                )}
                {imageConnectionStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm font-semibold">✓ 连接成功</span>
                  </div>
                )}
                {imageConnectionStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-sm">✗ 连接失败</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-slate-300 mb-6">
            配置AI绘画API可直接生成图片，或选择"不使用"仅生成提示词
          </p>

          {/* 绘画服务商选择 */}
          <div>
            <label className="block text-white font-semibold mb-3">
              绘画服务商
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {IMAGE_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setImageProvider(p.id)
                    if (p.defaultModel) setImageModel(p.defaultModel)
                    setImageConnectionStatus('idle')
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    imageProvider === p.id
                      ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className="font-bold text-white mb-1 text-xs">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 仅在选择了绘画服务时显示配置 */}
          {imageProvider !== 'none' && (
            <>
              {/* 绘画API密钥 */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  绘画API密钥
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={imageApiKey}
                    onChange={(e) => {
                      setImageApiKey(e.target.value)
                      setImageConnectionStatus('idle')
                    }}
                    className="input-field flex-1"
                    placeholder="请输入绘画API密钥"
                    required={imageProvider !== 'none'}
                  />
                  <button
                    type="button"
                    onClick={handleTestImageConnection}
                    disabled={!imageApiKey.trim() || imageConnectionStatus === 'testing'}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {imageConnectionStatus === 'testing' ? '测试中...' : '🔌 测试'}
                  </button>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  用于生成分镜图片的API密钥
                </p>
              </div>

              {/* 自定义Base URL（可选） */}
              {imageProvider !== 'stabilityai' && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    自定义绘画API地址（可选）
                  </label>
                  <input
                    type="url"
                    value={imageBaseURL}
                    onChange={(e) => {
                      setImageBaseURL(e.target.value)
                      setImageConnectionStatus('idle')
                    }}
                    className="input-field"
                    placeholder="https://api.example.com/v1"
                  />
                </div>
              )}
            </>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* 成功提示 */}
          {connectionStatus === 'success' && !error && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <p className="text-green-200">✓ API连接测试成功！可以继续下一步</p>
            </div>
          )}

          {/* 按钮组 */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isValidating}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <span className="flex items-center justify-center">
                  <span className="loading-spinner w-5 h-5 mr-2" />
                  验证中...
                </span>
              ) : (
                '验证并继续 →'
              )}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="btn-outline"
            >
              演示模式
            </button>
          </div>
        </form>

        {/* 帮助信息 */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-white font-semibold mb-3">💡 如何获取API密钥？</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-purple-300 mb-1">🤖 OpenAI</p>
              <p>访问 platform.openai.com 注册并获取</p>
            </div>
            <div>
              <p className="font-semibold text-purple-300 mb-1">🔍 DeepSeek</p>
              <p>访问 platform.deepseek.com 注册获取</p>
            </div>
            <div>
              <p className="font-semibold text-purple-300 mb-1">🧠 Anthropic</p>
              <p>访问 console.anthropic.com 申请</p>
            </div>
            <div>
              <p className="font-semibold text-purple-300 mb-1">🌋 火山引擎</p>
              <p>访问 <a href="https://console.volcengine.com/ark" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">console.volcengine.com/ark</a> 创建推理接入点获取endpoint ID</p>
            </div>
            <div>
              <p className="font-semibold text-purple-300 mb-1">☁️ 通义千问</p>
              <p>访问 dashscope.aliyun.com 获取</p>
            </div>
            <div>
              <p className="font-semibold text-purple-300 mb-1">⚡ 智谱AI</p>
              <p>访问 open.bigmodel.cn 注册</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
