/**
 * 提示词展示组件
 * 显示生成的分镜网格和提示词，支持多格式导出下载
 */

import { useState } from 'react'
import GridEditor from './GridEditor'
import { GridCellInfo, OutputMode, AspectRatioType } from '../lib/gridConfig'
import { GeneratedPrompt, SHOT_TYPE_CHINESE } from '../lib/promptGenerator'
import { GeneratedScene } from '../lib/aiService'
import { prepareExportData } from '../lib/exportUtils'
import {
  downloadMarkdown,
  downloadHTML,
  downloadDOC,
  downloadJSON,
  downloadText,
} from '../lib/downloadUtils'

interface PromptDisplayProps {
  gridCells: GridCellInfo[]
  prompts: GeneratedPrompt[]
  scenes: GeneratedScene[]
  shotCount: number
  storyText: string
  stylePreference: string
  outputMode: OutputMode
  aspectRatio: AspectRatioType
  generatedImages?: string[]
  generatedVideo?: string
  currentStep?: string
  onBack: () => void
  onReset: () => void
}

export default function PromptDisplay({
  gridCells,
  prompts,
  scenes,
  shotCount,
  storyText,
  stylePreference,
  outputMode,
  aspectRatio,
  generatedImages = [],
  generatedVideo = '',
  currentStep = '',
  onBack,
  onReset,
}: PromptDisplayProps) {
  const [selectedCell, setSelectedCell] = useState<number>(0)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  const selectedPrompt = prompts[selectedCell]
  const selectedScene = scenes[selectedCell]
  const selectedCellInfo = gridCells[selectedCell]

  /**
   * 复制提示词到剪贴板
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('✅ 提示词已复制到剪贴板')
  }

  /**
   * 复制所有提示词
   */
  const copyAllPrompts = () => {
    const allPrompts = prompts.map((p, i) => `[分镜 ${i + 1}]\n${p.fullPrompt}`).join('\n\n---\n\n')
    navigator.clipboard.writeText(allPrompts)
    alert(`✅ 已复制全部${shotCount}个提示词到剪贴板`)
  }

  /**
   * 准备导出数据
   */
  const getExportProject = () => {
    return prepareExportData(
      `故事分镜（${shotCount}镜）`,
      gridCells,
      prompts,
      stylePreference,
      'serpentine'
    )
  }

  /**
   * 处理下载
   */
  const handleDownload = (format: string) => {
    const project = getExportProject()

    switch (format) {
      case 'markdown':
        downloadMarkdown(project)
        break
      case 'html':
        downloadHTML(project)
        break
      case 'doc':
        downloadDOC(project)
        break
      case 'json':
        downloadJSON(project)
        break
      case 'text':
        downloadText(project)
        break
    }

    setShowDownloadMenu(false)
    alert(`✅ 文件下载成功！`)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 标题和操作栏 */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              🎉 分镜生成完成！
            </h2>
            <p className="text-slate-300">
              已为您生成 <span className="text-purple-400 font-bold">{shotCount}个</span> 专业分镜
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-slate-400">
                {outputMode === 'single' ? '🎴 单图模式' : '🎬 拼图模式'}
              </span>
              <span className="text-slate-400">
                {aspectRatio === '16:9' ? '⬜ 横版 16:9' : '📱 竖版 9:16'}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button onClick={onBack} className="btn-secondary">
              ← 返回编辑
            </button>
            <button onClick={onReset} className="btn-outline">
              🔄 重新开始
            </button>
          </div>
        </div>

        {/* 生成进度 */}
        {currentStep && (
          <div className="mb-6 p-4 bg-blue-500/20 border-2 border-blue-500 rounded-lg">
            <p className="text-blue-200 font-semibold text-center">{currentStep}</p>
          </div>
        )}

        {/* 未启用图像/视频生成的提示 */}
        {!generatedVideo && generatedImages.length === 0 && (
          <div className="mb-6 p-6 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500 rounded-lg">
            <h3 className="text-2xl font-bold text-yellow-200 mb-4 flex items-center">
              ⚠️ 提示：仅生成了文本提示词
            </h3>
            <p className="text-yellow-100 mb-4 text-lg">
              当前系统只生成了<strong>分镜描述</strong>和<strong>AI绘画提示词</strong>。
            </p>
            <p className="text-yellow-100 mb-6 text-lg">
              <strong>想要生成图片和视频？</strong>请按以下步骤操作：
            </p>
            
            <div className="bg-black/30 rounded-lg p-6 mb-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-2">点击下方"🔄 重新开始"按钮</p>
                  <p className="text-yellow-200">返回到配置页面</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-2">在第一步"⚙️ 完整AI配置"中</p>
                  <div className="space-y-2 text-yellow-200">
                    <p>✅ 勾选<strong className="text-white">"启用图像生成"</strong></p>
                    <p className="ml-6 text-sm">填入火山引擎图像模型的 Endpoint ID 和 API密钥</p>
                    <p>✅ 勾选<strong className="text-white">"启用视频合成"</strong>（可选）</p>
                    <p className="ml-6 text-sm">填入火山引擎视频模型的 Endpoint ID 和 API密钥</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-2">重新生成分镜</p>
                  <p className="text-yellow-200">系统将自动生成<strong className="text-white">图片</strong>和<strong className="text-white">视频</strong></p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-5 border border-purple-500/30">
              <p className="text-white font-bold mb-3 text-lg">📊 费用参考（15个分镜）：</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-green-400 font-bold text-sm mb-1">当前模式</p>
                  <p className="text-white text-2xl font-bold">¥0.04</p>
                  <p className="text-slate-300 text-xs mt-1">仅提示词</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-blue-400 font-bold text-sm mb-1">启用图像</p>
                  <p className="text-white text-2xl font-bold">¥1.24</p>
                  <p className="text-slate-300 text-xs mt-1">提示词 + 图片</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-purple-400 font-bold text-sm mb-1">完整流程</p>
                  <p className="text-white text-2xl font-bold">¥23.74</p>
                  <p className="text-slate-300 text-xs mt-1">图片 + 视频</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button onClick={onReset} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg">
                🔄 立即重新配置并生成图片/视频
              </button>
            </div>
          </div>
        )}

        {/* 视频播放器 */}
        {generatedVideo && (
          <div className="mb-6 p-6 bg-gradient-to-br from-green-900/30 to-blue-900/30 border-2 border-green-500 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              🎬 生成的故事板视频
            </h3>
            <div className="bg-black rounded-lg overflow-hidden">
              <video 
                controls 
                className="w-full max-h-96"
                src={generatedVideo}
              >
                您的浏览器不支持视频播放
              </video>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href={generatedVideo}
                download="storyboard-video.mp4"
                className="btn-primary"
              >
                ⬇️ 下载视频
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedVideo)
                  alert('视频链接已复制！')
                }}
                className="btn-secondary"
              >
                🔗 复制链接
              </button>
            </div>
          </div>
        )}

        {/* 图片画廊 */}
        {generatedImages.length > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              🖼️ 生成的分镜图片 ({generatedImages.length}张)
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`分镜 ${index + 1}`}
                    className="w-full h-auto rounded-lg border-2 border-slate-600 group-hover:border-purple-500 transition-all"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                    {index + 1}
                  </div>
                  <a
                    href={imageUrl}
                    download={`storyboard-${index + 1}.jpg`}
                    className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="下载图片"
                  >
                    ⬇️
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                generatedImages.forEach((url, i) => {
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `storyboard-${i + 1}.jpg`
                  a.click()
                })
              }}
              className="btn-primary"
            >
              📦 批量下载全部图片
            </button>
          </div>
        )}

        {/* 快捷操作按钮 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyAllPrompts}
            className="btn-primary"
          >
            📋 复制全部提示词
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="btn-primary"
            >
              💾 下载分镜脚本
            </button>

            {/* 下载菜单 */}
            {showDownloadMenu && (
              <div className="absolute top-full left-0 mt-2 bg-slate-800 border-2 border-purple-500 rounded-lg shadow-2xl z-50 min-w-[240px]">
                <div className="p-2">
                  <button
                    onClick={() => handleDownload('markdown')}
                    className="w-full text-left px-4 py-3 hover:bg-purple-900/30 rounded-lg transition-colors text-white"
                  >
                    📝 Markdown格式 (.md)
                  </button>
                  <button
                    onClick={() => handleDownload('doc')}
                    className="w-full text-left px-4 py-3 hover:bg-purple-900/30 rounded-lg transition-colors text-white"
                  >
                    📄 Word文档 (.doc)
                  </button>
                  <button
                    onClick={() => handleDownload('html')}
                    className="w-full text-left px-4 py-3 hover:bg-purple-900/30 rounded-lg transition-colors text-white"
                  >
                    🌐 网页格式 (.html)
                  </button>
                  <button
                    onClick={() => handleDownload('json')}
                    className="w-full text-left px-4 py-3 hover:bg-purple-900/30 rounded-lg transition-colors text-white"
                  >
                    🔧 JSON数据 (.json)
                  </button>
                  <button
                    onClick={() => handleDownload('text')}
                    className="w-full text-left px-4 py-3 hover:bg-purple-900/30 rounded-lg transition-colors text-white"
                  >
                    📃 纯文本 (.txt)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 网格预览 */}
      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-between">
          <span>🎬 分镜网格预览</span>
          {generatedImages.length > 0 && (
            <span className="text-sm text-green-400 font-normal">
              ✅ 已生成 {generatedImages.length} 张图片
            </span>
          )}
        </h3>
        <p className="text-slate-300 mb-6">
          {generatedImages.length > 0 
            ? '点击任意分镜查看详情 - 图片已显示在网格中' 
            : '点击任意分镜查看详情'}
        </p>
        <GridEditor
          gridCells={gridCells}
          selectedCell={selectedCell}
          onCellSelect={setSelectedCell}
          generatedImages={generatedImages}
        />
      </div>

      {/* 详细信息 */}
      {selectedPrompt && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：分镜信息 */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">
                分镜 #{selectedCellInfo.shotNumber}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                selectedCellInfo.importance === 'high' ? 'bg-purple-500 text-white' :
                selectedCellInfo.importance === 'medium' ? 'bg-blue-500 text-white' :
                'bg-slate-600 text-white'
              }`}>
                {selectedCellInfo.importance === 'high' ? '⭐ 关键帧' : 
                 selectedCellInfo.importance === 'medium' ? '🎯 标准帧' : '➡️ 过渡帧'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm">网格位置</label>
                <p className="text-white font-semibold">{selectedCellInfo.gridPosition}</p>
              </div>

              <div>
                <label className="text-slate-400 text-sm">镜头类型</label>
                <p className="text-white font-semibold">{SHOT_TYPE_CHINESE[selectedCellInfo.shotType]}</p>
              </div>

              <div>
                <label className="text-slate-400 text-sm">叙事角色</label>
                <p className="text-white font-semibold">{selectedCellInfo.role}</p>
              </div>

              {selectedCellInfo.duration && (
                <div>
                  <label className="text-slate-400 text-sm">持续时长</label>
                  <p className="text-white font-semibold">{selectedCellInfo.duration}秒</p>
                </div>
              )}

              {selectedCellInfo.act && (
                <div>
                  <label className="text-slate-400 text-sm">叙事阶段</label>
                  <p className="text-white font-semibold">{selectedCellInfo.act}</p>
                </div>
              )}

              {selectedScene && (
                <>
                  <div>
                    <label className="text-slate-400 text-sm">场景描述</label>
                    <p className="text-white">{selectedScene.description}</p>
                  </div>

                  {selectedScene.characters && (
                    <div>
                      <label className="text-slate-400 text-sm">角色信息</label>
                      <p className="text-white">{selectedScene.characters}</p>
                    </div>
                  )}

                  {selectedScene.environment && (
                    <div>
                      <label className="text-slate-400 text-sm">环境描述</label>
                      <p className="text-white">{selectedScene.environment}</p>
                    </div>
                  )}

                  {selectedScene.action && (
                    <div>
                      <label className="text-slate-400 text-sm">动作描述</label>
                      <p className="text-white">{selectedScene.action}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 右侧：AI提示词 */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">🤖 AI绘画提示词</h3>
              <button
                onClick={() => copyToClipboard(selectedPrompt.fullPrompt)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                📋 复制
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">完整提示词</label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 font-mono whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
                  {selectedPrompt.fullPrompt}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    if (selectedCell > 0) setSelectedCell(selectedCell - 1)
                  }}
                  disabled={selectedCell === 0}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← 上一个
                </button>
                <div className="flex items-center justify-center text-white font-bold">
                  {selectedCell + 1} / {shotCount}
                </div>
                <button
                  onClick={() => {
                    if (selectedCell < shotCount - 1) setSelectedCell(selectedCell + 1)
                  }}
                  disabled={selectedCell === shotCount - 1}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  下一个 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 所有提示词列表 */}
      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-6">📝 完整提示词列表</h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                index === selectedCell
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
              onClick={() => setSelectedCell(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-bold">
                  分镜 {index + 1}: {gridCells[index].role}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(prompt.fullPrompt)
                  }}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  📋 复制
                </button>
              </div>
              <p className="text-slate-300 text-sm line-clamp-2">{prompt.baseDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

