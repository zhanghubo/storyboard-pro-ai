import { useState } from 'react'
import Head from 'next/head'
import GridSelector from '../components/GridSelector'
import StoryInput from '../components/StoryInput'
import GridEditor from '../components/GridEditor'
import PromptDisplay from '../components/PromptDisplay'
import AdvancedConfigPanel from '../components/AdvancedConfigPanel'
import { assignShotsToGrid, optimizeVisualFlow } from '../lib/shotAssignment'
import { generateAllPrompts } from '../lib/promptGenerator'
import { generateStoryboardScenes, AIConfig, GeneratedScene } from '../lib/aiService'
import { generateAllStoryboardImages, ImageConfig, ImageGenerationProgress } from '../lib/imageService'
import { generateStoryboardVideo, VideoConfig, VideoGenerationProgress } from '../lib/videoService'
import { GridCellInfo, OutputMode, AspectRatioType } from '../lib/gridConfig'
import { GeneratedPrompt } from '../lib/promptGenerator'

export default function Home() {
  const [step, setStep] = useState<'config' | 'select' | 'input' | 'edit' | 'result'>('config')
  const [aiConfig, setAIConfig] = useState<AIConfig | null>(null)
  const [imageConfig, setImageConfig] = useState<ImageConfig | null>(null)
  const [videoConfig, setVideoConfig] = useState<VideoConfig | null>(null)
  const [selectedShotCount, setSelectedShotCount] = useState<number>(15)
  const [storyText, setStoryText] = useState<string>('')
  const [stylePreference, setStylePreference] = useState<string>('电影感')
  const [outputMode, setOutputMode] = useState<OutputMode>('single')
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('16:9')
  const [gridCells, setGridCells] = useState<GridCellInfo[]>([])
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([])
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([])
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [generatedVideo, setGeneratedVideo] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [imageProgress, setImageProgress] = useState<ImageGenerationProgress | null>(null)
  const [videoProgress, setVideoProgress] = useState<VideoGenerationProgress | null>(null)
  const [error, setError] = useState<string>('')

  /**
   * 处理AI配置完成
   */
  const handleAIConfigComplete = (aiCfg: AIConfig, imageCfg?: ImageConfig, videoCfg?: VideoConfig) => {
    setAIConfig(aiCfg)
    setImageConfig(imageCfg || null)
    setVideoConfig(videoCfg || null)
    setStep('select')
  }

  /**
   * 处理网格选择
   */
  const handleGridSelect = (shotCount: number) => {
    setSelectedShotCount(shotCount)
    setStep('input')
  }

  /**
   * 处理故事提交并生成分镜（完整工作流）
   */
  const handleStorySubmit = async (story: string, style: string, mode: OutputMode, ratio: AspectRatioType) => {
    if (!aiConfig) {
      setError('请先配置AI模型')
      return
    }

    setStoryText(story)
    setStylePreference(style)
    setOutputMode(mode)
    setAspectRatio(ratio)
    setIsGenerating(true)
    setError('')
    setGeneratedImages([])
    setGeneratedVideo('')

    try {
      // ========== 步骤1: 使用AI生成场景描述 ==========
      setCurrentStep('📝 正在生成分镜描述...')
      const scenes = await generateStoryboardScenes(aiConfig, {
        storyDescription: story,
        shotCount: selectedShotCount,
        stylePreference: style,
      })

      setGeneratedScenes(scenes)

      // ========== 步骤2: 分配到网格 ==========
      setCurrentStep('📐 正在优化分镜布局...')
      const cells = assignShotsToGrid(selectedShotCount)
      const { cells: optimizedCells } = optimizeVisualFlow(selectedShotCount, cells)
      setGridCells(optimizedCells)

      // ========== 步骤3: 生成AI绘画提示词 ==========
      setCurrentStep('🎨 正在生成AI绘画提示词...')
      const sceneDescriptions = scenes.map(scene => {
        let desc = scene.description
        if (scene.characters) desc += `, ${scene.characters}`
        if (scene.environment) desc += `, ${scene.environment}`
        if (scene.action) desc += `, ${scene.action}`
        return desc
      })

      const generatedPrompts = generateAllPrompts(
        optimizedCells,
        {
          sceneDescription: story,
          styleKeywords: [style],
          lighting: 'dramatic lighting',
          colorTone: 'cinematic color grading',
          mood: 'dramatic',
        },
        sceneDescriptions,
        ratio,
        mode,
        style // 传递用户选择的风格
      )

      setPrompts(generatedPrompts)

      // ========== 步骤4: 生成分镜图片（如果启用） ==========
      if (imageConfig) {
        setCurrentStep('🖼️ 正在生成分镜图片...')
        
        // 提取所有提示词
        const imagePrompts = generatedPrompts.map(p => p.fullPrompt)
        
        // 批量生成图片
        const imageResults = await generateAllStoryboardImages(
          imageConfig,
          imagePrompts,
          ratio,
          (progress) => {
            setImageProgress(progress)
            setCurrentStep(`🖼️ 正在生成图片 ${progress.currentShot}/${progress.totalShots}...`)
          }
        )

        // 过滤成功的图片
        const successfulImages = imageResults
          .filter(result => result.success && result.imageUrl)
          .map(result => result.imageUrl)

        setGeneratedImages(successfulImages)

        // ========== 步骤5: 合成视频（如果启用） ==========
        if (videoConfig && successfulImages.length > 0) {
          setCurrentStep('🎬 正在合成视频...')
          
          // 准备视频合成配置
          const durations = generatedPrompts.map(() => 3) // 每个分镜3秒
          
          const videoResult = await generateStoryboardVideo(
            videoConfig,
            {
              imageUrls: successfulImages,
              durations: durations,
              transitions: ['fade'],
              aspectRatio: ratio,
              format: 'mp4',
            },
            (progress) => {
              setVideoProgress(progress)
              setCurrentStep(`🎬 ${progress.status}`)
            }
          )

          if (videoResult.success && videoResult.videoUrl) {
            setGeneratedVideo(videoResult.videoUrl)
            setCurrentStep('✅ 视频生成完成！')
          } else {
            console.warn('视频生成失败:', videoResult.error)
            setCurrentStep('⚠️ 视频生成失败，但图片已生成')
          }
        } else {
          setCurrentStep('✅ 图片生成完成！')
        }
      } else {
        setCurrentStep('✅ 提示词生成完成！')
      }

      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试')
      console.error('生成错误:', err)
      setCurrentStep('❌ 生成失败')
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * 返回上一步
   */
  const handleBack = () => {
    if (step === 'select') setStep('config')
    else if (step === 'input') setStep('select')
    else if (step === 'result') setStep('input')
  }

  /**
   * 重新开始
   */
  const handleReset = () => {
    setStep('select')
    setStoryText('')
    setGridCells([])
    setPrompts([])
    setGeneratedScenes([])
    setError('')
  }

  return (
    <>
      <Head>
        <title>Storyboard Grid Pro - 智能分镜网格生成器</title>
        <meta name="description" content="专业的AI驱动分镜规划工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-8">
        <div className="container mx-auto">
          {/* 头部 */}
          <header className="text-center mb-12">
            <div className="glass-card-strong mb-6 animate-fadeIn">
              <h1 className="font-heading text-6xl mb-4 text-gradient">
                🎬 Storyboard Grid Pro
              </h1>
              <p className="font-body text-xl opacity-90 mb-6">
                智能分镜网格生成器 - AI驱动的专业故事板工具
              </p>
              
              {/* 工作流程说明 */}
              <div className="flex items-center justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">📝 文字大模型</span>
                  <span className="opacity-50">→</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-success">🎨 文生图</span>
                  <span className="opacity-50">→</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning">🎬 图生视频</span>
                </div>
              </div>

              {/* 快速链接 */}
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="/workflow-check" className="btn-secondary" target="_blank">
                  🔍 工作流程指南
                </a>
                <a href="/glass-demo" className="btn-outline" target="_blank">
                  🎨 设计系统
                </a>
              </div>
            </div>
          </header>

          {/* 错误提示 */}
          {error && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* 步骤指示器 */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-4">
              {['config', 'select', 'output', 'input', 'result'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step === s
                        ? 'bg-purple-500 text-white'
                        : ['config', 'select', 'output', 'input'].indexOf(step) > i
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 4 && (
                    <div
                      className={`w-12 h-1 ${
                        ['config', 'select', 'output', 'input'].indexOf(step) > i
                          ? 'bg-green-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-16 mt-2 text-sm text-slate-300">
              <span>AI配置</span>
              <span>选择网格</span>
              <span>输出模式</span>
              <span>输入故事</span>
              <span>生成结果</span>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="max-w-7xl mx-auto">
            {step === 'config' && (
              <AdvancedConfigPanel onConfigComplete={handleAIConfigComplete} />
            )}

            {step === 'select' && (
              <GridSelector
                onSelect={handleGridSelect}
                onBack={handleBack}
              />
            )}

            {step === 'input' && (
              <>
                <StoryInput
                  onSubmit={handleStorySubmit}
                  onBack={handleBack}
                  isGenerating={isGenerating}
                  shotCount={selectedShotCount}
                />
                
                {/* 生成进度显示 */}
                {isGenerating && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border-2 border-purple-500 rounded-lg p-8 max-w-md w-full mx-4">
                      <h3 className="text-2xl font-bold text-white mb-4 text-center">
                        🎬 正在生成分镜
                      </h3>
                      
                      {/* 当前步骤 */}
                      <div className="mb-6">
                        <p className="text-lg text-purple-200 text-center font-semibold">
                          {currentStep || '准备中...'}
                        </p>
                      </div>
                      
                      {/* 图像生成进度 */}
                      {imageProgress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>图片生成进度</span>
                            <span>{imageProgress.currentShot}/{imageProgress.totalShots}</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${imageProgress.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* 视频生成进度 */}
                      {videoProgress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>视频合成进度</span>
                            <span>{videoProgress.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${videoProgress.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* 加载动画 */}
                      <div className="flex justify-center mt-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                      </div>
                      
                      <p className="text-center text-slate-400 text-sm mt-4">
                        请耐心等待，这可能需要几分钟...
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 'result' && (
              <PromptDisplay
                gridCells={gridCells}
                prompts={prompts}
                scenes={generatedScenes}
                shotCount={selectedShotCount}
                storyText={storyText}
                stylePreference={stylePreference}
                outputMode={outputMode}
                aspectRatio={aspectRatio}
                generatedImages={generatedImages}
                generatedVideo={generatedVideo}
                currentStep={currentStep}
                onBack={handleBack}
                onReset={handleReset}
              />
            )}
          </div>

          {/* 页脚 */}
          <footer className="text-center mt-16 text-slate-400 text-sm">
            <p>© 2024 Storyboard Grid Pro - 专业分镜规划工具</p>
          </footer>
        </div>
      </main>
    </>
  )
}

