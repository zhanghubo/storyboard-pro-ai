/**
 * 输出设置组件
 * 用于配置输出模式和纵横比
 */

import { OutputMode, AspectRatioType, OUTPUT_MODES, ASPECT_RATIOS } from '../lib/gridConfig'

interface OutputSettingsProps {
  outputMode: OutputMode
  aspectRatio: AspectRatioType
  onOutputModeChange: (mode: OutputMode) => void
  onAspectRatioChange: (ratio: AspectRatioType) => void
  shotCount: number
}

export default function OutputSettings({
  outputMode,
  aspectRatio,
  onOutputModeChange,
  onAspectRatioChange,
  shotCount,
}: OutputSettingsProps) {
  return (
    <div className="space-y-6">
      {/* 输出模式选择 */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          📤 输出模式
        </label>
        <div className="grid grid-cols-2 gap-4">
          {OUTPUT_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onOutputModeChange(mode.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                outputMode === mode.id
                  ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="text-4xl mb-3">{mode.icon}</div>
              <div className="font-bold text-white mb-2">{mode.name}</div>
              <div className="text-sm text-slate-400">{mode.description}</div>
              
              {/* 示例说明 */}
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-300">
                  {mode.id === 'single' 
                    ? `生成${shotCount}张独立图片`
                    : `生成1张包含${shotCount}个分镜的大图`
                  }
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 纵横比选择 */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          📐 画面比例
        </label>
        <div className="grid grid-cols-2 gap-4">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onAspectRatioChange(ratio.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                aspectRatio === ratio.id
                  ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="text-4xl mb-3">{ratio.icon}</div>
              <div className="font-bold text-white mb-2">{ratio.name}</div>
              <div className="text-sm text-slate-400">
                {ratio.width} × {ratio.height}
              </div>
              
              {/* 视觉预览 */}
              <div className="mt-4 flex justify-center">
                <div 
                  className="border-2 border-purple-400 rounded"
                  style={{
                    width: ratio.id === '16:9' ? '80px' : '45px',
                    height: ratio.id === '16:9' ? '45px' : '80px',
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 输出预览说明 */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">📋 输出说明</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          {outputMode === 'single' ? (
            <>
              <li>• 将生成 <strong className="text-purple-300">{shotCount}张</strong> 独立的 {aspectRatio} 分镜图片</li>
              <li>• 每张图片可单独用于AI绘画工具（Midjourney、Stable Diffusion等）</li>
              <li>• 适合需要高质量单张输出的场景</li>
            </>
          ) : (
            <>
              <li>• 将生成 <strong className="text-purple-300">1张</strong> 包含{shotCount}个分镜的 {aspectRatio} 拼图</li>
              <li>• 所有分镜按网格排列在一张大图中</li>
              <li>• 适合预览完整故事板或打印输出</li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}


