/**
 * 故事输入组件
 * 用于输入故事内容和设置风格偏好
 */

import { useState } from 'react'
import OutputSettings from './OutputSettings'
import { OutputMode, AspectRatioType } from '../lib/gridConfig'

interface StoryInputProps {
  onSubmit: (story: string, style: string, outputMode: OutputMode, aspectRatio: AspectRatioType) => void
  onBack: () => void
  isGenerating: boolean
  shotCount: number
}

const STYLE_PRESETS = [
  { id: 'cinematic', name: '电影感', icon: '🎬', description: '好莱坞电影风格，戏剧性光影' },
  { id: 'animated', name: '动画风格', icon: '🎨', description: '卡通/动画风格，鲜艳色彩' },
  { id: 'documentary', name: '纪实风格', icon: '📹', description: '真实自然，纪录片质感' },
  { id: 'scifi', name: '科幻风格', icon: '🚀', description: '未来感，科技氛围' },
  { id: 'fantasy', name: '奇幻风格', icon: '🔮', description: '魔法神秘，史诗奇幻' },
]

export default function StoryInput({ onSubmit, onBack, isGenerating, shotCount }: StoryInputProps) {
  const [storyText, setStoryText] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('cinematic')
  const [outputMode, setOutputMode] = useState<OutputMode>('single')
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('16:9')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (storyText.trim()) {
      onSubmit(storyText, selectedStyle, outputMode, aspectRatio)
    }
  }

  const selectedStyleInfo = STYLE_PRESETS.find(s => s.id === selectedStyle)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-6">
          ✍️ 输入您的故事
        </h2>
        <p className="text-slate-300 mb-8">
          描述您想要呈现的故事，AI将为您生成 <span className="text-purple-400 font-bold">{shotCount}个</span> 专业分镜
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 故事文本输入 */}
          <div>
            <label className="block text-white font-semibold mb-3 text-lg">
              故事描述
            </label>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="textarea-field"
              placeholder="请详细描述您的故事情节，包括角色、场景、情节发展等...&#10;&#10;示例：一个年轻的程序员深夜在办公室工作，突然发现自己编写的AI程序有了自我意识。两者开始了一场关于存在意义的对话，最终程序员决定给予AI自由选择的权利..."
              rows={10}
              required
              disabled={isGenerating}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-slate-400">
                详细的描述将帮助AI生成更精准的分镜
              </p>
              <p className="text-sm text-slate-400">
                {storyText.length} 字符
              </p>
            </div>
          </div>

          {/* 输出配置 */}
          <OutputSettings
            shotCount={shotCount}
            outputMode={outputMode}
            aspectRatio={aspectRatio}
            onOutputModeChange={setOutputMode}
            onAspectRatioChange={setAspectRatio}
          />

          {/* 风格选择 */}
          <div>
            <label className="block text-white font-semibold mb-3 text-lg">
              🎨 视觉风格
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  disabled={isGenerating}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <div className="font-bold text-white mb-1">{style.name}</div>
                  <div className="text-xs text-slate-400">{style.description}</div>
                </button>
              ))}
            </div>
            {selectedStyleInfo && (
              <div className="mt-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-200">
                  <span className="font-semibold">已选择：</span>
                  {selectedStyleInfo.name} - {selectedStyleInfo.description}
                </p>
              </div>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary"
              disabled={isGenerating}
            >
              ← 返回
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isGenerating || !storyText.trim()}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <span className="loading-spinner w-5 h-5 mr-2" />
                  AI正在生成分镜...
                </span>
              ) : (
                `🚀 生成${shotCount}个分镜`
              )}
            </button>
          </div>
        </form>

        {/* 提示信息 */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-white font-semibold mb-3">💡 写作建议</h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• 描述主要角色的外貌、性格特征</li>
            <li>• 说明故事发生的时间、地点、环境</li>
            <li>• 清晰阐述情节发展和转折点</li>
            <li>• 提及想要表达的情绪和氛围</li>
            <li>• 字数建议：200-1000字</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

