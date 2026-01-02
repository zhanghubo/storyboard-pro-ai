# 🚨 API连接失败快速修复

## ⚡ 5分钟解决"Failed to fetch"

---

## 第1步：确认服务器运行 ✅

### 打开终端，运行：
```bash
npm run dev
```

### 应该看到：
```
✓ Ready in 1662ms
- Local:  http://localhost:3000
```

### 如果没有：
- 按 `Ctrl+C` 停止
- 重新运行 `npm run dev`

---

## 第2步：刷新页面 🔄

访问：**http://localhost:3000**

按 `Ctrl+R`（Windows）或 `Cmd+R`（Mac）刷新

---

## 第3步：检查API配置 ⚙️

### 火山引擎豆包：

✅ **正确配置：**
```
Endpoint ID: ep-20241218xxxxx-xxxxx  ← 以ep-开头
API密钥: xxxxx-xxxxx-xxxxx  ← 完整的密钥
```

❌ **错误配置：**
```
Endpoint ID: doubao-pro-4k  ← 这是模型名，不是Endpoint ID！
Endpoint ID: ep-xxxxx  ← 不完整
API密钥: sk-xxxxx  ← 有空格或截断
```

### 如何获取正确的Endpoint ID：

1. 访问：https://console.volcengine.com/ark
2. 点击您创建的推理接入点
3. 复制完整的 **Endpoint ID**（以 `ep-` 开头）
4. 复制 **API密钥**

---

## 第4步：测试连接 🔌

点击配置页面的"**🔌 测试**"按钮

### 成功✅
```
🟢 ✓ 连接成功
```

### 失败❌
打开浏览器控制台（按F12）查看错误：

#### 错误类型1：401 Unauthorized
```
解决：API密钥错误，重新复制
```

#### 错误类型2：404 Not Found  
```
解决：Endpoint ID不存在或格式错误
```

#### 错误类型3：Failed to fetch
```
解决：查看下面的详细排查
```

---

## 🔍 详细排查（如果第4步失败）

### A. 打开浏览器开发者工具
按 `F12` 打开

### B. 切换到 Network 标签
点击顶部的 "Network"

### C. 点击"🔌 测试"按钮
查看请求列表

### D. 检查请求地址

#### ✅ 正确（使用代理）
```
Name: doubao
Status: 200
Request URL: http://localhost:3000/api/proxy/doubao
```

#### ⚠️ 可能的问题
```
Name: doubao
Status: 404
→ 代理未找到，重启服务器
```

```
Name: doubao  
Status: 500
→ 服务器错误，查看终端日志
```

```
没有请求出现
→ JavaScript错误，查看Console标签
```

### E. 切换到 Console 标签
查看错误信息

#### 成功示例：
```javascript
[火山引擎豆包] Endpoint ID: ep-xxxxx
[代理] 转发请求到: https://ark...
[代理] API响应状态: 200
✓ 连接成功
```

#### 失败示例：
```javascript
[代理] API错误: { error: { message: "invalid api key" } }
→ API密钥错误
```

```javascript
[代理] API错误: { error: { message: "model not found" } }
→ Endpoint ID错误
```

---

## 🎯 常见问题一键解决

### 问题1: 一直转圈，没反应
```bash
# 解决：重启服务器
按 Ctrl+C
npm run dev
```

### 问题2: 显示401错误
```
解决：
1. 重新复制API密钥
2. 确保没有空格
3. 粘贴到配置框
4. 重新测试
```

### 问题3: 显示404错误
```
解决：
1. 检查Endpoint ID格式（必须是ep-开头）
2. 确认推理接入点已创建
3. 确认状态为"运行中"
```

### 问题4: 显示403错误
```
解决：
1. 检查账户余额
2. 确认API服务已开通
3. 查看是否有使用限制
```

### 问题5: 其他错误
```
解决：
1. 查看浏览器Console的详细错误
2. 查看终端的服务器日志
3. 参考 API_TROUBLESHOOTING.md
```

---

## ⚡ 快速测试清单

复制这个清单，逐项检查：

```
□ 服务器正在运行（npm run dev）
□ 页面已刷新（Ctrl+R）
□ Endpoint ID正确（ep-开头）
□ API密钥正确（无空格）
□ 点击了测试按钮
□ 浏览器Console无错误
□ Network显示200状态
```

全部打勾？恭喜，应该可以用了！🎉

---

## 📞 还是不行？

### 收集信息：

1. **终端日志**
   - 复制 `npm run dev` 的输出

2. **浏览器Console**
   - 按F12 → Console标签
   - 截图或复制错误信息

3. **Network请求**
   - 按F12 → Network标签
   - 点击失败的请求
   - 查看Response标签

4. **配置信息**
   - Endpoint ID格式（隐藏关键字符）
   - 使用的服务商
   - 错误状态码

### 备用方案：

如果火山引擎一直不行，试试：

1. **OpenAI**
   - Model: gpt-4 或 gpt-3.5-turbo
   - API Key: sk-xxxxx

2. **DeepSeek**
   - Model: deepseek-chat
   - API Key: xxxxx

3. **稍后再试**
   - 可能是临时网络问题
   - 等待10分钟后重试

---

## ✅ 成功！接下来做什么？

连接成功后：

1. **选择分镜数量**
   - 建议从9个开始测试

2. **输入故事**
   - 详细描述场景和情节

3. **点击生成**
   - 等待2-10分钟

4. **查看结果**
   - 网格显示图片
   - 下载分镜脚本
   - 批量下载图片

---

**祝您顺利！** 🎬✨

如果解决了问题，就可以开始创作了！

