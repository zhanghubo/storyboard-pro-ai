/**
 * 智能分镜分配算法
 * 根据分镜数量和故事内容自动分配镜头到网格位置
 */

import {
  GridCellInfo,
  ShotType,
  ImportanceLevel,
  NarrativeAct,
  calculateGridPosition,
  calculateImportance,
} from "./gridConfig";

/**
 * 9分镜叙事结构映射（3x3网格）
 * 基于经典三幕式结构
 */
export const NINE_SHOT_STRUCTURE: Array<{
  row: number;
  col: number;
  shotType: ShotType;
  role: string;
  importance: ImportanceLevel;
  duration: number;
}> = [
  // 第一行：开场
  { row: 0, col: 0, shotType: "establishing", role: "世界观展示", importance: "high", duration: 5 },
  { row: 0, col: 1, shotType: "medium", role: "主角引入", importance: "high", duration: 4 },
  { row: 0, col: 2, shotType: "closeup", role: "情绪铺垫", importance: "medium", duration: 3 },

  // 第二行：发展
  { row: 1, col: 0, shotType: "medium", role: "初次尝试", importance: "medium", duration: 3 },
  { row: 1, col: 1, shotType: "closeup", role: "冲突出现", importance: "high", duration: 4 },
  { row: 1, col: 2, shotType: "wide", role: "环境变化", importance: "medium", duration: 3 },

  // 第三行：高潮与解决
  { row: 2, col: 0, shotType: "action", role: "高潮对抗", importance: "high", duration: 5 },
  { row: 2, col: 1, shotType: "closeup", role: "转折时刻", importance: "high", duration: 3 },
  { row: 2, col: 2, shotType: "establishing", role: "结局展示", importance: "high", duration: 5 },
];

/**
 * 15分镜叙事结构映射（3x5网格）
 * 扩展的三幕式结构，每幕5个分镜
 */
export const FIFTEEN_SHOT_STRUCTURE: Array<{
  row: number;
  col: number;
  shotType: ShotType;
  role: string;
  importance: ImportanceLevel;
  duration: number;
}> = [
  // 第一行：建立阶段（5个分镜）
  { row: 0, col: 0, shotType: "extreme_wide", role: "世界全景", importance: "high", duration: 5 },
  { row: 0, col: 1, shotType: "wide", role: "生活环境", importance: "medium", duration: 4 },
  { row: 0, col: 2, shotType: "medium", role: "主角日常", importance: "high", duration: 3 },
  { row: 0, col: 3, shotType: "closeup", role: "个性展示", importance: "medium", duration: 2 },
  { row: 0, col: 4, shotType: "insert", role: "关键物品", importance: "medium", duration: 2 },

  // 第二行：冲突发展（5个分镜）
  { row: 1, col: 0, shotType: "medium", role: "事件发生", importance: "high", duration: 3 },
  { row: 1, col: 1, shotType: "over_shoulder", role: "对话交流", importance: "medium", duration: 4 },
  { row: 1, col: 2, shotType: "pov", role: "主观视角", importance: "high", duration: 3 },
  { row: 1, col: 3, shotType: "dutch", role: "失衡时刻", importance: "medium", duration: 3 },
  { row: 1, col: 4, shotType: "action", role: "初次行动", importance: "medium", duration: 4 },

  // 第三行：高潮解决（5个分镜）
  { row: 2, col: 0, shotType: "low_angle", role: "危机逼近", importance: "high", duration: 3 },
  { row: 2, col: 1, shotType: "extreme_closeup", role: "情绪顶点", importance: "high", duration: 2 },
  { row: 2, col: 2, shotType: "dynamic", role: "高潮动作", importance: "high", duration: 5 },
  { row: 2, col: 3, shotType: "closeup", role: "解决瞬间", importance: "high", duration: 3 },
  { row: 2, col: 4, shotType: "wide", role: "新常态", importance: "high", duration: 5 },
];

/**
 * 20分镜史诗结构映射（4x5网格）
 * 五幕式史诗结构
 */
export const TWENTY_SHOT_STRUCTURE: Array<{
  row: number;
  col: number;
  shotType: ShotType;
  role: string;
  importance: ImportanceLevel;
  duration: number;
  act: NarrativeAct;
}> = [
  // 第一行：序幕（5个分镜）
  { row: 0, col: 0, shotType: "establishing", role: "时代背景", importance: "high", duration: 5, act: "序幕" },
  { row: 0, col: 1, shotType: "wide", role: "社会状态", importance: "medium", duration: 4, act: "序幕" },
  { row: 0, col: 2, shotType: "medium", role: "群像展示", importance: "medium", duration: 3, act: "序幕" },
  { row: 0, col: 3, shotType: "closeup", role: "预言/征兆", importance: "high", duration: 3, act: "序幕" },
  { row: 0, col: 4, shotType: "insert", role: "神秘元素", importance: "medium", duration: 2, act: "序幕" },

  // 第二行：建立（5个分镜）
  { row: 1, col: 0, shotType: "medium", role: "主角登场", importance: "high", duration: 4, act: "第一幕" },
  { row: 1, col: 1, shotType: "closeup", role: "内心展示", importance: "high", duration: 3, act: "第一幕" },
  { row: 1, col: 2, shotType: "two_shot", role: "关系建立", importance: "medium", duration: 4, act: "第一幕" },
  { row: 1, col: 3, shotType: "wide", role: "任务接受", importance: "high", duration: 4, act: "第一幕" },
  { row: 1, col: 4, shotType: "tracking", role: "踏上旅程", importance: "medium", duration: 5, act: "第一幕" },

  // 第三行：发展与转折（5个分镜）
  { row: 2, col: 0, shotType: "aerial", role: "旅程全景", importance: "medium", duration: 5, act: "第二幕" },
  { row: 2, col: 1, shotType: "medium", role: "遇到盟友", importance: "medium", duration: 4, act: "第二幕" },
  { row: 2, col: 2, shotType: "action", role: "初次考验", importance: "high", duration: 5, act: "第二幕" },
  { row: 2, col: 3, shotType: "closeup", role: "获得成长", importance: "high", duration: 3, act: "第二幕" },
  { row: 2, col: 4, shotType: "dutch", role: "重大转折", importance: "high", duration: 4, act: "第二幕" },

  // 第四行：高潮与结局（5个分镜）
  { row: 3, col: 0, shotType: "low_angle", role: "最终对抗", importance: "high", duration: 5, act: "第三幕" },
  { row: 3, col: 1, shotType: "extreme_closeup", role: "牺牲/抉择", importance: "high", duration: 3, act: "第三幕" },
  { row: 3, col: 2, shotType: "dynamic", role: "胜利时刻", importance: "high", duration: 5, act: "第三幕" },
  { row: 3, col: 3, shotType: "wide", role: "代价展示", importance: "high", duration: 4, act: "第三幕" },
  { row: 3, col: 4, shotType: "establishing", role: "新世界", importance: "high", duration: 5, act: "终幕" },
];

/**
 * 根据分镜总数获取对应的结构模板
 * @param shotCount - 分镜总数（9、15或20）
 * @returns 分镜结构模板数组
 */
export function getShotStructure(shotCount: number) {
  switch (shotCount) {
    case 9:
      return NINE_SHOT_STRUCTURE;
    case 15:
      return FIFTEEN_SHOT_STRUCTURE;
    case 20:
      return TWENTY_SHOT_STRUCTURE;
    default:
      throw new Error(`不支持的分镜数量: ${shotCount}`);
  }
}

/**
 * 为指定数量的分镜生成完整的网格单元格信息
 * @param shotCount - 分镜总数
 * @returns 网格单元格信息数组
 */
export function assignShotsToGrid(shotCount: number): GridCellInfo[] {
  const structure = getShotStructure(shotCount);
  const gridCells: GridCellInfo[] = [];

  structure.forEach((shot, index) => {
    const { row, col, shotType, role, importance, duration } = shot;
    const totalRows = shotCount === 9 ? 3 : shotCount === 15 ? 3 : 4;
    const totalCols = shotCount === 9 ? 3 : 5;

    const cellInfo: GridCellInfo = {
      shotNumber: index + 1,
      gridPosition: calculateGridPosition(row, col),
      row,
      col,
      totalRows,
      totalCols,
      totalShots: shotCount,
      shotType,
      importance,
      role,
      duration,
    };

    gridCells.push(cellInfo);
  });

  return gridCells;
}

/**
 * 视觉流动路径类型
 */
export type VisualFlowPattern = "z-pattern" | "serpentine" | "spiral";

/**
 * 为9分镜生成Z字形视觉路径
 * @param cells - 网格单元格数组
 * @returns 重新排序的单元格数组
 */
function generateZPattern(cells: GridCellInfo[]): GridCellInfo[] {
  const zPath = [
    [0, 0], [0, 1], [0, 2],
    [1, 2], [1, 1], [1, 0],
    [2, 0], [2, 1], [2, 2],
  ];

  return zPath
    .map(([r, c]) => cells.find((cell) => cell.row === r && cell.col === c))
    .filter((cell): cell is GridCellInfo => cell !== undefined);
}

/**
 * 为15分镜生成蛇形视觉路径
 * @param cells - 网格单元格数组
 * @returns 重新排序的单元格数组
 */
function generateSerpentinePattern(cells: GridCellInfo[]): GridCellInfo[] {
  const path: number[][] = [];
  // 第一行：从左到右
  for (let c = 0; c < 5; c++) path.push([0, c]);
  // 第二行：从右到左
  for (let c = 4; c >= 0; c--) path.push([1, c]);
  // 第三行：从左到右
  for (let c = 0; c < 5; c++) path.push([2, c]);

  return path
    .map(([r, c]) => cells.find((cell) => cell.row === r && cell.col === c))
    .filter((cell): cell is GridCellInfo => cell !== undefined);
}

/**
 * 为20分镜生成螺旋形视觉路径
 * @param cells - 网格单元格数组
 * @returns 重新排序的单元格数组
 */
function generateSpiralPattern(cells: GridCellInfo[]): GridCellInfo[] {
  const path: number[][] = [];
  // 外围顺时针螺旋
  // 顶部行
  for (let c = 0; c < 5; c++) path.push([0, c]);
  // 右侧列
  for (let r = 1; r < 4; r++) path.push([r, 4]);
  // 底部行（从右到左）
  for (let c = 3; c >= 0; c--) path.push([3, c]);
  // 左侧列（从下到上）
  for (let r = 2; r >= 1; r--) path.push([r, 0]);
  // 内部
  for (let c = 1; c < 4; c++) path.push([1, c]);
  for (let c = 3; c >= 1; c--) path.push([2, c]);

  return path
    .map(([r, c]) => cells.find((cell) => cell.row === r && cell.col === c))
    .filter((cell): cell is GridCellInfo => cell !== undefined);
}

/**
 * 优化视觉流动路径
 * @param shotCount - 分镜总数
 * @param cells - 网格单元格数组
 * @returns 优化后的单元格数组和路径类型
 */
export function optimizeVisualFlow(
  shotCount: number,
  cells: GridCellInfo[]
): { cells: GridCellInfo[]; pattern: VisualFlowPattern } {
  let pattern: VisualFlowPattern;
  let optimizedCells: GridCellInfo[];

  if (shotCount === 9) {
    pattern = "z-pattern";
    optimizedCells = generateZPattern(cells);
  } else if (shotCount === 15) {
    pattern = "serpentine";
    optimizedCells = generateSerpentinePattern(cells);
  } else {
    pattern = "spiral";
    optimizedCells = generateSpiralPattern(cells);
  }

  return { cells: optimizedCells, pattern };
}


