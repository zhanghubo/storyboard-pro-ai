/**
 * 下载工具模块
 * 支持DOC、Markdown、PDF等多种格式的文件生成和下载
 */

import { ExportProject } from './exportUtils'

/**
 * 下载文件到本地
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME类型
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 生成Markdown格式内容
 * @param project - 项目数据
 * @returns Markdown字符串
 */
export function generateMarkdown(project: ExportProject): string {
  let md = `# ${project.title}\n\n`
  md += `**分镜数量**: ${project.shotCount}个 (${project.gridLayout}布局)\n`
  md += `**风格**: ${project.style}\n`
  md += `**总时长**: ${project.totalDuration}\n`
  md += `**创建时间**: ${new Date(project.createdAt).toLocaleString('zh-CN')}\n\n`
  md += `---\n\n`

  // 按幕次分组（如果有）
  const shotsByAct = new Map<string, typeof project.shots>()
  project.shots.forEach((shot) => {
    const act = shot.act || '全部分镜'
    if (!shotsByAct.has(act)) {
      shotsByAct.set(act, [])
    }
    shotsByAct.get(act)!.push(shot)
  })

  shotsByAct.forEach((shots, act) => {
    md += `## ${act}\n\n`

    shots.forEach((shot) => {
      md += `### 分镜 ${shot.shotNumber}: ${shot.role}\n\n`
      md += `- **位置**: ${shot.gridPosition} (第${shot.row + 1}行, 第${shot.col + 1}列)\n`
      md += `- **类型**: ${shot.shotTypeChinese}\n`
      md += `- **时长**: ${shot.duration}\n`
      md += `- **重要性**: ${shot.importance}\n\n`
      md += `**场景描述**:\n${shot.shortPrompt}\n\n`
      md += `**完整提示词**:\n\`\`\`\n${shot.prompt}\n\`\`\`\n\n`
      md += `---\n\n`
    })
  })

  // 视觉流动信息
  md += `## 📊 视觉流动分析\n\n`
  md += `**流动模式**: ${getPatternName(project.visualFlow.pattern)}\n\n`
  md += `**镜头路径**: ${project.visualFlow.path.join(' → ')}\n\n`
  md += `**关键帧**: ${project.visualFlow.keyFrames.map((n) => `#${n}`).join(', ')}\n\n`

  if (project.visualFlow.transitions.length > 0) {
    md += `### 转场设计\n\n`
    project.visualFlow.transitions.forEach((trans) => {
      md += `- **#${trans.from} → #${trans.to}**: ${trans.type} - ${trans.description}\n`
    })
    md += `\n`
  }

  md += `---\n\n`
  md += `*由 Storyboard Grid Pro 生成*`

  return md
}

/**
 * 生成HTML格式内容（用于PDF转换或DOC）
 * @param project - 项目数据
 * @returns HTML字符串
 */
export function generateHTML(project: ExportProject): string {
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1 {
      color: #8b5cf6;
      border-bottom: 3px solid #8b5cf6;
      padding-bottom: 10px;
    }
    h2 {
      color: #6366f1;
      margin-top: 40px;
      border-left: 5px solid #6366f1;
      padding-left: 15px;
    }
    h3 {
      color: #4f46e5;
      margin-top: 30px;
    }
    .metadata {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .metadata p {
      margin: 5px 0;
    }
    .shot-card {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    .shot-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .shot-number {
      background: #8b5cf6;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
    }
    .shot-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin: 15px 0;
      padding: 15px;
      background: #faf5ff;
      border-radius: 6px;
    }
    .shot-meta-item {
      display: flex;
      flex-direction: column;
    }
    .shot-meta-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 3px;
    }
    .shot-meta-value {
      font-weight: 600;
      color: #111827;
    }
    .prompt-box {
      background: #1e293b;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 15px 0;
    }
    .importance-high { border-left: 5px solid #ef4444; }
    .importance-medium { border-left: 5px solid #3b82f6; }
    .importance-low { border-left: 5px solid #6b7280; }
    .grid-preview {
      display: grid;
      gap: 10px;
      margin: 20px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .grid-cell {
      border: 2px solid #d1d5db;
      border-radius: 6px;
      padding: 10px;
      text-align: center;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .shot-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>🎬 ${project.title}</h1>
  
  <div class="metadata">
    <p><strong>分镜数量:</strong> ${project.shotCount}个 (${project.gridLayout}布局)</p>
    <p><strong>风格:</strong> ${project.style}</p>
    <p><strong>总时长:</strong> ${project.totalDuration}</p>
    <p><strong>创建时间:</strong> ${new Date(project.createdAt).toLocaleString('zh-CN')}</p>
  </div>

  <h2>📋 分镜列表</h2>
`

  // 按幕次分组
  const shotsByAct = new Map<string, typeof project.shots>()
  project.shots.forEach((shot) => {
    const act = shot.act || '全部分镜'
    if (!shotsByAct.has(act)) {
      shotsByAct.set(act, [])
    }
    shotsByAct.get(act)!.push(shot)
  })

  shotsByAct.forEach((shots, act) => {
    html += `<h2>${act}</h2>\n`

    shots.forEach((shot) => {
      const importanceClass = `importance-${shot.importance === '高' ? 'high' : shot.importance === '中' ? 'medium' : 'low'}`
      
      html += `
  <div class="shot-card ${importanceClass}">
    <div class="shot-header">
      <h3>分镜 ${shot.shotNumber}: ${shot.role}</h3>
      <span class="shot-number">#${shot.shotNumber}</span>
    </div>
    
    <div class="shot-meta">
      <div class="shot-meta-item">
        <span class="shot-meta-label">网格位置</span>
        <span class="shot-meta-value">${shot.gridPosition}</span>
      </div>
      <div class="shot-meta-item">
        <span class="shot-meta-label">镜头类型</span>
        <span class="shot-meta-value">${shot.shotTypeChinese}</span>
      </div>
      <div class="shot-meta-item">
        <span class="shot-meta-label">时长</span>
        <span class="shot-meta-value">${shot.duration}</span>
      </div>
      <div class="shot-meta-item">
        <span class="shot-meta-label">重要性</span>
        <span class="shot-meta-value">${shot.importance}</span>
      </div>
    </div>

    <h4>场景描述</h4>
    <p>${shot.shortPrompt}</p>

    <h4>AI绘画提示词</h4>
    <div class="prompt-box">${shot.prompt}</div>
  </div>
`
    })
  })

  html += `
  <h2>📊 视觉流动分析</h2>
  <div class="metadata">
    <p><strong>流动模式:</strong> ${getPatternName(project.visualFlow.pattern)}</p>
    <p><strong>镜头路径:</strong> ${project.visualFlow.path.join(' → ')}</p>
    <p><strong>关键帧:</strong> ${project.visualFlow.keyFrames.map((n) => `#${n}`).join(', ')}</p>
  </div>
`

  if (project.visualFlow.transitions.length > 0) {
    html += `
  <h3>转场设计</h3>
  <ul>
`
    project.visualFlow.transitions.forEach((trans) => {
      html += `    <li><strong>#${trans.from} → #${trans.to}:</strong> ${trans.type} - ${trans.description}</li>\n`
    })
    html += `  </ul>\n`
  }

  html += `
  <hr style="margin: 40px 0; border: none; border-top: 2px solid #e5e7eb;">
  <p style="text-align: center; color: #6b7280; font-size: 14px;">
    由 Storyboard Grid Pro 智能生成 | ${new Date().toLocaleString('zh-CN')}
  </p>
</body>
</html>`

  return html
}

/**
 * 下载为Markdown文件
 */
export function downloadMarkdown(project: ExportProject): void {
  const content = generateMarkdown(project)
  const filename = `${project.title}_分镜脚本_${Date.now()}.md`
  downloadFile(content, filename, 'text/markdown')
}

/**
 * 下载为HTML文件
 */
export function downloadHTML(project: ExportProject): void {
  const content = generateHTML(project)
  const filename = `${project.title}_分镜脚本_${Date.now()}.html`
  downloadFile(content, filename, 'text/html')
}

/**
 * 下载为DOC文件（实际是HTML格式，可被Word打开）
 */
export function downloadDOC(project: ExportProject): void {
  const content = generateHTML(project)
  const filename = `${project.title}_分镜脚本_${Date.now()}.doc`
  // Word可以打开HTML格式的.doc文件
  downloadFile(content, filename, 'application/msword')
}

/**
 * 下载为JSON文件
 */
export function downloadJSON(project: ExportProject): void {
  const content = JSON.stringify(project, null, 2)
  const filename = `${project.title}_分镜数据_${Date.now()}.json`
  downloadFile(content, filename, 'application/json')
}

/**
 * 下载为文本文件
 */
export function downloadText(project: ExportProject): void {
  let text = `${project.title}\n`
  text += `=${'='.repeat(project.title.length)}=\n\n`
  text += `分镜数量: ${project.shotCount}个 (${project.gridLayout}布局)\n`
  text += `风格: ${project.style}\n`
  text += `总时长: ${project.totalDuration}\n`
  text += `创建时间: ${new Date(project.createdAt).toLocaleString('zh-CN')}\n\n`
  text += `${'-'.repeat(50)}\n\n`

  project.shots.forEach((shot) => {
    text += `[分镜 ${shot.shotNumber}] ${shot.role}\n`
    text += `位置: ${shot.gridPosition} | 类型: ${shot.shotTypeChinese} | 时长: ${shot.duration}\n`
    text += `场景: ${shot.shortPrompt}\n`
    text += `提示词: ${shot.prompt}\n`
    text += `\n${'-'.repeat(50)}\n\n`
  })

  const filename = `${project.title}_分镜脚本_${Date.now()}.txt`
  downloadFile(text, filename, 'text/plain')
}

/**
 * 获取流动模式的中文名称
 */
function getPatternName(pattern: string): string {
  const names: Record<string, string> = {
    'z-pattern': 'Z字形扫描',
    'serpentine': '蛇形流动',
    'spiral': '螺旋形路径',
  }
  return names[pattern] || pattern
}


