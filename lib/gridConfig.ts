/**
 * 分镜网格配置系统
 * 定义9/15/20个分镜的网格布局规格
 */

/**
 * 纵横比类型
 */
export type AspectRatioType = "16:9" | "9:16";

/**
 * 输出模式类型
 */
export type OutputMode = "single" | "grid";

/**
 * 网格布局配置接口
 */
export interface GridConfig {
  /** 布局描述（如 "3x3"） */
  layout: string;
  /** 行数 */
  rows: number;
  /** 列数 */
  columns: number;
  /** 纵横比 */
  aspectRatio: AspectRatioType;
  /** 输出尺寸 (16:9) */
  dimensions: {
    width: number;
    height: number;
  };
  /** 输出尺寸 (9:16) */
  dimensionsVertical: {
    width: number;
    height: number;
  };
  /** 缩略图尺寸 */
  thumbnailSize: string;
  /** 单元格间距 */
  gap: number;
  /** 边框宽度 */
  borderWidth: number;
}

/**
 * 分镜网格预设配置
 * 支持9、15、20个分镜的标准网格布局
 */
export const GRID_CONFIG: Record<number, GridConfig> = {
  9: {
    layout: "3x3",
    rows: 3,
    columns: 3,
    aspectRatio: "16:9",
    dimensions: { width: 1920, height: 1080 },
    dimensionsVertical: { width: 1080, height: 1920 },
    thumbnailSize: "640x360",
    gap: 12,
    borderWidth: 2,
  },
  15: {
    layout: "3x5",
    rows: 3,
    columns: 5,
    aspectRatio: "16:9",
    dimensions: { width: 1920, height: 1080 },
    dimensionsVertical: { width: 1080, height: 1920 },
    thumbnailSize: "384x216",
    gap: 12,
    borderWidth: 2,
  },
  20: {
    layout: "4x5",
    rows: 4,
    columns: 5,
    aspectRatio: "16:9",
    dimensions: { width: 1920, height: 1080 },
    dimensionsVertical: { width: 1080, height: 1920 },
    thumbnailSize: "384x216",
    gap: 12,
    borderWidth: 2,
  },
};

/**
 * 输出模式配置
 */
export const OUTPUT_MODES = [
  {
    id: "single" as OutputMode,
    name: "单图模式",
    icon: "🎴",
    description: "生成多张独立的分镜图片",
  },
  {
    id: "grid" as OutputMode,
    name: "拼图模式",
    icon: "🎬",
    description: "将所有分镜汇集在一张大图中",
  },
];

/**
 * 纵横比配置
 */
export const ASPECT_RATIOS = [
  {
    id: "16:9" as AspectRatioType,
    name: "横版 16:9",
    icon: "⬜",
    width: 1920,
    height: 1080,
  },
  {
    id: "9:16" as AspectRatioType,
    name: "竖版 9:16",
    icon: "📱",
    width: 1080,
    height: 1920,
  },
];

/**
 * 网格布局选项
 */
export const GRID_OPTIONS = [
  {
    value: 9,
    label: "快速叙事",
    sublabel: "3x3网格",
    icon: "⚡",
    description: "适合短视频、广告",
    color: "#3b82f6",
  },
  {
    value: 15,
    label: "标准叙事",
    sublabel: "3x5网格",
    icon: "🎬",
    description: "适合短片、预告片",
    color: "#8b5cf6",
  },
  {
    value: 20,
    label: "史诗叙事",
    sublabel: "4x5网格",
    icon: "🏰",
    description: "适合长视频、电影场景",
    color: "#ec4899",
  },
];

/**
 * 镜头类型定义
 */
export type ShotType =
  | "establishing"
  | "extreme_wide"
  | "wide"
  | "medium"
  | "closeup"
  | "extreme_closeup"
  | "over_shoulder"
  | "pov"
  | "dutch"
  | "action"
  | "low_angle"
  | "high_angle"
  | "aerial"
  | "tracking"
  | "two_shot"
  | "insert"
  | "dynamic";

/**
 * 镜头重要性级别
 */
export type ImportanceLevel = "high" | "medium" | "low";

/**
 * 叙事阶段
 */
export type NarrativeAct = "序幕" | "第一幕" | "第二幕" | "第三幕" | "终幕";

/**
 * 网格单元格信息接口
 */
export interface GridCellInfo {
  /** 分镜编号（从1开始） */
  shotNumber: number;
  /** 网格位置（如 "A1"） */
  gridPosition: string;
  /** 行索引（从0开始） */
  row: number;
  /** 列索引（从0开始） */
  col: number;
  /** 总行数 */
  totalRows: number;
  /** 总列数 */
  totalCols: number;
  /** 总分镜数 */
  totalShots: number;
  /** 镜头类型 */
  shotType: ShotType;
  /** 重要性级别 */
  importance: ImportanceLevel;
  /** 叙事角色 */
  role: string;
  /** 持续时长（秒） */
  duration?: number;
  /** 叙事阶段 */
  act?: NarrativeAct;
  /** 纵横比 */
  aspectRatio?: AspectRatioType;
  /** 输出模式 */
  outputMode?: OutputMode;
}

/**
 * 计算网格位置标识（如 "A1", "B3"）
 * @param row - 行索引（从0开始）
 * @param col - 列索引（从0开始）
 * @returns 网格位置标识
 */
export function calculateGridPosition(row: number, col: number): string {
  const rowLabel = String.fromCharCode(65 + row); // A, B, C, ...
  const colLabel = (col + 1).toString(); // 1, 2, 3, ...
  return `${rowLabel}${colLabel}`;
}

/**
 * 判断是否为中心单元格
 * @param row - 行索引
 * @param col - 列索引
 * @param totalRows - 总行数
 * @param totalCols - 总列数
 * @returns 是否为中心单元格
 */
export function isCenterCell(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
): boolean {
  const centerRow = Math.floor(totalRows / 2);
  const centerCol = Math.floor(totalCols / 2);
  return row === centerRow && col === centerCol;
}

/**
 * 判断是否为角落单元格
 * @param row - 行索引
 * @param col - 列索引
 * @param totalRows - 总行数
 * @param totalCols - 总列数
 * @returns 是否为角落单元格
 */
export function isCornerCell(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
): boolean {
  const isTopOrBottom = row === 0 || row === totalRows - 1;
  const isLeftOrRight = col === 0 || col === totalCols - 1;
  return isTopOrBottom && isLeftOrRight;
}

/**
 * 计算单元格的重要性级别
 * @param row - 行索引
 * @param col - 列索引
 * @param totalRows - 总行数
 * @param totalCols - 总列数
 * @returns 重要性级别
 */
export function calculateImportance(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
): ImportanceLevel {
  // 关键位置：第一个、最后一个、中心
  if (
    (row === 0 && col === 0) ||
    (row === totalRows - 1 && col === totalCols - 1) ||
    isCenterCell(row, col, totalRows, totalCols)
  ) {
    return "high";
  }

  // 过渡位置：中间行列
  const midRow = Math.floor(totalRows / 2);
  const midCol = Math.floor(totalCols / 2);
  if (row === midRow || col === midCol) {
    return "medium";
  }

  return "low";
}

