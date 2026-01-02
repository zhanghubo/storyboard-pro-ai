/**
 * 输出配置面板组件
 * 用于选择输出模式和纵横比
 */

import { OutputMode, AspectRatioType, OUTPUT_MODES, ASPECT_RATIOS } from '../lib/gridConfig'

interface OutputConfigPanelProps {
  shotCount: number
  selectedOutputMode: OutputMode
  selectedAspectRatio: AspectRatioType
  onOutputModeChange: (mode: OutputMode) => void
  onAspectRatioChange: (ratio: AspectRatioType) => void
}

export default function OutputConfigPanel({
  shotCount,
  selectedOutputMode,
  selectedAspectRatio,
  onOutputModeChange,
  onAspectRatioChange,
}: OutputConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* 输出模式选择 */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          📤 输出模式
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OUTPUT_MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onOutputModeChange(option.id)}
              className={`p-5 rounded-lg border-2 transition-all text-left ${
                selectedOutputMode === option.id
                  ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">{option.name}</div>
                  <div className="text-sm text-slate-300">{option.description}</div>
                </div>
              </div>
              
              {/* 模式说明 */}
              {option.id === 'single' && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs text-purple-300">
                    ✓ 生成{shotCount}个独立图片文件<br/>
                    ✓ 每张图片可单独使用<br/>
                    ✓ 适合逐个展示或编辑
                  </div>
                </div>
              )}
              
              {option.id === 'grid' && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs text-purple-300">
                    ✓ 所有分镜拼接成1张大图<br/>
                    ✓ 完整展示故事流程<br/>
                    ✓ 适合预览和打印
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 纵横比选择 */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          📐 画面比例
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASPECT_RATIOS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onAspectRatioChange(option.id)}
              className={`p-5 rounded-lg border-2 transition-all text-left ${
                selectedAspectRatio === option.id
                  ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">{option.name}</div>
                  <div className="text-sm text-slate-300">
                    分辨率: {option.width} × {option.height}
                  </div>
                </div>
              </div>

              {/* 比例预览 */}
              <div className="mt-3 pt-3 border-t border-slate-700">
                {option.id === '16:9' ? (
                  <div className="bg-slate-700 rounded" style={{ height: '40px', width: '71px' }}>
                    <div className="h-full w-full border-2 border-purple-400 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-slate-700 rounded inline-block" style={{ height: '71px', width: '40px' }}>
                    <div className="h-full w-full border-2 border-purple-400 rounded"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 输出说明 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">📝 当前配置</h4>
        <div className="text-sm text-slate-300 space-y-1">
          <p>
            • <span className="text-purple-300">输出模式:</span>{' '}
            {selectedOutputMode === 'single' 
              ? `连续${shotCount}张单图` 
              : `${shotCount}张拼接成1张大图`}
          </p>
          <p>
            • <span className="text-purple-300">画面比例:</span>{' '}
            {selectedAspectRatio === '16:9' ? '横版 16:9' : '竖版 9:16'}
          </p>
          <p>
            • <span className="text-purple-300">适用场景:</span>{' '}
            {selectedAspectRatio === '16:9' 
              ? '电脑、电视、投影等横屏设备' 
              : '手机、平板竖屏、短视频平台'}
          </p>
        </div>
      </div>
    </div>
  )
}

