/**
 * 图像生成服务模块
 * 支持多个文生图API的统一接口
 */

export type ImageProvider = "doubao-image" | "stable-diffusion" | "dalle3" | "midjourney" | "none";

/**
 * 图像生成配置接口
 */
export interface ImageConfig {
  /** 服务商 */
  provider: ImageProvider;
  /** API密钥 */
  apiKey: string;
  /** 模型名称或Endpoint ID */
  model: string;
  /** API基础URL（可选） */
  baseURL?: string;
  /** 图像尺寸 */
  size?: string;
  /** 生成质量 */
  quality?: string;
}

/**
 * 图像生成响应
 */
export interface ImageResponse {
  /** 图像URL或base64 */
  imageUrl: string;
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 任务ID（用于异步生成） */
  taskId?: string;
}

/**
 * 批量图像生成进度
 */
export interface ImageGenerationProgress {
  /** 当前进度（0-100） */
  progress: number;
  /** 当前处理的分镜编号 */
  currentShot: number;
  /** 总分镜数 */
  totalShots: number;
  /** 已完成的图像URL列表 */
  completedImages: string[];
  /** 状态信息 */
  status: string;
}

/**
 * 调用火山引擎豆包文生图API（通过代理）
 */
async function callDoubaoImageAPI(
  config: ImageConfig,
  prompt: string,
  aspectRatio: string = "16:9"
): Promise<ImageResponse> {
  try {
    console.log('[图像生成] 开始生成图片');
    console.log('[图像生成] 提示词:', prompt.substring(0, 100) + '...');
    console.log('[图像生成] 宽高比:', aspectRatio);
    
    // 转换纵横比为像素尺寸
    const dimensions = aspectRatio === "16:9" 
      ? { width: 1920, height: 1080 }
      : { width: 1080, height: 1920 };

    // 使用Next.js API代理，避免CORS问题
    const response = await fetch('/api/proxy/doubao-image', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: `Bearer ${config.apiKey}`,
        endpoint: config.model, // Endpoint ID
        prompt: prompt,
        width: dimensions.width,
        height: dimensions.height,
        quality: config.quality || "high",
        n: 1,
      }),
    });

    console.log('[图像生成] 响应状态:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[图像生成] API错误:', errorData);
      throw new Error(`火山引擎图像API错误: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('[图像生成] 响应数据:', data);
    
    // 火山引擎返回图像URL或base64
    const imageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json;
    
    if (!imageUrl) {
      console.error('[图像生成] 未能获取图像URL');
      throw new Error("未能获取生成的图像");
    }

    console.log('[图像生成] ✅ 图片生成成功');
    return {
      imageUrl,
      success: true,
      taskId: data.task_id,
    };
  } catch (error) {
    console.error('[图像生成] ❌ 生成失败:', error);
    return {
      imageUrl: "",
      success: false,
      error: error instanceof Error ? error.message : "图像生成失败",
    };
  }
}

/**
 * 调用DALL-E 3 API（通过代理）
 */
async function callDALLE3API(
  config: ImageConfig,
  prompt: string,
  aspectRatio: string = "16:9"
): Promise<ImageResponse> {
  try {
    console.log('[DALL-E 3] 开始生成图片');
    const size = aspectRatio === "16:9" ? "1792x1024" : "1024x1792";
    
    // 使用Next.js API代理，避免CORS问题
    const response = await fetch('/api/proxy/openai-image', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: `Bearer ${config.apiKey}`,
        baseURL: config.baseURL,
        model: "dall-e-3",
        prompt: prompt,
        size: size,
        quality: config.quality || "hd",
        n: 1,
      }),
    });

    console.log('[DALL-E 3] 响应状态:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[DALL-E 3] API错误:', errorData);
      throw new Error(`DALL-E 3 API错误: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error("未能获取生成的图像");
    }

    console.log('[DALL-E 3] ✅ 图片生成成功');
    return {
      imageUrl,
      success: true,
    };
  } catch (error) {
    console.error('[DALL-E 3] ❌ 生成失败:', error);
    return {
      imageUrl: "",
      success: false,
      error: error instanceof Error ? error.message : "图像生成失败",
    };
  }
}

/**
 * 生成单张分镜图像
 */
export async function generateStoryboardImage(
  config: ImageConfig,
  prompt: string,
  aspectRatio: string = "16:9"
): Promise<ImageResponse> {
  switch (config.provider) {
    case "doubao-image":
      return await callDoubaoImageAPI(config, prompt, aspectRatio);
    case "dalle3":
      return await callDALLE3API(config, prompt, aspectRatio);
    default:
      return {
        imageUrl: "",
        success: false,
        error: `不支持的图像服务商: ${config.provider}`,
      };
  }
}

/**
 * 批量生成所有分镜图像
 */
export async function generateAllStoryboardImages(
  config: ImageConfig,
  prompts: string[],
  aspectRatio: string = "16:9",
  onProgress?: (progress: ImageGenerationProgress) => void
): Promise<ImageResponse[]> {
  const results: ImageResponse[] = [];
  const totalShots = prompts.length;

  for (let i = 0; i < prompts.length; i++) {
    // 更新进度
    if (onProgress) {
      onProgress({
        progress: Math.round((i / totalShots) * 100),
        currentShot: i + 1,
        totalShots,
        completedImages: results.map(r => r.imageUrl).filter(Boolean),
        status: `正在生成第 ${i + 1}/${totalShots} 张图片...`,
      });
    }

    // 生成图像
    const result = await generateStoryboardImage(config, prompts[i], aspectRatio);
    results.push(result);

    // 添加延迟避免API限流
    if (i < prompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // 完成
  if (onProgress) {
    onProgress({
      progress: 100,
      currentShot: totalShots,
      totalShots,
      completedImages: results.map(r => r.imageUrl).filter(Boolean),
      status: "图像生成完成！",
    });
  }

  return results;
}

/**
 * 验证图像配置是否有效
 */
export async function validateImageConfig(config: ImageConfig): Promise<{ success: boolean; error?: string }> {
  try {
    // 基本验证
    if (!config.apiKey || !config.apiKey.trim()) {
      return { success: false, error: "API密钥不能为空" };
    }
    if (!config.model || !config.model.trim()) {
      return { success: false, error: "模型/Endpoint ID不能为空" };
    }

    // 对于图像API，我们进行基本的格式验证而不是实际调用
    // 因为图像生成成本较高，不适合作为连接测试
    
    // 验证火山引擎 Endpoint ID 格式
    if (config.provider === 'doubao-image') {
      if (!config.model.startsWith('ep-')) {
        return { success: false, error: "火山引擎Endpoint ID应以'ep-'开头" };
      }
    }
    
    // 验证API密钥格式
    if (config.apiKey.length < 10) {
      return { success: false, error: "API密钥格式不正确" };
    }

    // 基本验证通过
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "图像API验证失败",
    };
  }
}

/**
 * 图像服务商配置
 */
export const IMAGE_PROVIDERS = [
  {
    id: "doubao-image" as ImageProvider,
    name: "火山引擎豆包-图像",
    icon: "🌋",
    description: "火山引擎文生图模型",
    models: ["ep-20241218xxxxx-xxxxx"],
    defaultModel: "ep-20241218xxxxx-xxxxx",
  },
  {
    id: "dalle3" as ImageProvider,
    name: "DALL-E 3",
    icon: "🎨",
    description: "OpenAI DALL-E 3",
    models: ["dall-e-3"],
    defaultModel: "dall-e-3",
  },
];
