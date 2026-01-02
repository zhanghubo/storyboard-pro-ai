# 🔧 API连接故障排查指南

## ❌ "Failed to fetch" 错误

这是最常见的API连接错误。以下是完整的解决方案。

---

## 🔍 原因分析

### 1. CORS跨域问题 ⭐ 最常见
浏览器直接调用第三方API会被CORS策略阻止。

**解决方案：** 我已经为您创建了API代理！

### 2. 网络连接问题
网络不稳定或无法访问API服务器。

### 3. API配置错误
- Endpoint ID格式错误
- API密钥无效
- Base URL不正确

### 4. 账户问题
- 余额不足
- API配额用尽
- 账户被限制

---

## ✅ 解决方案

### 方案1：使用API代理（推荐）✨

我已经为火山引擎豆包创建了API代理，自动避免CORS问题。

**检查代理是否生效：**
1. 打开浏览器开发者工具（F12）
2. 切换到"Network"（网络）标签
3. 点击"🔌 测试"按钮
4. 查看请求地址：
   - ✅ 正确：`/api/proxy/doubao`
   - ❌ 错误：`https://ark.cn-beijing.volces.com/...`

### 方案2：检查配置

#### 火山引擎豆包配置检查清单：

**Endpoint ID：**
- ✅ 格式：`ep-20241218xxxxx-xxxxx`
- ✅ 以 `ep-` 开头
- ✅ 包含日期和随机字符
- ❌ 不是：`doubao-pro-4k`（这是模型名，不是Endpoint ID）

**API密钥：**
- ✅ 格式：长字符串
- ✅ 没有空格
- ✅ 完整复制，没有截断

**Base URL：**
- ✅ 默认：`https://ark.cn-beijing.volces.com/api/v3`
- ✅ 或者留空（使用默认值）

### 方案3：网络诊断

#### 步骤1：检查服务器状态
```bash
# 确保开发服务器正在运行
npm run dev
```

访问：http://localhost:3000
- ✅ 能打开 → 服务器正常
- ❌ 打不开 → 重启服务器

#### 步骤2：查看浏览器控制台
1. 按 `F12` 打开开发者工具
2. 切换到 `Console`（控制台）标签
3. 查看错误信息：

**常见错误类型：**

```javascript
// CORS错误
❌ Access to fetch at 'https://ark...' has been blocked by CORS policy

解决：使用API代理（已自动配置）
```

```javascript
// 网络错误
❌ Failed to fetch
❌ net::ERR_CONNECTION_REFUSED

解决：检查网络连接，确保服务器运行
```

```javascript
// 认证错误
❌ 401 Unauthorized
❌ 403 Forbidden

解决：检查API密钥是否正确
```

```javascript
// 参数错误
❌ 400 Bad Request
❌ Invalid model

解决：检查Endpoint ID格式
```

### 方案4：逐步测试

#### 测试1：基本连接
1. 在配置页面填入API信息
2. 点击"🔌 测试"按钮
3. 观察结果：
   - ✅ 绿色"✓ 连接成功" → 配置正确
   - ❌ 红色"✗ 连接失败" → 继续排查

#### 测试2：查看详细日志
打开浏览器控制台（F12），查看日志：

```javascript
// 正常流程
[火山引擎豆包] Endpoint ID: ep-xxxxx-xxxxx
[代理] 转发请求到: https://ark...
[代理] API响应状态: 200
[代理] 请求成功
[火山引擎豆包] 调用成功
```

```javascript
// 错误流程
[火山引擎豆包] Endpoint ID: ep-xxxxx-xxxxx
[代理] 转发请求到: https://ark...
[代理] API错误: { error: { message: "..." } }
[火山引擎豆包] 调用失败
```

---

## 🎯 常见问题解答

### Q1: 为什么一直显示"Failed to fetch"？

**A:** 检查以下几点：

1. **服务器是否运行？**
   ```bash
   npm run dev
   ```
   应该显示：`✓ Ready in XXXXms`

2. **Endpoint ID是否正确？**
   - 必须是 `ep-` 开头
   - 从火山引擎控制台复制的完整ID

3. **API密钥是否有效？**
   - 没有空格
   - 完整复制
   - 账户有余额

### Q2: 测试按钮一直转圈？

**A:** 这说明请求卡住了：

1. 检查网络连接
2. 检查API地址是否可访问
3. 查看浏览器控制台的错误信息
4. 尝试刷新页面

### Q3: 显示401或403错误？

**A:** 认证失败：

1. **API密钥错误**
   - 重新从火山引擎控制台复制
   - 确保没有多余的空格

2. **账户问题**
   - 检查账户余额
   - 确认API服务已开通
   - 查看是否有使用限制

### Q4: 显示404错误？

**A:** API地址不对：

1. **检查Endpoint ID**
   - 确保推理接入点已创建
   - Endpoint ID必须存在

2. **检查Base URL**
   - 默认：`https://ark.cn-beijing.volces.com/api/v3`
   - 或者留空

### Q5: 其他AI服务商也连不上？

**A:** 我已经为火山引擎创建了代理。其他服务商需要：

**OpenAI/DeepSeek等：**
- 可能也需要代理
- 或者使用服务商提供的兼容地址

**建议：** 先测试火山引擎豆包，确保代理工作正常。

---

## 🛠️ 手动排查步骤

### 步骤1：验证API信息

访问火山引擎控制台：
https://console.volcengine.com/ark

1. 找到您创建的推理接入点
2. 确认状态为"运行中"
3. 复制正确的Endpoint ID
4. 测试API密钥

### 步骤2：使用curl测试

在终端运行（替换成您的信息）：

```bash
curl -X POST \
  https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "YOUR_ENDPOINT_ID",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

**成功响应：**
```json
{
  "choices": [
    {
      "message": {
        "content": "你好！有什么我可以帮助你的吗？"
      }
    }
  ]
}
```

**失败响应：**
- 检查错误信息
- 根据错误调整配置

### 步骤3：检查代理服务器

访问：http://localhost:3000/api/proxy/doubao

**正常情况：**
```
{"error":"Method not allowed"}
```
这是正常的，因为GET请求不被允许。

**异常情况：**
- 404错误 → 代理文件未创建
- 500错误 → 服务器配置问题

---

## 📞 还是不行？

### 收集信息：

1. **浏览器控制台截图**
   - Console标签的错误
   - Network标签的请求详情

2. **配置信息**
   - 使用的AI服务商
   - Endpoint ID格式（隐藏关键部分）
   - 错误信息

3. **测试结果**
   - curl命令的响应
   - 浏览器的错误信息

### 临时解决方案：

如果火山引擎一直连不上，可以尝试：

1. **使用其他服务商**
   - OpenAI
   - DeepSeek
   - Anthropic

2. **稍后再试**
   - 可能是服务商临时问题
   - 等待几分钟后重试

3. **检查网络**
   - 尝试切换网络
   - 关闭VPN/代理
   - 使用手机热点测试

---

## ✅ 成功连接的标志

当一切正常时，您会看到：

1. **配置页面**
   - 🔌 测试按钮 → 🟢 绿色"✓ 连接成功"

2. **浏览器控制台**
   ```
   [火山引擎豆包] Endpoint ID: ep-xxxxx
   [代理] 请求成功
   [火山引擎豆包] 调用成功
   ```

3. **生成页面**
   - 能正常生成分镜描述
   - 没有错误提示
   - 看到生成的内容

---

**祝您顺利连接API！** 🎉

如果还有问题，请查看浏览器控制台的详细错误信息。

