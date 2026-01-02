/**
 * 网格选择器组件
 * 用于选择分镜数量和网格布局
 */

import { GRID_OPTIONS } from '../lib/gridConfig'

interface GridSelectorProps {
  onSelect: (shotCount: number) => void
  onBack: () => void
}

export default function GridSelector({ onSelect, onBack }: GridSelectorProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="card animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          选择分镜网格布局
        </h2>
        <p className="text-slate-300 text-center mb-12">
          根据您的项目需求选择合适的分镜数量
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {GRID_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="group relative bg-slate-800 border-2 border-slate-600 rounded-xl p-8 hover:border-purple-500 hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
            >
              {/* 图标 */}
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                {option.icon}
              </div>

              {/* 标题 */}
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                {option.label}
              </h3>

              {/* 副标题 */}
              <p className="text-lg text-purple-300 mb-4 text-center">
                {option.sublabel}
              </p>

              {/* 描述 */}
              <p className="text-slate-400 text-center mb-6">
                {option.description}
              </p>

              {/* 分镜数 */}
              <div className="text-center">
                <span className="inline-block bg-purple-900/50 text-purple-300 px-6 py-2 rounded-full font-bold">
                  {option.value}个分镜
                </span>
              </div>

              {/* 网格预览 */}
              <div className="mt-6 flex justify-center">
                <div 
                  className="grid gap-1" 
                  style={{
                    gridTemplateColumns: `repeat(${option.value === 9 ? 3 : 5}, 1fr)`,
                    gridTemplateRows: `repeat(${option.value === 9 ? 3 : option.value === 15 ? 3 : 4}, 1fr)`
                  }}
                >
                  {Array.from({ length: option.value }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-2 bg-purple-500 rounded-sm group-hover:bg-purple-400 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 返回按钮 */}
        <div className="flex justify-center">
          <button onClick={onBack} className="btn-secondary">
            ← 返回配置
          </button>
        </div>
      </div>
    </div>
  )
}
