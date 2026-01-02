# 火山引擎豆包配置指南

## 🌋 关于火山引擎豆包

火山引擎豆包是字节跳动提供的大语言模型服务，通过方舟（Ark）平台提供API访问。

## 📝 配置步骤

### 1. 访问火山引擎控制台
访问：[https://console.volcengine.com/ark](https://console.volcengine.com/ark)

### 2. 创建推理接入点
在控制台中：
1. 选择您想使用的模型（如：Doubao-pro-4k、Doubao-lite-4k等）
2. 点击"创建推理接入点"
3. 配置接入点参数
4. 获得 **Endpoint ID**（格式如：`ep-20241218xxxxx-xxxxx`）

### 3. 获取API密钥
1. 在控制台的"API密钥管理"中创建或查看API Key
2. 复制您的API Key

### 4. 在本应用中配置

#### 配置信息：
- **AI服务商**：选择"火山引擎豆包"
- **模型Endpoint ID**：输入您的endpoint ID（如：`ep-20241218xxxxx-xxxxx`）
- **API密钥**：输入您的API Key
- **自定义API地址**（可选）：`https://ark.cn-beijing.volces.com/api/v3`

## 📌 重要说明

### Endpoint ID vs 模型名称
- ❌ **错误**：直接使用模型名称如 `doubao-pro-4k`
- ✅ **正确**：使用您创建的endpoint ID如 `ep-20241218xxxxx-xxxxx`

每个推理接入点都有唯一的endpoint ID，需要在控制台创建后获取。

### API格式
火山引擎使用OpenAI兼容的API格式，因此本应用可以直接调用。

## 🔗 相关链接

- **控制台**：https://console.volcengine.com/ark
- **API文档**：https://www.volcengine.com/docs/82379/1099455
- **模型列表**：在控制台查看可用模型

## 💡 使用建议

1. **推荐模型**：
   - `Doubao-pro-4k`：适合复杂任务，推理能力强
   - `Doubao-lite-4k`：适合简单任务，响应更快
   - `Doubao-pro-32k`：适合长文本处理

2. **区域选择**：
   - 建议选择 `cn-beijing` 区域以获得更好的访问速度

3. **测试连接**：
   - 配置完成后，点击"🔌 测试连接"按钮
   - 看到🟢绿灯表示配置成功

## ⚠️ 常见问题

### Q: 为什么需要endpoint ID？
A: 火山引擎使用推理接入点的方式管理模型访问，每个接入点都有独立的配置和监控。

### Q: endpoint ID在哪里找？
A: 在火山引擎控制台 → 模型推理 → 推理接入点列表中查看。

### Q: API密钥在哪里获取？
A: 在控制台 → API密钥管理 → 创建密钥。

### Q: 连接测试失败怎么办？
A: 检查：
- endpoint ID是否正确（格式：ep-xxxxx-xxxxx）
- API密钥是否有效
- 网络连接是否正常
- 接入点状态是否为"运行中"

## 📊 计费说明

火山引擎按Token使用量计费，具体价格请参考官方文档。建议在控制台设置用量预警。

---

*更新日期：2024-12-24*

