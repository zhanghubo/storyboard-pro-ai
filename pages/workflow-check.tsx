/**
 * 🔍 工作流程检查页面
 * 帮助用户验证完整的三步AI工作流程
 */

import { useState } from 'react'
import Head from 'next/head'

export default function WorkflowCheck() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <>
      <Head>
        <title>工作流程检查 - Storyboard Grid Pro</title>
        <meta name="description" content="验证完整的AI工作流程配置" />
      </Head>

      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* 页面标题 */}
          <div className="glass-card-strong mb-8 text-center animate-fadeIn">
            <h1 className="font-heading text-5xl mb-4 text-gradient">
              🔍 完整工作流程检查
            </h1>
            <p className="font-body text-lg opacity-90">
              三步走，轻松实现 <strong>文字 → 图片 → 视频</strong> 的完整创作流程
            </p>
          </div>

          {/* 工作流程图 */}
          <div className="glass-card mb-8 animate-slideInLeft">
            <h2 className="font-heading text-3xl mb-6 text-glow">
              📊 完整工作流程
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 步骤 1 */}
              <div className={`glass-card ${currentStep === 1 ? 'glow' : ''}`}>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-heading text-3xl mb-3">
                    1
                  </div>
                  <h3 className="font-heading text-2xl mb-2">📝 文字大模型</h3>
                  <span className="badge badge-primary">必需</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>生成分镜剧本描述</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>分析场景、角色、动作</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>输出结构化场景信息</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <p className="text-xs font-bold text-blue-200 mb-2">支持的模型：</p>
                  <ul className="text-xs space-y-1 text-blue-100">
                    <li>• OpenAI (GPT-4/3.5)</li>
                    <li>• Anthropic (Claude)</li>
                    <li>• 豆包 (Doubao)</li>
                    <li>• DeepSeek</li>
                    <li>• 通义千问</li>
                    <li>• 智谱AI (GLM)</li>
                  </ul>
                </div>
              </div>

              {/* 步骤 2 */}
              <div className={`glass-card ${currentStep === 2 ? 'glow' : ''}`}>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-heading text-3xl mb-3">
                    2
                  </div>
                  <h3 className="font-heading text-2xl mb-2">🎨 文生图模型</h3>
                  <span className="badge badge-success">推荐</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>根据提示词生成图片</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>支持 16:9 和 9:16 比例</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>批量生成多张分镜图</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                  <p className="text-xs font-bold text-purple-200 mb-2">支持的模型：</p>
                  <ul className="text-xs space-y-1 text-purple-100">
                    <li>• 豆包图像模型 (推荐)</li>
                    <li>• DALL-E 3</li>
                    <li>• Midjourney (API)</li>
                    <li>• Stable Diffusion</li>
                  </ul>
                  <p className="text-xs mt-2 text-purple-200">
                    💰 约 ¥0.08/张
                  </p>
                </div>
              </div>

              {/* 步骤 3 */}
              <div className={`glass-card ${currentStep === 3 ? 'glow' : ''}`}>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-heading text-3xl mb-3">
                    3
                  </div>
                  <h3 className="font-heading text-2xl mb-2">🎬 图生视频</h3>
                  <span className="badge badge-warning">可选</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>将多张图片合成视频</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>添加转场和时长控制</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>输出 MP4 格式视频</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
                  <p className="text-xs font-bold text-orange-200 mb-2">支持的模型：</p>
                  <ul className="text-xs space-y-1 text-orange-100">
                    <li>• 豆包视频模型 (推荐)</li>
                    <li>• Runway Gen-2</li>
                    <li>• Pika Labs</li>
                  </ul>
                  <p className="text-xs mt-2 text-orange-200">
                    💰 约 ¥1.5/秒
                  </p>
                </div>
              </div>

            </div>

            {/* 流程导航 */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="btn-secondary"
                disabled={currentStep === 1}
              >
                ← 上一步
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                className="btn-primary"
                disabled={currentStep === 3}
              >
                下一步 →
              </button>
            </div>
          </div>

          <div className="glass-divider"></div>

          {/* 配置指南 */}
          <div className="glass-card mb-8 animate-scaleIn">
            <h2 className="font-heading text-3xl mb-6 text-glow">
              ⚙️ 如何配置完整工作流程
            </h2>

            <div className="space-y-6">
              
              {/* 配置步骤 1 */}
              <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-2 border-blue-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-heading text-2xl">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl mb-3">配置文字大模型（必需）</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="font-bold mb-2">📍 在哪里配置？</p>
                        <p className="text-sm opacity-90 mb-3">
                          主页 → 第一步"⚙️ 完整AI配置" → "文本生成（大语言模型）"区域
                        </p>
                        
                        <p className="font-bold mb-2">🔑 需要填写：</p>
                        <ul className="text-sm space-y-2 opacity-90">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            <span><strong>选择提供商</strong>：OpenAI / Doubao / DeepSeek 等</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            <span><strong>API 密钥</strong>：从对应平台获取</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            <span><strong>模型名称</strong>：如 gpt-4, doubao-seed-1-6-lite-251015</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            <span><strong>Endpoint ID</strong>：（豆包模型需要）</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                        <p className="font-bold text-green-200 mb-2">✅ 验证方法：</p>
                        <p className="text-sm opacity-90">
                          点击"🔌 测试连接"按钮，看到 <strong className="text-green-400">🟢 "✓ 连接成功"</strong> 即可
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 配置步骤 2 */}
              <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-2 border-purple-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-heading text-2xl">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl mb-3">配置文生图模型（推荐）</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="font-bold mb-2">📍 在哪里配置？</p>
                        <p className="text-sm opacity-90 mb-3">
                          主页 → 第一步"⚙️ 完整AI配置" → <strong>勾选"✅ 启用图像生成"</strong>
                        </p>
                        
                        <p className="font-bold mb-2">🔑 需要填写：</p>
                        <ul className="text-sm space-y-2 opacity-90">
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span><strong>选择提供商</strong>：Doubao Image / DALL-E 3</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span><strong>API 密钥</strong>：图像模型的 API Key</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span><strong>Endpoint ID</strong>：豆包图像模型的 Endpoint</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                        <p className="font-bold text-yellow-200 mb-2">💡 重要提示：</p>
                        <ul className="text-sm space-y-2 opacity-90">
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>如果<strong>不勾选</strong>此选项，将只生成<strong>文字提示词</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>勾选后，系统会<strong>自动生成分镜图片</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 配置步骤 3 */}
              <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 border-2 border-orange-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-heading text-2xl">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl mb-3">配置图生视频（可选）</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="font-bold mb-2">📍 在哪里配置？</p>
                        <p className="text-sm opacity-90 mb-3">
                          主页 → 第一步"⚙️ 完整AI配置" → <strong>勾选"✅ 启用视频合成"</strong>
                        </p>
                        
                        <p className="font-bold mb-2">🔑 需要填写：</p>
                        <ul className="text-sm space-y-2 opacity-90">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400">•</span>
                            <span><strong>选择提供商</strong>：Doubao Video / Runway</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400">•</span>
                            <span><strong>API 密钥</strong>：视频模型的 API Key</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400">•</span>
                            <span><strong>Endpoint ID</strong>：豆包视频模型的 Endpoint</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                        <p className="font-bold text-blue-200 mb-2">ℹ️ 说明：</p>
                        <ul className="text-sm space-y-2 opacity-90">
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>此步骤<strong>依赖步骤2</strong>（必须先生成图片）</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>系统会将所有分镜图片<strong>自动合成视频</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>可以不配置，仅生成图片</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="glass-divider"></div>

          {/* 常见问题 */}
          <div className="glass-card mb-8">
            <h2 className="font-heading text-3xl mb-6 text-glow">
              ❓ 常见问题
            </h2>

            <div className="space-y-4">
              
              <details className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/15 transition">
                <summary className="font-bold text-lg">
                  Q: 为什么只生成了提示词，没有图片？
                </summary>
                <div className="mt-3 pl-4 border-l-4 border-purple-500 text-sm opacity-90">
                  <p className="mb-2">
                    <strong>原因</strong>：您没有勾选"启用图像生成"选项。
                  </p>
                  <p>
                    <strong>解决</strong>：点击"重新开始" → 在配置页面勾选"✅ 启用图像生成" → 填写图像API配置 → 重新生成
                  </p>
                </div>
              </details>

              <details className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/15 transition">
                <summary className="font-bold text-lg">
                  Q: 如何只生成图片，不生成视频？
                </summary>
                <div className="mt-3 pl-4 border-l-4 border-purple-500 text-sm opacity-90">
                  <p>
                    <strong>配置</strong>：只勾选"✅ 启用图像生成"，<strong>不勾选</strong>"启用视频合成"即可。
                  </p>
                </div>
              </details>

              <details className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/15 transition">
                <summary className="font-bold text-lg">
                  Q: 视频生成失败了怎么办？
                </summary>
                <div className="mt-3 pl-4 border-l-4 border-purple-500 text-sm opacity-90">
                  <p className="mb-2">
                    <strong>常见原因</strong>：
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• 图片数量不足（至少需要2张）</li>
                    <li>• 视频API配置错误</li>
                    <li>• API额度不足</li>
                  </ul>
                  <p className="mt-2">
                    <strong>解决</strong>：即使视频失败，图片也已经生成，可以手动下载使用。
                  </p>
                </div>
              </details>

              <details className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/15 transition">
                <summary className="font-bold text-lg">
                  Q: 如何获取火山引擎（豆包）的 API 密钥和 Endpoint ID？
                </summary>
                <div className="mt-3 pl-4 border-l-4 border-purple-500 text-sm opacity-90">
                  <p className="mb-2">
                    <strong>步骤</strong>：
                  </p>
                  <ol className="space-y-2 ml-4 list-decimal">
                    <li>访问：<a href="https://console.volcengine.com/ark" target="_blank" className="text-blue-400 underline">火山引擎控制台</a></li>
                    <li>进入"模型推理" → 选择对应的模型（文本/图像/视频）</li>
                    <li>点击"接入点管理" → 创建接入点 → 复制 Endpoint ID</li>
                    <li>点击右上角头像 → "API访问密钥" → 复制 API Key（以AKLT开头）</li>
                  </ol>
                  <p className="mt-3">
                    📖 详细文档：<a href="/api-key-guide" className="text-blue-400 underline">API密钥获取指南</a>
                  </p>
                </div>
              </details>

              <details className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/15 transition">
                <summary className="font-bold text-lg">
                  Q: 15个分镜大概需要多少钱？
                </summary>
                <div className="mt-3 pl-4 border-l-4 border-purple-500 text-sm opacity-90">
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-black/30 rounded p-3 text-center">
                      <p className="text-green-400 font-bold">仅提示词</p>
                      <p className="text-2xl font-bold mt-2">¥0.04</p>
                    </div>
                    <div className="bg-black/30 rounded p-3 text-center">
                      <p className="text-blue-400 font-bold">含图片</p>
                      <p className="text-2xl font-bold mt-2">¥1.24</p>
                    </div>
                    <div className="bg-black/30 rounded p-3 text-center">
                      <p className="text-purple-400 font-bold">含视频</p>
                      <p className="text-2xl font-bold mt-2">¥23.74</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs opacity-75">
                    * 以上为豆包模型参考价格，实际费用以平台计费为准
                  </p>
                </div>
              </details>

            </div>
          </div>

          <div className="glass-divider"></div>

          {/* 返回操作 */}
          <div className="text-center glass-card-strong">
            <h3 className="font-heading text-2xl mb-4">准备好开始了吗？</h3>
            <p className="font-body mb-6 opacity-90">
              按照上述步骤配置，即可体验完整的 AI 创作工作流程！
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/" className="btn-cta">
                🚀 前往主页开始配置
              </a>
              <a href="/glass-demo" className="btn-outline">
                🎨 查看设计系统演示
              </a>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
