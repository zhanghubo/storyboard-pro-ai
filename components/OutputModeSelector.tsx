/**
 * 输出模式选择器组件
 * 用于选择输出模式和纵横比
 */

import { useState } from 'react'
import { OutputMode, AspectRatioType, OUTPUT_MODES, ASPECT_RATIOS } from '../lib/gridConfig'

type AspectRatio = AspectRatioType
import { getOutputDescription } from '../lib/outputConfig'

interface OutputModeSelectorProps {
  shotCount: number
  onConfirm: (mode: OutputMode, aspectRatio: AspectRatio) => void
  onBack: () => void
}

export default function OutputModeSelector({ shotCount, onConfirm, onBack }: OutputModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<OutputMode>('single')
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('16:9')

  const handleConfirm = () => {
    onConfirm(selectedMode, selectedRatio)
  }

  const description = getOutputDescription({
    mode: selectedMode,
    aspectRatio: selectedRatio,
    shotCount,
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          🎨 选择输出模式
        </h2>
        <p className="text-slate-300 text-center mb-12">
          为您的 <span className="text-purple-400 font-bold">{shotCount}个</span> 分镜选择输出方式和纵横比
        </p>

        {/* 输出模式选择 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4">1️⃣ 输出模式</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OUTPUT_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedMode === mode.id
                    ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                {/* 图标 */}
                <div className="text-5xl mb-3">{mode.icon}</div>
                
                {/* 标题 */}
                <h4 className="text-xl font-bold text-white mb-2">
                  {mode.name}
                </h4>
                
                {/* 描述 */}
                <p className="text-slate-300 mb-3">{mode.description}</p>
                
                {/* 详情 */}
                <p className="text-sm text-slate-400">{mode.details}</p>

                {/* 选中标记 */}
                {selectedMode === mode.id && (
                  <div className="mt-4 flex items-center text-purple-400">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                    <span className="text-sm font-semibold">已选择</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 纵横比选择 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4">2️⃣ 纵横比</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedRatio === ratio.id
                    ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                {/* 图标 */}
                <div className="text-5xl mb-3">{ratio.icon}</div>
                
                {/* 标题 */}
                <h4 className="text-xl font-bold text-white mb-2">
                  {ratio.name}
                </h4>
                
                {/* 描述 */}
                <p className="text-slate-300 mb-2">{ratio.description}</p>
                
                {/* 尺寸 */}
                <p className="text-sm text-slate-400">
                  {selectedMode === 'single' 
                    ? `单图尺寸: ${ratio.dimensions}`
                    : `合并图尺寸: ${ratio.dimensions}`
                  }
                </p>

                {/* 选中标记 */}
                {selectedRatio === ratio.id && (
                  <div className="mt-4 flex items-center text-blue-400">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                    <span className="text-sm font-semibold">已选择</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 预览说明 */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-2">输出预览</h4>
              <p className="text-slate-200 text-lg">{description}</p>
              
              {selectedMode === 'combined' && (
                <div className="mt-4 flex items-center space-x-4">
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold">网格布局：</span>
                    {shotCount === 9 && "3行 × 3列"}
                    {shotCount === 15 && "3行 × 5列"}
                    {shotCount === 20 && "4行 × 5列"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex space-x-4">
          <button onClick={onBack} className="btn-secondary">
            ← 返回
          </button>
          <button onClick={handleConfirm} className="btn-primary flex-1">
            确认并继续 →
          </button>
        </div>

        {/* 使用场景提示 */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-white font-semibold mb-4">📌 使用场景建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold mb-2">🎞️ 独立单图模式</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• 需要单独编辑每个分镜</li>
                <li>• 用于AI绘画工具逐张生成</li>
                <li>• 方便后期调整和替换</li>
                <li>• 适合视频剪辑素材</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">🎬 汇总网格模式</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• 一次性预览所有分镜</li>
                <li>• 适合打印故事板</li>
                <li>• 方便团队评审讨论</li>
                <li>• 直观展示完整流程</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
