# 🪟 玻璃形态设计系统指南

**基于 UI/UX Pro Max 设计系统**

本项目使用现代化的**玻璃形态（Glassmorphism）**设计风格，提供优雅、专业、沉浸式的用户体验。

---

## 🎨 设计理念

### 核心特征
- **毛玻璃效果**：backdrop-blur(16px) 创造深度感
- **半透明层叠**：rgba(255,255,255,0.15-0.35) 多层次视觉
- **精致边框**：1px solid rgba(255,255,255,0.25) 微妙轮廓
- **光影效果**：内外阴影结合，模拟真实玻璃反射

### 配色方案（Modern SaaS）
```css
Primary:    #2563EB  /* 信任蓝 */
Secondary:  #3B82F6  /* 天空蓝 */
CTA:        #F97316  /* 活力橙 */
Background: #F8FAFC  /* 浅灰白 */
Text:       #1E293B  /* 深石墨 */
Border:     #E2E8F0  /* 轻边框 */
```

### 字体配对（Modern Professional）
- **标题**：Poppins（几何现代，权重 600-800）
- **正文**：Open Sans（易读友好，权重 400-600）

---

## 🧩 组件库

### 1. 卡片组件

#### 标准玻璃卡片
```jsx
<div className="glass-card">
  <h2>标题内容</h2>
  <p>正文内容</p>
</div>
```
或使用简写：
```jsx
<div className="card">
  内容
</div>
```

#### 强玻璃效果卡片
```jsx
<div className="glass-card-strong">
  <h1>重要内容</h1>
  <p>需要更强调的区域</p>
</div>
```

---

### 2. 按钮组件

#### 主要按钮（Primary）
```jsx
<button className="btn-primary">
  主要操作
</button>
```
- 渐变蓝色背景
- 适用于主要 CTA（Call To Action）

#### CTA 按钮（橙色高亮）
```jsx
<button className="btn-cta">
  立即开始
</button>
```
- 渐变橙色背景
- 最高优先级操作

#### 次要按钮
```jsx
<button className="btn-secondary">
  次要操作
</button>
```
- 半透明玻璃效果
- 适用于辅助功能

#### 轮廓按钮
```jsx
<button className="btn-outline">
  取消
</button>
```
- 透明背景，边框样式
- 适用于取消、返回等操作

---

### 3. 输入框组件

#### 文本输入框
```jsx
<input 
  type="text" 
  className="input-field"
  placeholder="请输入内容"
/>
```

#### 文本域
```jsx
<textarea 
  className="textarea-field"
  placeholder="请输入多行文本"
></textarea>
```

#### 下拉选择框
```jsx
<select className="input-field">
  <option>选项1</option>
  <option>选项2</option>
</select>
```

**特性**：
- 自动玻璃模糊效果
- 聚焦时蓝色高亮边框
- 柔和过渡动画

---

### 4. 网格单元格

```jsx
<div className="grid-cell">
  <div className="cell-number">1</div>
  <h3>镜头描述</h3>
  <p>详细内容</p>
</div>
```

**状态**：
- 默认：半透明玻璃
- 悬停：蓝色边框，轻微上浮
- 选中：添加 `.selected` 类

```jsx
<div className="grid-cell selected">
  选中的单元格
</div>
```

---

### 5. 徽章和标签

#### 标准徽章
```jsx
<span className="badge">状态</span>
```

#### 彩色徽章
```jsx
<span className="badge badge-primary">主要</span>
<span className="badge badge-success">成功</span>
<span className="badge badge-warning">警告</span>
```

---

## 🎬 动画效果

### 淡入动画
```jsx
<div className="animate-fadeIn">
  内容
</div>
```

### 左侧滑入
```jsx
<div className="animate-slideInLeft">
  内容
</div>
```

### 缩放进入
```jsx
<div className="animate-scaleIn">
  内容
</div>
```

### 悬浮效果
```jsx
<div className="float-card glass-card">
  悬浮卡片
</div>
```

---

## 💡 实用工具类

### 玻璃分隔线
```jsx
<div className="glass-divider"></div>
```

### 光晕效果
```jsx
<div className="glow glass-card">
  发光卡片
</div>
```

### 文本光晕
```jsx
<h1 className="text-glow">发光文字</h1>
```

### 渐变文字
```jsx
<h1 className="text-gradient">彩虹渐变文字</h1>
```

---

## 🎯 Tailwind 自定义类

### 字体
```jsx
<h1 className="font-heading">使用 Poppins 标题字体</h1>
<p className="font-body">使用 Open Sans 正文字体</p>
```

### 颜色
```jsx
<div className="bg-glass-primary text-white">主色背景</div>
<button className="bg-glass-cta text-white">CTA 颜色</button>
```

### 圆角
```jsx
<div className="rounded-glass">24px 圆角</div>
<div className="rounded-glass-sm">16px 圆角</div>
<div className="rounded-glass-lg">32px 圆角</div>
```

### 模糊
```jsx
<div className="backdrop-blur-glass">16px 模糊</div>
<div className="backdrop-blur-glass-strong">24px 强模糊</div>
```

### 阴影
```jsx
<div className="shadow-glass">玻璃阴影</div>
<div className="shadow-glass-hover">悬停阴影</div>
<div className="shadow-glass-strong">强玻璃阴影</div>
<div className="shadow-glow-primary">蓝色光晕</div>
```

---

## 📱 响应式设计

所有组件在移动端自动优化：
- 卡片圆角从 24px → 16px
- 按钮字号从 1rem → 0.875rem
- 网格单元格高度从 180px → 120px

---

## ♿ 可访问性

### 自动支持
- ✅ 减少动画模式（`prefers-reduced-motion`）
- ✅ 键盘焦点可见（蓝色轮廓）
- ✅ 高对比度文本
- ✅ WCAG AA 标准

### 使用建议
- 确保文本与背景对比度 ≥ 4.5:1
- 提供清晰的焦点状态
- 避免仅依赖颜色传达信息

---

## 🎨 渐变背景

页面背景自带动态渐变动画：
```css
/* 自动应用于 body */
background: linear-gradient(135deg, 
  #667eea, #764ba2, #f093fb, #4facfe, #00f2fe
);
animation: gradientShift 15s ease infinite;
```

---

## 🔧 自定义滚动条

美化的玻璃风格滚动条：
- 轨道：半透明
- 滑块：蓝色渐变
- 悬停：橙色渐变 + 光晕

---

## 📖 使用示例

### 完整页面结构
```jsx
<div className="min-h-screen p-8">
  {/* 主容器 */}
  <div className="max-w-7xl mx-auto">
    
    {/* 标题区域 */}
    <div className="glass-card-strong mb-8 animate-fadeIn">
      <h1 className="font-heading text-5xl mb-4 text-gradient">
        故事板生成器
      </h1>
      <p className="font-body text-lg opacity-90">
        专业的 AI 驱动分镜创作工具
      </p>
    </div>
    
    {/* 内容区域 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card animate-slideInLeft">
        <h2 className="font-heading text-2xl mb-4">配置</h2>
        <input className="input-field mb-4" placeholder="API 密钥" />
        <button className="btn-primary w-full">测试连接</button>
      </div>
      
      <div className="glass-card animate-scaleIn">
        <h2 className="font-heading text-2xl mb-4">选项</h2>
        <select className="input-field mb-4">
          <option>选择分镜数量</option>
          <option>9 张 (3×3)</option>
          <option>15 张 (3×5)</option>
          <option>20 张 (4×5)</option>
        </select>
        <button className="btn-cta w-full">开始生成</button>
      </div>
    </div>
    
  </div>
</div>
```

---

## 🚀 性能优化

### 已实施
- ✅ CSS backdrop-filter 硬件加速
- ✅ 动画使用 transform（GPU 加速）
- ✅ 减少重绘（opacity 而非 background 变化）
- ✅ 响应式图片加载

### 建议
- 避免过度嵌套玻璃效果（最多 3 层）
- 大面积玻璃区域考虑降低模糊值
- 移动端可禁用部分动画

---

## 📚 参考资源

- **UI/UX Pro Max**: 设计系统来源
- **Glassmorphism**: https://hype4.academy/tools/glassmorphism-generator
- **配色**: https://www.uicolor.xyz/
- **字体**: https://fonts.google.com/

---

## 🎯 快速上手

1. **使用预设样式**：直接应用 `.glass-card`, `.btn-primary` 等类
2. **查看示例**：运行项目，查看各页面实现
3. **自定义调整**：修改 `styles/globals.css` 中的 `:root` 变量
4. **扩展主题**：在 `tailwind.config.js` 中添加自定义配置

---

**设计师**：UI/UX Pro Max  
**实施**：Next.js 14 + Tailwind CSS  
**字体**：Poppins + Open Sans  
**灵感**：Modern SaaS 最佳实践

🪟✨ 享受玻璃形态设计带来的视觉盛宴！


