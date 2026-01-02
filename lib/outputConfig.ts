/**
 * 输出配置模块
 * 处理不同输出模式和纵横比的配置
 */

import { AspectRatioType, OutputMode } from './gridConfig';

// 类型别名
type AspectRatio = AspectRatioType;

/**
 * 完整的输出配置接口
 */
export interface OutputConfig {
  /** 输出模式 */
  mode: OutputMode;
  /** 纵横比 */
  aspectRatio: AspectRatio;
  /** 分镜数量 */
  shotCount: number;
}

/**
 * 根据输出配置获取单张图片的尺寸
 * @param aspectRatio - 纵横比
 * @returns 图片尺寸
 */
export function getSingleImageDimensions(aspectRatio: AspectRatio): { width: number; height: number } {
  if (aspectRatio === "16:9") {
    return { width: 1920, height: 1080 };
  } else {
    return { width: 1080, height: 1920 };
  }
}

/**
 * 根据输出配置获取合并图片的尺寸
 * @param shotCount - 分镜数量
 * @param aspectRatio - 纵横比
 * @returns 合并后的图片尺寸
 */
export function getCombinedImageDimensions(
  shotCount: number,
  aspectRatio: AspectRatio
): { width: number; height: number; gridLayout: string } {
  // 根据分镜数量确定网格布局
  let rows: number;
  let cols: number;

  if (shotCount === 9) {
    rows = 3;
    cols = 3;
  } else if (shotCount === 15) {
    rows = 3;
    cols = 5;
  } else if (shotCount === 20) {
    rows = 4;
    cols = 5;
  } else {
    rows = 3;
    cols = 3;
  }

  // 根据纵横比调整最终尺寸
  if (aspectRatio === "16:9") {
    // 横向布局
    return {
      width: 1920,
      height: 1080,
      gridLayout: `${rows}x${cols}`,
    };
  } else {
    // 竖向布局
    return {
      width: 1080,
      height: 1920,
      gridLayout: `${rows}x${cols}`,
    };
  }
}

/**
 * 获取输出模式的描述文本
 * @param config - 输出配置
 * @returns 描述文本
 */
export function getOutputDescription(config: OutputConfig): string {
  const { mode, aspectRatio, shotCount } = config;
  const ratio = aspectRatio === "16:9" ? "横向16:9" : "竖向9:16";

  if (mode === "single") {
    return `将生成 ${shotCount} 张独立的${ratio}分镜图片`;
  } else {
    const dims = getCombinedImageDimensions(shotCount, aspectRatio);
    return `将生成 1 张${ratio}合并图片，包含 ${shotCount} 个分镜（${dims.gridLayout}网格）`;
  }
}

/**
 * 生成输出配置的元数据
 * @param config - 输出配置
 * @returns 元数据对象
 */
export function getOutputMetadata(config: OutputConfig) {
  const { mode, aspectRatio, shotCount } = config;

  if (mode === "single") {
    const dims = getSingleImageDimensions(aspectRatio);
    return {
      mode: "独立单图",
      totalImages: shotCount,
      imageSize: `${dims.width}x${dims.height}`,
      aspectRatio: aspectRatio,
      description: `${shotCount}张独立图片，每张${dims.width}x${dims.height}像素`,
    };
  } else {
    const dims = getCombinedImageDimensions(shotCount, aspectRatio);
    return {
      mode: "汇总网格",
      totalImages: 1,
      imageSize: `${dims.width}x${dims.height}`,
      aspectRatio: aspectRatio,
      gridLayout: dims.gridLayout,
      shotCount: shotCount,
      description: `1张合并图片，${dims.width}x${dims.height}像素，包含${shotCount}个分镜`,
    };
  }
}

/**
 * 验证输出配置的有效性
 * @param config - 输出配置
 * @returns 是否有效
 */
export function validateOutputConfig(config: OutputConfig): boolean {
  const validModes: OutputMode[] = ["single", "grid"];
  const validRatios: AspectRatio[] = ["16:9", "9:16"];
  const validShotCounts = [9, 15, 20];

  return (
    validModes.includes(config.mode) &&
    validRatios.includes(config.aspectRatio) &&
    validShotCounts.includes(config.shotCount)
  );
}

