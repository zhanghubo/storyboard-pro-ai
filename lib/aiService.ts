/**
 * AI服务集成模块
 * 支持多个大模型API的统一接口
 */

/**
 * AI服务商类型
 */
export type AIProvider = "openai" | "anthropic" | "dashscope" | "zhipu" | "qianfan" | "doubao" | "deepseek" | "custom";

/**
 * AI配置接口
 */
export interface AIConfig {
  /** 服务商 */
  provider: AIProvider;
  /** API密钥 */
  apiKey: string;
  /** 模型名称/Endpoint ID */
  model: string;
  /** API基础URL（可选） */
  baseURL?: string;
  /** 温度参数 */
  temperature?: number;
  /** 最大令牌数 */
  maxTokens?: number;
  /** 文生图模型配置（可选） */
  imageModel?: {
    apiKey: string;
    endpoint: string;
    baseURL?: string;
  };
  /** 视频生成模型配置（可选） */
  videoModel?: {
    apiKey: string;
    endpoint: string;
    baseURL?: string;
  };
}

/**
 * AI响应接口
 */
export interface AIResponse {
  /** 生成的文本内容 */
  content: string;
  /** 使用的令牌数 */
  tokensUsed?: number;
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 分镜生成请求接口
 */
export interface StoryboardRequest {
  /** 故事描述 */
  storyDescription: string;
  /** 分镜数量 */
  shotCount: number;
  /** 风格偏好 */
  stylePreference?: string;
  /** 目标受众 */
  targetAudience?: string;
  /** 情绪基调 */
  mood?: string;
}

/**
 * AI生成的分镜场景
 */
export interface GeneratedScene {
  /** 场景编号 */
  sceneNumber: number;
  /** 场景描述 */
  description: string;
  /** 角色信息 */
  characters?: string;
  /** 环境描述 */
  environment?: string;
  /** 动作描述 */
  action?: string;
  /** 情绪氛围 */
  mood?: string;
}

/**
 * 调用OpenAI API
 */
async function callOpenAI(config: AIConfig, prompt: string): Promise<AIResponse> {
  try {
    console.log('[OpenAI] 模型:', config.model);
    
    // 使用Next.js API代理，避免CORS问题
    const response = await fetch('/api/proxy/openai', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: config.apiKey,
        model: config.model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的电影分镜师和视觉叙事专家，擅长将故事转化为视觉化的分镜描述。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2000,
        baseURL: config.baseURL,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;
      console.error('[OpenAI] API错误:', errorData);
      throw new Error(`OpenAI API错误 (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    console.log('[OpenAI] 调用成功');
    
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens,
      success: true,
    };
  } catch (error) {
    console.error('[OpenAI] 调用失败:', error);
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 调用Anthropic Claude API
 */
async function callAnthropic(config: AIConfig, prompt: string): Promise<AIResponse> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens || 2000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API错误: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      success: true,
    };
  } catch (error) {
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 调用DeepSeek API
 */
async function callDeepSeek(config: AIConfig, prompt: string): Promise<AIResponse> {
  try {
    const response = await fetch(config.baseURL || "https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的电影分镜师和视觉叙事专家，擅长将故事转化为视觉化的分镜描述。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API错误: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens,
      success: true,
    };
  } catch (error) {
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 调用火山引擎豆包API
 */
async function callDoubao(config: AIConfig, prompt: string): Promise<AIResponse> {
  try {
    console.log('[火山引擎豆包] Endpoint ID:', config.model);
    
    // 使用Next.js API代理，避免CORS问题
    const response = await fetch('/api/proxy/doubao', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: config.apiKey,
        model: config.model, // 火山引擎使用endpoint_id作为model参数
        messages: [
          {
            role: "system",
            content: "你是一位专业的电影分镜师和视觉叙事专家，擅长将故事转化为视觉化的分镜描述。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2000,
        baseURL: config.baseURL,
      }),
    });

    console.log('[火山引擎豆包] 响应状态:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || errorData.error || response.statusText;
      console.error('[火山引擎豆包] API错误:', errorData);
      throw new Error(`火山引擎API错误 (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    console.log('[火山引擎豆包] 调用成功');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API返回数据格式错误');
    }
    
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens,
      success: true,
    };
  } catch (error) {
    console.error('[火山引擎豆包] 调用失败:', error);
    
    // 详细的错误信息
    let errorMessage = "未知错误";
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = "网络连接失败。请检查：\n" +
                    "1. 服务器是否正常运行 (npm run dev)\n" +
                    "2. 网络连接是否正常\n" +
                    "3. Endpoint ID和API密钥是否正确";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      content: "",
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 备用方案：从文本中提取场景信息
 * 当JSON解析失败时使用
 */
function extractScenesFromText(text: string, expectedCount: number): GeneratedScene[] {
  console.log('[备用解析] 开始从文本提取场景...');
  const scenes: GeneratedScene[] = [];
  
  try {
    // 方案1：尝试查找编号标记的场景
    const scenePatterns = [
      /场景\s*(\d+)[：:]([\s\S]*?)(?=场景\s*\d+[：:]|$)/gi,
      /镜头\s*(\d+)[：:]([\s\S]*?)(?=镜头\s*\d+[：:]|$)/gi,
      /(\d+)[.、．]([\s\S]*?)(?=\d+[.、．]|$)/gi,
    ];
    
    for (const pattern of scenePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const sceneNumber = parseInt(match[1]);
        const content = match[2].trim();
        
        if (content && sceneNumber <= expectedCount) {
          scenes.push({
            sceneNumber,
            description: content.substring(0, 500),
            characters: '',
            environment: '',
            action: '',
            mood: ''
          });
        }
      }
      
      if (scenes.length >= expectedCount) {
        break;
      }
    }
    
    // 方案2：按段落分割
    if (scenes.length === 0) {
      console.log('[备用解析] 尝试按段落分割...');
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 20);
      
      for (let i = 0; i < Math.min(paragraphs.length, expectedCount); i++) {
        scenes.push({
          sceneNumber: i + 1,
          description: paragraphs[i].trim().substring(0, 500),
          characters: '',
          environment: '',
          action: '',
          mood: ''
        });
      }
    }
    
    // 方案3：生成基础场景
    if (scenes.length === 0) {
      console.log('[备用解析] 生成基础场景...');
      const lines = text.split('\n').filter(l => l.trim().length > 10);
      const linesPerScene = Math.max(1, Math.floor(lines.length / expectedCount));
      
      for (let i = 0; i < expectedCount; i++) {
        const start = i * linesPerScene;
        const end = Math.min(start + linesPerScene, lines.length);
        const description = lines.slice(start, end).join(' ').trim();
        
        if (description) {
          scenes.push({
            sceneNumber: i + 1,
            description: description.substring(0, 500),
            characters: '',
            environment: '',
            action: '',
            mood: ''
          });
        }
      }
    }
    
    console.log(`[备用解析] 成功提取 ${scenes.length} 个场景`);
    return scenes.slice(0, expectedCount);
    
  } catch (error) {
    console.error('[备用解析] 提取失败:', error);
    return [];
  }
}

/**
 * 生成分镜场景的提示词（简化优化版）
 */
function buildStoryboardPrompt(request: StoryboardRequest): string {
  const { storyDescription, shotCount, stylePreference, mood } = request;

  return `请为以下故事生成${shotCount}个分镜场景，以JSON格式返回。

故事：${storyDescription}
风格：${stylePreference || "电影感"}
情绪：${mood || "戏剧性"}

直接返回JSON（不要用\`\`\`包裹，不要有其他文字）：
{
  "scenes": [
    {"sceneNumber": 1, "description": "场景1的详细视觉描述", "characters": "角色", "environment": "环境", "action": "动作", "mood": "情绪"},
    {"sceneNumber": 2, "description": "场景2...", "characters": "...", "environment": "...", "action": "...", "mood": "..."}
  ]
}

要求：
1. scenes数组必须有${shotCount}个元素
2. 每个description要详细具体（50字以上）
3. 只返回纯JSON，不要有任何其他内容`;
}

/**
 * 使用AI生成分镜场景描述
 */
export async function generateStoryboardScenes(
  config: AIConfig,
  request: StoryboardRequest
): Promise<GeneratedScene[]> {
  const prompt = buildStoryboardPrompt(request);
  let response: AIResponse;

  // 根据服务商调用相应的API
  switch (config.provider) {
    case "openai":
      response = await callOpenAI(config, prompt);
      break;
    case "anthropic":
      response = await callAnthropic(config, prompt);
      break;
    case "deepseek":
      response = await callDeepSeek(config, prompt);
      break;
    case "doubao":
      response = await callDoubao(config, prompt);
      break;
    case "dashscope":
    case "zhipu":
    case "qianfan":
      // 这些服务商使用OpenAI兼容格式
      response = await callOpenAI(config, prompt);
      break;
    default:
      throw new Error(`不支持的AI服务商: ${config.provider}`);
  }

  if (!response.success) {
    throw new Error(`AI生成失败: ${response.error}`);
  }

  // 解析JSON响应（增强版）
  try {
    console.log('[AI响应] 开始解析，原始长度:', response.content.length);
    console.log('[AI响应] 原始内容前200字符:', response.content.substring(0, 200));
    
    // 提取JSON内容（处理多种包裹格式）
    let jsonContent = response.content.trim();
    
    // 1. 移除markdown代码块标记
    const codeBlockPatterns = [
      /```json\s*([\s\S]*?)```/i,
      /```\s*([\s\S]*?)```/,
      /`([\s\S]*?)`/
    ];
    
    for (const pattern of codeBlockPatterns) {
      const match = jsonContent.match(pattern);
      if (match && match[1]) {
        jsonContent = match[1].trim();
        console.log('[AI响应] 从代码块中提取JSON');
        break;
      }
    }
    
    // 2. 查找JSON对象的边界
    const jsonStart = jsonContent.indexOf('{');
    const jsonEnd = jsonContent.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
      console.log('[AI响应] 提取JSON对象边界');
    }
    
    // 3. 清理可能的干扰字符
    jsonContent = jsonContent
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // 移除零宽字符
      .replace(/^\s*[\r\n]/gm, '\n') // 规范化换行
      .trim();
    
    console.log('[AI响应] 清理后的JSON长度:', jsonContent.length);
    console.log('[AI响应] JSON前150字符:', jsonContent.substring(0, 150));
    
    // 4. 尝试解析JSON
    const parsed = JSON.parse(jsonContent);
    
    // 5. 验证数据结构
    if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
      console.error('[AI响应] 解析结果缺少scenes数组:', parsed);
      throw new Error('API返回格式错误：缺少scenes数组');
    }
    
    if (parsed.scenes.length === 0) {
      console.error('[AI响应] scenes数组为空');
      throw new Error('API返回了空的场景列表');
    }
    
    // 6. 补全缺失字段
    const validScenes = parsed.scenes.map((scene: any, index: number) => ({
      sceneNumber: scene.sceneNumber || index + 1,
      description: scene.description || scene.desc || scene.content || '场景描述',
      characters: scene.characters || scene.character || '',
      environment: scene.environment || scene.env || scene.setting || '',
      action: scene.action || scene.act || '',
      mood: scene.mood || scene.emotion || scene.atmosphere || ''
    }));
    
    console.log('[AI响应] ✅ 成功解析，场景数量:', validScenes.length);
    return validScenes;
    
  } catch (error) {
    console.error("❌ 解析AI响应失败:", error);
    console.error("📄 原始响应内容:");
    console.error(response.content);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // 尝试备用解析方案：从文本中提取场景信息
    console.log("⚠️ JSON解析失败，尝试备用方案...");
    try {
      const fallbackScenes = extractScenesFromText(response.content, request.shotCount);
      if (fallbackScenes.length > 0) {
        console.log("✅ 备用解析成功，提取了", fallbackScenes.length, "个场景");
        return fallbackScenes;
      }
    } catch (fallbackError) {
      console.error("❌ 备用解析失败:", fallbackError);
    }
    
    // 最终兜底方案：生成基础场景
    console.log("⚠️ 使用最终兜底方案：生成基础场景...");
    const emergencyScenes: GeneratedScene[] = [];
    for (let i = 1; i <= request.shotCount; i++) {
      emergencyScenes.push({
        sceneNumber: i,
        description: `场景${i}：${request.storyDescription}的第${i}个分镜`,
        characters: '待完善',
        environment: '待完善',
        action: '待完善',
        mood: request.mood || '待完善'
      });
    }
    
    console.log("✅ 生成了", emergencyScenes.length, "个基础场景");
    console.log("⚠️ 建议：检查API返回内容，可能需要调整提示词或更换模型");
    
    return emergencyScenes;
  }
}

/**
 * 验证API配置
 */
export async function validateAIConfig(config: AIConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const testPrompt = "请回复'OK'";
    let response: AIResponse;

    switch (config.provider) {
      case "openai":
        response = await callOpenAI(config, testPrompt);
        break;
      case "anthropic":
        response = await callAnthropic(config, testPrompt);
        break;
      case "deepseek":
        response = await callDeepSeek(config, testPrompt);
        break;
      case "doubao":
        response = await callDoubao(config, testPrompt);
        break;
      case "dashscope":
      case "zhipu":
      case "qianfan":
        response = await callOpenAI(config, testPrompt);
        break;
      default:
        return { success: false, error: "不支持的服务商" };
    }

    return { success: response.success, error: response.error };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "连接测试失败" 
    };
  }
}

/**
 * 预设的AI服务商配置
 */
export const AI_PROVIDERS = [
  {
    id: "openai" as AIProvider,
    name: "OpenAI",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    defaultModel: "gpt-4",
    description: "OpenAI GPT系列模型",
    icon: "🤖",
  },
  {
    id: "deepseek" as AIProvider,
    name: "DeepSeek",
    models: ["deepseek-chat", "deepseek-coder"],
    defaultModel: "deepseek-chat",
    description: "DeepSeek深度求索模型",
    icon: "🔍",
  },
  {
    id: "anthropic" as AIProvider,
    name: "Anthropic Claude",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
    defaultModel: "claude-3-sonnet-20240229",
    description: "Anthropic Claude系列模型",
    icon: "🧠",
  },
  {
    id: "doubao" as AIProvider,
    name: "火山引擎豆包",
    models: ["ep-20241218xxxxx-xxxxx", "自定义endpoint_id"],
    defaultModel: "ep-20241218xxxxx-xxxxx",
    description: "字节跳动火山引擎（使用endpoint_id）",
    icon: "🌋",
  },
  {
    id: "dashscope" as AIProvider,
    name: "通义千问",
    models: ["qwen-max", "qwen-plus", "qwen-turbo"],
    defaultModel: "qwen-max",
    description: "阿里云通义千问模型",
    icon: "☁️",
  },
  {
    id: "zhipu" as AIProvider,
    name: "智谱AI",
    models: ["glm-4", "glm-3-turbo"],
    defaultModel: "glm-4",
    description: "智谱AI GLM系列模型",
    icon: "⚡",
  },
];
