/**
 * 视频生成服务模块
 * 支持将分镜图像合成为视频
 */

export type VideoProvider = "doubao-video" | "runway" | "pika";

/**
 * 视频生成配置接口
 */
export interface VideoConfig {
  /** 服务商 */
  provider: VideoProvider;
  /** API密钥 */
  apiKey: string;
  /** 模型名称或Endpoint ID */
  model: string;
  /** API基础URL（可选） */
  baseURL?: string;
  /** 视频帧率 */
  fps?: number;
  /** 视频时长（秒） */
  duration?: number;
}

/**
 * 视频生成响应
 */
export interface VideoResponse {
  /** 视频URL */
  videoUrl: string;
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 任务ID（用于异步生成） */
  taskId?: string;
}

/**
 * 视频合成配置
 */
export interface VideoCompositionConfig {
  /** 图像URL列表 */
  imageUrls: string[];
  /** 每张图片的持续时间（秒） */
  durations: number[];
  /** 转场效果 */
  transitions?: string[];
  /** 背景音乐URL */
  audioUrl?: string;
  /** 视频纵横比 */
  aspectRatio: string;
  /** 输出格式 */
  format?: string;
}

/**
 * 视频生成进度
 */
export interface VideoGenerationProgress {
  /** 当前进度（0-100） */
  progress: number;
  /** 状态信息 */
  status: string;
  /** 预计剩余时间（秒） */
  estimatedTime?: number;
}

/**
 * 调用火山引擎豆包视频生成API
 */
async function callDoubaoVideoAPI(
  config: VideoConfig,
  compositionConfig: VideoCompositionConfig
): Promise<VideoResponse> {
  try {
    const baseURL = config.baseURL || "https://ark.cn-beijing.volces.com/api/v3";
    
    const response = await fetch(`${baseURL}/video/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
        model: config.model, // 使用endpoint ID
        images: compositionConfig.imageUrls,
        durations: compositionConfig.durations,
        transitions: compositionConfig.transitions || [],
        audio_url: compositionConfig.audioUrl,
        aspect_ratio: compositionConfig.aspectRatio,
        fps: config.fps || 30,
        format: compositionConfig.format || "mp4",
        }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`火山引擎视频API错误: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      videoUrl: data.video_url || "",
      success: true,
      taskId: data.task_id,
    };
  } catch (error) {
    return {
      videoUrl: "",
      success: false,
      error: error instanceof Error ? error.message : "视频生成失败",
    };
  }
}

/**
 * 生成故事板视频
 */
export async function generateStoryboardVideo(
  config: VideoConfig,
  compositionConfig: VideoCompositionConfig,
  onProgress?: (progress: VideoGenerationProgress) => void
): Promise<VideoResponse> {
  // 初始进度
  if (onProgress) {
    onProgress({
      progress: 0,
      status: "开始生成视频...",
    });
  }

  let result: VideoResponse;

  switch (config.provider) {
    case "doubao-video":
      // 更新进度
      if (onProgress) {
        onProgress({
          progress: 30,
          status: "正在合成视频...",
        });
      }
      
      result = await callDoubaoVideoAPI(config, compositionConfig);
  
      // 如果是异步任务，轮询检查状态
      if (result.success && result.taskId) {
        result = await pollVideoGenerationStatus(
          config,
          result.taskId,
          onProgress
        );
      }
      break;
      
    default:
      result = {
        videoUrl: "",
        success: false,
        error: `不支持的视频服务商: ${config.provider}`,
      };
  }

  // 完成
  if (onProgress) {
    onProgress({
      progress: 100,
      status: result.success ? "视频生成完成！" : "视频生成失败",
    });
  }

    return result;
  }

/**
 * 轮询检查视频生成状态（用于异步任务）
 */
async function pollVideoGenerationStatus(
  config: VideoConfig,
  taskId: string,
  onProgress?: (progress: VideoGenerationProgress) => void
): Promise<VideoResponse> {
  const baseURL = config.baseURL || "https://ark.cn-beijing.volces.com/api/v3";
  const maxAttempts = 60; // 最多轮询60次（5分钟）
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${baseURL}/video/generations/${taskId}`, {
        headers: {
          "Authorization": `Bearer ${config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`状态查询失败: ${response.status}`);
      }

      const data = await response.json();
      
      // 更新进度
      if (onProgress && data.progress) {
        onProgress({
          progress: 30 + Math.round(data.progress * 0.7), // 30-100%
          status: data.status_message || "正在生成视频...",
          estimatedTime: data.estimated_time,
        });
      }

      // 检查状态
      if (data.status === "completed") {
        return {
          videoUrl: data.video_url,
          success: true,
          taskId,
        };
      } else if (data.status === "failed") {
        return {
          videoUrl: "",
          success: false,
          error: data.error_message || "视频生成失败",
          taskId,
        };
    }
    
      // 等待5秒后继续轮询
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    } catch (error) {
      return {
        videoUrl: "",
        success: false,
        error: error instanceof Error ? error.message : "状态查询失败",
        taskId,
      };
    }
  }

  return {
    videoUrl: "",
    success: false,
    error: "视频生成超时",
    taskId,
  };
}

/**
 * 视频服务商配置
 */
export const VIDEO_PROVIDERS = [
  {
    id: "doubao-video" as VideoProvider,
    name: "火山引擎豆包-视频",
    icon: "🎥",
    description: "火山引擎视频生成模型",
    models: ["ep-20241218xxxxx-xxxxx"],
    defaultModel: "ep-20241218xxxxx-xxxxx",
  },
];
