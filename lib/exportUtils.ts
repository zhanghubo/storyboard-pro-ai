/**
 * 导出工具模块
 * 支持多种格式导出分镜网格和提示词
 */

import { GridCellInfo } from "./gridConfig";
import { GeneratedPrompt } from "./promptGenerator";

/**
 * 导出项目数据接口
 */
export interface ExportProject {
  /** 项目标题 */
  title: string;
  /** 分镜总数 */
  shotCount: number;
  /** 网格布局 */
  gridLayout: string;
  /** 纵横比 */
  aspectRatio: string;
  /** 总时长 */
  totalDuration: string;
  /** 风格描述 */
  style: string;
  /** 创建时间 */
  createdAt: string;
  /** 分镜数据 */
  shots: ExportShot[];
  /** 视觉流动信息 */
  visualFlow: VisualFlowData;
}

/**
 * 导出分镜数据接口
 */
export interface ExportShot {
  /** 分镜编号 */
  shotNumber: number;
  /** 网格位置 */
  gridPosition: string;
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 完整提示词 */
  prompt: string;
  /** 简短提示词 */
  shortPrompt: string;
  /** 持续时长 */
  duration: string;
  /** 镜头类型 */
  shotType: string;
  /** 镜头类型（中文） */
  shotTypeChinese: string;
  /** 重要性级别 */
  importance: string;
  /** 叙事角色 */
  role: string;
  /** 视觉焦点 */
  visualFocus: string;
  /** 幕次（可选） */
  act?: string;
}

/**
 * 视觉流动数据接口
 */
export interface VisualFlowData {
  /** 流动模式 */
  pattern: string;
  /** 路径序列 */
  path: string[];
  /** 关键帧位置 */
  keyFrames: number[];
  /** 转场信息 */
  transitions: TransitionInfo[];
}

/**
 * 转场信息接口
 */
export interface TransitionInfo {
  /** 起始分镜 */
  from: number;
  /** 目标分镜 */
  to: number;
  /** 转场类型 */
  type: string;
  /** 转场描述 */
  description: string;
}

/**
 * 导出为JSON格式
 * @param project - 项目数据
 * @returns JSON字符串
 */
export function exportToJSON(project: ExportProject): string {
  return JSON.stringify(project, null, 2);
}

/**
 * 导出为CSV格式
 * @param project - 项目数据
 * @returns CSV字符串
 */
export function exportToCSV(project: ExportProject): string {
  const headers = [
    "分镜编号",
    "网格位置",
    "行",
    "列",
    "镜头类型",
    "叙事角色",
    "重要性",
    "时长",
    "提示词",
  ];

  const rows = project.shots.map((shot) => [
    shot.shotNumber,
    shot.gridPosition,
    shot.row + 1,
    shot.col + 1,
    shot.shotTypeChinese,
    shot.role,
    shot.importance,
    shot.duration,
    `"${shot.prompt.replace(/"/g, '""')}"`, // 转义引号
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * 导出为Markdown格式
 * @param project - 项目数据
 * @returns Markdown字符串
 */
export function exportToMarkdown(project: ExportProject): string {
  let md = `# ${project.title}\n\n`;
  md += `**分镜数量**: ${project.shotCount}个 (${project.gridLayout}布局)\n`;
  md += `**风格**: ${project.style}\n`;
  md += `**总时长**: ${project.totalDuration}\n`;
  md += `**创建时间**: ${project.createdAt}\n\n`;

  md += `---\n\n`;

  // 按幕次分组（如果有）
  const shotsByAct = new Map<string, ExportShot[]>();
  project.shots.forEach((shot) => {
    const act = shot.act || "全部分镜";
    if (!shotsByAct.has(act)) {
      shotsByAct.set(act, []);
    }
    shotsByAct.get(act)!.push(shot);
  });

  shotsByAct.forEach((shots, act) => {
    md += `## ${act}\n\n`;

    shots.forEach((shot) => {
      md += `### 分镜 ${shot.shotNumber}: ${shot.role}\n\n`;
      md += `- **位置**: ${shot.gridPosition} (第${shot.row + 1}行, 第${shot.col + 1}列)\n`;
      md += `- **类型**: ${shot.shotTypeChinese}\n`;
      md += `- **时长**: ${shot.duration}\n`;
      md += `- **重要性**: ${shot.importance}\n\n`;
      md += `**提示词**:\n\`\`\`\n${shot.prompt}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });
  });

  // 视觉流动信息
  md += `## 视觉流动\n\n`;
  md += `**模式**: ${project.visualFlow.pattern}\n\n`;
  md += `**路径**: ${project.visualFlow.path.join(" → ")}\n\n`;
  md += `**关键帧**: ${project.visualFlow.keyFrames.map((n) => `#${n}`).join(", ")}\n\n`;

  if (project.visualFlow.transitions.length > 0) {
    md += `### 转场\n\n`;
    project.visualFlow.transitions.forEach((trans) => {
      md += `- **#${trans.from} → #${trans.to}**: ${trans.type} - ${trans.description}\n`;
    });
  }

  return md;
}

/**
 * 生成网格可视化的ASCII艺术
 * @param project - 项目数据
 * @returns ASCII艺术字符串
 */
export function generateGridASCII(project: ExportProject): string {
  const shots = project.shots;
  const rows = Math.max(...shots.map((s) => s.row)) + 1;
  const cols = Math.max(...shots.map((s) => s.col)) + 1;

  // 创建二维数组
  const grid: string[][] = Array.from({ length: rows }, () =>
    Array(cols).fill("")
  );

  shots.forEach((shot) => {
    grid[shot.row][shot.col] = `${shot.shotNumber.toString().padStart(2, "0")}\n${shot.shotTypeChinese.substring(0, 4)}`;
  });

  // 生成ASCII表格
  let ascii = `┌${"─".repeat(12)}${"┬─".repeat(cols - 1)}${"─".repeat(11)}┐\n`;

  grid.forEach((row, rowIndex) => {
    // 分镜编号行
    ascii += "│";
    row.forEach((cell) => {
      const lines = cell.split("\n");
      ascii += ` ${lines[0].padEnd(10)} │`;
    });
    ascii += "\n";

    // 类型行
    ascii += "│";
    row.forEach((cell) => {
      const lines = cell.split("\n");
      ascii += ` ${lines[1].padEnd(10)} │`;
    });
    ascii += "\n";

    // 分隔线
    if (rowIndex < grid.length - 1) {
      ascii += `├${"─".repeat(12)}${"┼─".repeat(cols - 1)}${"─".repeat(11)}┤\n`;
    }
  });

  ascii += `└${"─".repeat(12)}${"┴─".repeat(cols - 1)}${"─".repeat(11)}┘`;

  return ascii;
}

/**
 * 将项目数据转换为导出格式
 * @param title - 项目标题
 * @param cells - 网格单元格数组
 * @param prompts - 生成的提示词数组
 * @param style - 风格描述
 * @param pattern - 视觉流动模式
 * @returns 导出项目对象
 */
export function prepareExportData(
  title: string,
  cells: GridCellInfo[],
  prompts: GeneratedPrompt[],
  style: string,
  pattern: string
): ExportProject {
  const totalDuration = cells.reduce((sum, cell) => sum + (cell.duration || 0), 0);

  const shots: ExportShot[] = cells.map((cell, index) => {
    const prompt = prompts[index];
    return {
      shotNumber: cell.shotNumber,
      gridPosition: cell.gridPosition,
      row: cell.row,
      col: cell.col,
      prompt: prompt.fullPrompt,
      shortPrompt: prompt.baseDescription,
      duration: `${cell.duration || 3}秒`,
      shotType: cell.shotType,
      shotTypeChinese: getShotTypeChinese(cell.shotType),
      importance: getImportanceChinese(cell.importance),
      role: cell.role,
      visualFocus: cell.role,
      act: cell.act,
    };
  });

  const keyFrames = cells
    .filter((cell) => cell.importance === "high")
    .map((cell) => cell.shotNumber);

  const visualFlow: VisualFlowData = {
    pattern,
    path: cells.map((cell) => cell.gridPosition),
    keyFrames,
    transitions: generateTransitions(cells),
  };

  return {
    title,
    shotCount: cells.length,
    gridLayout: `${cells[0].totalRows}x${cells[0].totalCols}`,
    aspectRatio: "16:9",
    totalDuration: `${totalDuration}秒`,
    style,
    createdAt: new Date().toISOString(),
    shots,
    visualFlow,
  };
}

/**
 * 获取镜头类型的中文翻译
 */
function getShotTypeChinese(shotType: string): string {
  const map: Record<string, string> = {
    establishing: "环境镜头",
    extreme_wide: "超广角",
    wide: "广角",
    medium: "中景",
    closeup: "特写",
    extreme_closeup: "大特写",
    over_shoulder: "过肩",
    pov: "主观视角",
    dutch: "荷兰角度",
    action: "动作",
    low_angle: "仰拍",
    high_angle: "俯拍",
    aerial: "航拍",
    tracking: "跟踪",
    two_shot: "双人",
    insert: "插入",
    dynamic: "动态",
  };
  return map[shotType] || shotType;
}

/**
 * 获取重要性的中文翻译
 */
function getImportanceChinese(importance: string): string {
  const map: Record<string, string> = {
    high: "高",
    medium: "中",
    low: "低",
  };
  return map[importance] || importance;
}

/**
 * 生成转场信息
 */
function generateTransitions(cells: GridCellInfo[]): TransitionInfo[] {
  const transitions: TransitionInfo[] = [];

  for (let i = 0; i < cells.length - 1; i++) {
    const current = cells[i];
    const next = cells[i + 1];

    let type = "cut";
    let description = "标准切换";

    // 根据镜头类型和重要性判断转场类型
    if (current.importance === "high" && next.importance === "high") {
      type = "match_cut";
      description = "匹配切换（关键帧之间）";
    } else if (
      current.shotType === "action" &&
      next.shotType === "closeup"
    ) {
      type = "smash_cut";
      description = "快速切换（动作到情绪）";
    } else if (
      current.shotType === "wide" &&
      next.shotType === "closeup"
    ) {
      type = "gradual_zoom";
      description = "逐渐推进";
    }

    transitions.push({
      from: current.shotNumber,
      to: next.shotNumber,
      type,
      description,
    });
  }

  return transitions;
}

/**
 * 下载文件到用户设备
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME类型
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


