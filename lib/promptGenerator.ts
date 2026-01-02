/**
 * 智能提示词生成引擎
 * 基于网格位置和分镜信息生成适配AI绘画的专业提示词
 */

import {
  GridCellInfo,
  ShotType,
  ImportanceLevel,
  isCenterCell,
  isCornerCell,
} from "./gridConfig";

/**
 * 镜头类型描述映射
 */
export const SHOT_TYPE_DESCRIPTIONS: Record<ShotType, string> = {
  establishing: "Extreme wide establishing shot",
  extreme_wide: "Extreme wide shot",
  wide: "Wide shot",
  medium: "Medium shot",
  closeup: "Close-up shot",
  extreme_closeup: "Extreme close-up shot",
  over_shoulder: "Over-the-shoulder shot",
  pov: "Point of view shot (POV)",
  dutch: "Dutch angle shot (tilted camera)",
  action: "Dynamic action shot",
  low_angle: "Low angle shot (looking up)",
  high_angle: "High angle shot (looking down)",
  aerial: "Aerial drone shot",
  tracking: "Tracking shot (camera follows subject)",
  two_shot: "Two-shot (two subjects in frame)",
  insert: "Insert shot (detail/object focus)",
  dynamic: "Dynamic motion shot with camera movement",
};

/**
 * 镜头类型中文描述
 */
export const SHOT_TYPE_CHINESE: Record<ShotType, string> = {
  establishing: "环境建立镜头",
  extreme_wide: "超广角全景",
  wide: "广角镜头",
  medium: "中景镜头",
  closeup: "特写镜头",
  extreme_closeup: "大特写",
  over_shoulder: "过肩镜头",
  pov: "主观视角",
  dutch: "荷兰式倾斜镜头",
  action: "动作镜头",
  low_angle: "仰拍镜头",
  high_angle: "俯拍镜头",
  aerial: "航拍镜头",
  tracking: "跟踪镜头",
  two_shot: "双人镜头",
  insert: "插入镜头",
  dynamic: "动态运动镜头",
};

/**
 * 视觉风格映射表
 * 将中文风格名称转换为专业的英文提示词
 */
export const STYLE_KEYWORDS: Record<string, {
  keywords: string[];
  lighting: string;
  colorTone: string;
  mood: string;
  qualityTags: string[];
}> = {
  "电影感": {
    keywords: ["cinematic", "film photography", "movie scene", "cinematic composition"],
    lighting: "dramatic lighting with deep shadows",
    colorTone: "cinematic color grading, rich colors",
    mood: "dramatic and atmospheric",
    qualityTags: ["anamorphic lens", "film grain", "depth of field"]
  },
  "写实风格": {
    keywords: ["photorealistic", "ultra realistic", "lifelike", "documentary style"],
    lighting: "natural lighting, realistic shadows",
    colorTone: "true to life colors, accurate color reproduction",
    mood: "authentic and genuine",
    qualityTags: ["photorealistic details", "realistic textures", "life-like"]
  },
  "动漫风格": {
    keywords: ["anime style", "manga art", "Japanese animation", "cel shading"],
    lighting: "anime lighting style, vibrant highlights",
    colorTone: "saturated anime colors, vivid palette",
    mood: "expressive and dynamic",
    qualityTags: ["clean linework", "anime aesthetics", "studio quality animation"]
  },
  "水彩风格": {
    keywords: ["watercolor painting", "soft edges", "artistic painting", "hand painted"],
    lighting: "soft diffused lighting, gentle colors",
    colorTone: "pastel watercolor tones, flowing colors",
    mood: "gentle and dreamy",
    qualityTags: ["watercolor texture", "artistic brushstrokes", "painted aesthetic"]
  },
  "油画风格": {
    keywords: ["oil painting", "classical art style", "painterly", "fine art"],
    lighting: "classic portrait lighting, chiaroscuro",
    colorTone: "rich oil paint colors, layered tones",
    mood: "timeless and refined",
    qualityTags: ["visible brushwork", "oil paint texture", "museum quality"]
  },
  "素描风格": {
    keywords: ["pencil sketch", "charcoal drawing", "line art", "hand drawn"],
    lighting: "strong contrast, dramatic shading",
    colorTone: "monochrome, grayscale values",
    mood: "raw and expressive",
    qualityTags: ["detailed linework", "sketchy texture", "artistic rendering"]
  },
  "赛博朋克": {
    keywords: ["cyberpunk", "neon lights", "futuristic dystopia", "high tech low life"],
    lighting: "neon lighting, dramatic color contrast",
    colorTone: "neon colors, cyan and magenta",
    mood: "dark and futuristic",
    qualityTags: ["holographic effects", "urban dystopia", "tech noir"]
  },
  "蒸汽朋克": {
    keywords: ["steampunk", "Victorian era", "brass and copper", "mechanical aesthetic"],
    lighting: "warm gas lamp lighting, industrial atmosphere",
    colorTone: "sepia tones, bronze and brass colors",
    mood: "vintage mechanical",
    qualityTags: ["intricate machinery", "Victorian details", "steam powered"]
  },
  "黑白经典": {
    keywords: ["black and white", "monochrome", "film noir", "classic photography"],
    lighting: "high contrast dramatic lighting",
    colorTone: "monochrome, black and white tones",
    mood: "timeless and classic",
    qualityTags: ["film noir aesthetic", "high contrast", "classic composition"]
  },
  "梦幻唯美": {
    keywords: ["dreamy", "ethereal", "fantasy", "magical atmosphere"],
    lighting: "soft golden hour lighting, lens flare",
    colorTone: "pastel colors, soft color palette",
    mood: "dreamy and magical",
    qualityTags: ["bokeh effect", "soft focus", "ethereal atmosphere"]
  },
  "科幻未来": {
    keywords: ["science fiction", "futuristic", "high tech", "advanced technology"],
    lighting: "clean modern lighting, white balance",
    colorTone: "cool futuristic tones, metallic colors",
    mood: "advanced and sophisticated",
    qualityTags: ["futuristic design", "sleek technology", "sci-fi aesthetic"]
  },
  "恐怖惊悚": {
    keywords: ["horror", "dark atmosphere", "suspenseful", "ominous"],
    lighting: "low key lighting, deep shadows",
    colorTone: "desaturated colors, dark tones",
    mood: "tense and unsettling",
    qualityTags: ["horror atmosphere", "moody shadows", "suspenseful composition"]
  }
};

/**
 * 获取风格配置
 * @param styleName - 风格名称（中文）
 * @returns 风格配置对象
 */
export function getStyleConfig(styleName: string) {
  // 如果精确匹配
  if (STYLE_KEYWORDS[styleName]) {
    return STYLE_KEYWORDS[styleName];
  }
  
  // 如果包含关键词（模糊匹配）
  for (const [key, value] of Object.entries(STYLE_KEYWORDS)) {
    if (styleName.includes(key) || key.includes(styleName)) {
      return value;
    }
  }
  
  // 默认电影感风格
  return STYLE_KEYWORDS["电影感"];
}

/**
 * 提示词配置接口
 */
export interface PromptConfig {
  /** 故事内容/场景描述 */
  sceneDescription: string;
  /** 风格关键词 */
  styleKeywords?: string[];
  /** 光线效果 */
  lighting?: string;
  /** 色彩基调 */
  colorTone?: string;
  /** 情绪氛围 */
  mood?: string;
  /** 主角描述 */
  characterDescription?: string;
  /** 环境描述 */
  environment?: string;
  /** 额外质量标签 */
  qualityTags?: string[];
}

/**
 * 生成的提示词结果
 */
export interface GeneratedPrompt {
  /** 完整提示词 */
  fullPrompt: string;
  /** 基础描述部分 */
  baseDescription: string;
  /** 镜头技术部分 */
  technicalSpecs: string;
  /** 风格和质量部分 */
  styleAndQuality: string;
  /** 网格位置标记 */
  gridMetadata: string;
}

/**
 * 根据重要性级别添加质量增强标签
 * @param importance - 重要性级别
 * @returns 质量标签字符串
 */
function getQualityTags(importance: ImportanceLevel): string {
  const baseTags = ["cinematic", "professional photography", "high detail"];

  if (importance === "high") {
    return [...baseTags, "masterpiece", "ultra detailed", "8k resolution", "dramatic lighting"].join(", ");
  } else if (importance === "medium") {
    return [...baseTags, "detailed", "good composition"].join(", ");
  } else {
    return baseTags.join(", ");
  }
}

/**
 * 根据镜头类型添加技术指导
 * @param shotType - 镜头类型
 * @returns 技术指导字符串
 */
function getTechnicalGuidance(shotType: ShotType): string {
  const guidance: Record<ShotType, string> = {
    establishing: "establishing the scene and environment, wide composition",
    extreme_wide: "vast landscape, epic scale, showing full environment",
    wide: "full body in frame, environmental context visible",
    medium: "waist up or mid-body shot, balanced composition",
    closeup: "face and shoulders, emotional detail focus",
    extreme_closeup: "eyes or facial detail, intense emotion",
    over_shoulder: "over shoulder perspective, depth of field",
    pov: "first person perspective, immersive viewpoint",
    dutch: "tilted horizon line, unbalanced composition for tension",
    action: "motion blur, dynamic movement, energy",
    low_angle: "camera below subject looking up, heroic or threatening",
    high_angle: "camera above looking down, vulnerable or vast",
    aerial: "birds eye view, high altitude perspective",
    tracking: "smooth camera movement following subject",
    two_shot: "two subjects in frame, interaction visible",
    insert: "extreme detail of object or element, macro focus",
    dynamic: "camera in motion, kinetic energy, speed lines",
  };

  return guidance[shotType] || "";
}

/**
 * 根据叙事角色添加情境指导
 * @param role - 叙事角色
 * @returns 情境描述
 */
function getContextualGuidance(role: string): string {
  const contextMap: Record<string, string> = {
    "世界观展示": "establishing the world, atmosphere building",
    "主角引入": "introducing main character, personality visible",
    "情绪铺垫": "emotional setup, mood establishment",
    "初次尝试": "first attempt, tentative action",
    "冲突出现": "conflict emerging, tension rising",
    "环境变化": "environment shifts, situation changes",
    "高潮对抗": "climactic confrontation, intense action",
    "转折时刻": "turning point, dramatic shift",
    "结局展示": "resolution, new status quo",
    "世界全景": "grand world view, epic scope",
    "生活环境": "living environment, daily setting",
    "主角日常": "character in routine, normalcy",
    "个性展示": "personality traits visible, character quirk",
    "关键物品": "important object, MacGuffin focus",
    "事件发生": "incident occurs, story catalyst",
    "对话交流": "dialogue exchange, communication",
    "主观视角": "subjective viewpoint, personal perspective",
    "失衡时刻": "moment of imbalance, stability disrupted",
    "初次行动": "initial action, first move",
    "危机逼近": "crisis approaching, danger imminent",
    "情绪顶点": "emotional peak, feelings at maximum",
    "高潮动作": "climactic action, decisive moment",
    "解决瞬间": "resolution moment, problem solved",
    "新常态": "new normal, changed world",
  };

  return contextMap[role] || role;
}

/**
 * 生成基于网格位置的提示词
 * @param cellInfo - 网格单元格信息
 * @param config - 提示词配置
 * @param aspectRatio - 纵横比（可选，默认16:9）
 * @returns 生成的提示词对象
 */
export function generateGridPrompt(
  cellInfo: GridCellInfo,
  config: PromptConfig,
  aspectRatio: string = "16:9"
): GeneratedPrompt {
  const {
    shotNumber,
    totalShots,
    gridPosition,
    row,
    col,
    totalRows,
    totalCols,
    shotType,
    importance,
    role,
    act,
  } = cellInfo;

  const {
    sceneDescription,
    styleKeywords = ["cinematic", "film photography"],
    lighting = "natural lighting",
    colorTone = "balanced colors",
    mood = "dramatic",
    characterDescription = "",
    environment = "",
    qualityTags = [],
  } = config;

  // 1. 基础场景描述
  let baseDescription = sceneDescription;

  // 添加角色描述（如果提供）
  if (characterDescription) {
    baseDescription += `, ${characterDescription}`;
  }

  // 添加环境描述（如果提供）
  if (environment) {
    baseDescription += `, ${environment}`;
  }

  // 2. 镜头技术规格
  const shotTypeDesc = SHOT_TYPE_DESCRIPTIONS[shotType];
  const technicalGuidance = getTechnicalGuidance(shotType);
  const contextualGuidance = getContextualGuidance(role);

  const technicalSpecs = `[Shot ${shotNumber}/${totalShots}: ${shotTypeDesc}] [Grid Position: ${gridPosition}] ${technicalGuidance}, ${contextualGuidance}`;

  // 3. 风格和质量标签
  const qualityTagsStr = getQualityTags(importance);
  
  // 合并自定义质量标签和配置中的质量标签
  const allQualityTags = [...qualityTags];
  const customQualityTags = allQualityTags.length > 0 ? `, ${allQualityTags.join(", ")}` : "";

  const styleAndQuality = `${styleKeywords.join(", ")}, ${lighting}, ${colorTone}, ${mood} mood, ${qualityTagsStr}${customQualityTags}`;

  // 4. 网格位置元数据（用于系统识别）
  let gridMetadata = "";

  // 关键帧标记
  if (importance === "high") {
    gridMetadata += "[Key Frame] ";
  } else if (importance === "low") {
    gridMetadata += "[Transition Frame] ";
  }

  // 特殊位置标记
  if (isCenterCell(row, col, totalRows, totalCols)) {
    gridMetadata += "[Center Composition] ";
  }

  if (isCornerCell(row, col, totalRows, totalCols)) {
    gridMetadata += "[Corner Framing] ";
  }

  // 幕次标记（如果有）
  if (act) {
    gridMetadata += `[Act: ${act}] `;
  }

  // 5. 组合完整提示词（为图像生成优化）
  // 提示词格式：场景描述 + 风格 + 技术规格 + 质量标签
  const finalPrompt = `${baseDescription}, ${styleKeywords.join(", ")}, ${shotTypeDesc}, ${lighting}, ${colorTone}, ${mood} mood, ${qualityTagsStr}${customQualityTags}`;

  return {
    fullPrompt: finalPrompt,
    baseDescription,
    technicalSpecs,
    styleAndQuality,
    gridMetadata,
  };
}

/**
 * 批量生成所有分镜的提示词
 * @param cells - 所有网格单元格信息
 * @param baseConfig - 基础提示词配置
 * @param sceneDescriptions - 每个分镜的场景描述数组
 * @param aspectRatio - 纵横比
 * @param outputMode - 输出模式
 * @returns 生成的提示词数组
 */
export function generateAllPrompts(
  cells: GridCellInfo[],
  baseConfig: PromptConfig,
  sceneDescriptions: string[],
  aspectRatio: string = '16:9',
  outputMode: string = 'individual',
  stylePreference: string = '电影感'
): GeneratedPrompt[] {
  // 获取风格配置
  const styleConfig = getStyleConfig(stylePreference);
  
  console.log('[提示词生成] 使用风格:', stylePreference);
  console.log('[提示词生成] 风格关键词:', styleConfig.keywords);
  
  return cells.map((cell, index) => {
    const config: PromptConfig = {
      ...baseConfig,
      // 使用风格映射表中的配置
      styleKeywords: styleConfig.keywords,
      lighting: styleConfig.lighting,
      colorTone: styleConfig.colorTone,
      mood: styleConfig.mood,
      qualityTags: [...(baseConfig.qualityTags || []), ...styleConfig.qualityTags],
      sceneDescription: sceneDescriptions[index] || baseConfig.sceneDescription,
    };
    const prompt = generateGridPrompt(cell, config);
    
    // 替换纵横比参数
    prompt.fullPrompt = prompt.fullPrompt.replace('--ar 16:9', `--ar ${aspectRatio}`);
    
    // 如果是网格模式，添加额外说明
    if (outputMode === 'grid') {
      prompt.fullPrompt += `\n[注: 此分镜将与其他分镜拼接成${aspectRatio}网格大图]`;
    }
    
    return prompt;
  });
}

/**
 * 提示词模板
 */
export const PROMPT_TEMPLATES = {
  /**
   * 电影感风格模板
   */
  cinematic: {
    styleKeywords: ["cinematic", "film photography", "movie scene", "anamorphic lens"],
    lighting: "dramatic cinematic lighting",
    colorTone: "Hollywood color grading",
    qualityTags: ["35mm film", "depth of field", "bokeh"],
  },

  /**
   * 动画风格模板
   */
  animated: {
    styleKeywords: ["animated style", "studio quality", "character design"],
    lighting: "stylized lighting",
    colorTone: "vibrant saturated colors",
    qualityTags: ["detailed illustration", "concept art"],
  },

  /**
   * 纪实风格模板
   */
  documentary: {
    styleKeywords: ["documentary photography", "photojournalism", "realistic"],
    lighting: "natural available light",
    colorTone: "authentic colors",
    qualityTags: ["candid moment", "real life"],
  },

  /**
   * 科幻风格模板
   */
  scifi: {
    styleKeywords: ["sci-fi", "futuristic", "cyberpunk aesthetic"],
    lighting: "neon lighting", 
    colorTone: "cool blue and purple tones",
    qualityTags: ["high tech", "futuristic design", "holographic"],
  },

  /**
   * 奇幻风格模板
   */
  fantasy: {
    styleKeywords: ["fantasy art", "magical", "epic fantasy"],
    lighting: "mystical lighting",
    colorTone: "enchanted color palette",
    qualityTags: ["detailed fantasy world", "magical atmosphere"],
  },
};

/**
 * 应用预设模板
 * @param templateName - 模板名称
 * @returns 模板配置
 */
export function applyTemplate(
  templateName: keyof typeof PROMPT_TEMPLATES
): Partial<PromptConfig> {
  return PROMPT_TEMPLATES[templateName];
}

/**
 * 中文风格名称映射到模板
 */
const STYLE_NAME_MAP: Record<string, keyof typeof PROMPT_TEMPLATES> = {
  '电影感': 'cinematic',
  '电影': 'cinematic',
  '影视': 'cinematic',
  '动漫': 'animated',
  '动画': 'animated',
  '卡通': 'animated',
  '纪实': 'documentary',
  '写实': 'documentary',
  '真实': 'documentary',
  '科幻': 'scifi',
  '赛博朋克': 'scifi',
  '未来': 'scifi',
  '奇幻': 'fantasy',
  '魔幻': 'fantasy',
  '玄幻': 'fantasy',
};


