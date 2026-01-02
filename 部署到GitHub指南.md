# 🚀 部署到GitHub完整指南

## 📋 目录
1. [前置准备](#前置准备)
2. [初始化Git仓库](#初始化git仓库)
3. [创建GitHub仓库](#创建github仓库)
4. [推送代码到GitHub](#推送代码到github)
5. [部署到Vercel](#部署到vercel-推荐)
6. [常见问题](#常见问题)

---

## 🔧 前置准备

### 1. 确认Git已安装

打开终端，运行：
```bash
git --version
```

如果显示版本号（如`git version 2.x.x`），说明已安装。

**如果未安装**：
```bash
# macOS
brew install git

# 或者从官网下载
# https://git-scm.com/download/mac
```

### 2. 配置Git（首次使用）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 3. 确认有GitHub账号

- 如果没有：访问 https://github.com 注册
- 如果有：记住你的用户名

---

## 📦 初始化Git仓库

### 步骤1：打开终端并进入项目目录

```bash
cd "/Users/mac/Desktop/Storyboard Pro AI"
```

### 步骤2：初始化Git仓库

```bash
git init
```

### 步骤3：添加所有文件到Git

```bash
git add .
```

### 步骤4：创建第一次提交

```bash
git commit -m "🎬 初始提交：Storyboard Pro AI - 智能分镜生成器"
```

**期望输出**：
```
[main (root-commit) xxxxxxx] 🎬 初始提交：Storyboard Pro AI - 智能分镜生成器
 XX files changed, XXXX insertions(+)
 create mode 100644 README.md
 ...
```

---

## 🌐 创建GitHub仓库

### 方法1：通过GitHub网页（推荐）

#### 步骤1：访问GitHub
```
https://github.com/new
```

#### 步骤2：填写仓库信息

```
Repository name: storyboard-pro-ai
Description: 🎬 智能分镜生成器 - AI驱动的视觉故事板规划工具

☑️ Public（公开）或 ⬜ Private（私有）

⬜ 不要勾选 "Add a README file"
⬜ 不要勾选 "Add .gitignore"
⬜ 不要勾选 "Choose a license"
```

#### 步骤3：点击"Create repository"

---

### 方法2：通过GitHub CLI（高级）

如果安装了GitHub CLI：

```bash
# 登录GitHub
gh auth login

# 创建仓库
gh repo create storyboard-pro-ai --public --source=. --remote=origin

# 推送代码
git push -u origin main
```

---

## 📤 推送代码到GitHub

### 步骤1：添加远程仓库

**替换`你的用户名`为你的GitHub用户名**：

```bash
git remote add origin https://github.com/你的用户名/storyboard-pro-ai.git
```

**示例**：
```bash
git remote add origin https://github.com/zhangsan/storyboard-pro-ai.git
```

### 步骤2：检查分支名称

```bash
git branch
```

如果显示`master`，需要重命名为`main`：
```bash
git branch -M main
```

### 步骤3：推送代码

```bash
git push -u origin main
```

**第一次推送会提示输入GitHub账号密码**：

#### 如果使用HTTPS（推荐新手）

```
Username: 你的GitHub用户名
Password: 你的Personal Access Token（不是密码！）
```

⚠️ **重要**：GitHub不再支持密码登录，需要使用Personal Access Token

#### 获取Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击"Generate new token" → "Generate new token (classic)"
3. 填写信息：
   ```
   Note: Storyboard Pro AI
   Expiration: 90 days（或自定义）
   Select scopes:
   ☑️ repo（所有）
   ```
4. 点击"Generate token"
5. **立即复制token**（只显示一次！）

#### 保存token（可选）

```bash
# macOS/Linux - 保存到钥匙串
git config --global credential.helper osxkeychain

# Windows
git config --global credential.helper wincred
```

### 步骤4：验证推送成功

访问：
```
https://github.com/你的用户名/storyboard-pro-ai
```

应该能看到你的所有代码！

---

## 🌟 部署到Vercel（推荐）

Vercel是Next.js官方推荐的部署平台，**完全免费**！

### 优势
- ✅ 自动部署（推送代码即部署）
- ✅ 免费HTTPS
- ✅ 全球CDN加速
- ✅ 零配置部署

### 步骤1：访问Vercel

```
https://vercel.com
```

### 步骤2：使用GitHub登录

点击"Sign Up" → 选择"Continue with GitHub"

### 步骤3：导入项目

1. 点击"Add New..." → "Project"
2. 选择"Import Git Repository"
3. 找到`storyboard-pro-ai`
4. 点击"Import"

### 步骤4：配置项目

```
Framework Preset: Next.js（自动检测）
Root Directory: ./
Build Command: npm run build（自动）
Output Directory: .next（自动）

Environment Variables: （暂不添加）
```

### 步骤5：部署

点击"Deploy"

等待1-2分钟，部署完成！

### 步骤6：访问网站

```
https://storyboard-pro-ai.vercel.app
```

或你自定义的域名。

---

## 🔄 后续更新代码

### 本地修改后推送到GitHub

```bash
# 1. 保存所有更改
git add .

# 2. 提交更改
git commit -m "✨ 添加新功能：XXX"

# 3. 推送到GitHub
git push
```

### Vercel自动部署

推送到GitHub后，Vercel会**自动**重新部署！

查看部署状态：
```
https://vercel.com/你的用户名/storyboard-pro-ai
```

---

## ⚠️ 重要提示：保护API密钥

### ❌ 不要提交API密钥到GitHub！

如果你的代码包含API密钥，需要：

#### 1. 检查.gitignore

确认包含：
```
.env
.env*.local
```

#### 2. 创建.env.local文件

```bash
# 项目根目录
touch .env.local
```

#### 3. 移动API密钥到.env.local

```env
# .env.local
OPENAI_API_KEY=sk-xxxxx
DOUBAO_API_KEY=xxxx
```

#### 4. 在代码中使用环境变量

```typescript
const apiKey = process.env.OPENAI_API_KEY
```

#### 5. 如果已经提交了密钥

**立即撤销密钥并重新生成！**

```bash
# 从历史记录中删除敏感文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

然后：
1. 去API提供商网站撤销旧密钥
2. 生成新密钥
3. 添加到.env.local
4. 不要再提交！

---

## 📝 Git常用命令

### 查看状态
```bash
git status
```

### 查看提交历史
```bash
git log --oneline
```

### 撤销更改
```bash
# 撤销工作区更改
git checkout -- 文件名

# 撤销暂存区更改
git reset HEAD 文件名

# 撤销上次提交（保留更改）
git reset --soft HEAD^
```

### 分支管理
```bash
# 创建分支
git branch feature-name

# 切换分支
git checkout feature-name

# 创建并切换
git checkout -b feature-name

# 合并分支
git checkout main
git merge feature-name

# 删除分支
git branch -d feature-name
```

---

## 🐛 常见问题

### 1. git push失败：403 Forbidden

**原因**：密码错误或没有权限

**解决**：
```bash
# 清除保存的密码
git credential-osxkeychain erase
host=github.com
protocol=https

# 重新推送，输入正确的token
git push
```

### 2. git push失败：rejected

**原因**：远程有更新，本地落后

**解决**：
```bash
# 拉取远程更新
git pull origin main --rebase

# 重新推送
git push
```

### 3. Vercel部署失败

**原因**：构建错误

**解决**：
```bash
# 本地测试构建
npm run build

# 如果成功，提交并推送
git add .
git commit -m "🐛 修复构建错误"
git push
```

### 4. 文件太大无法推送

**原因**：单个文件超过100MB

**解决**：

使用Git LFS：
```bash
# 安装Git LFS
brew install git-lfs
git lfs install

# 跟踪大文件
git lfs track "*.psd"
git lfs track "*.mp4"

# 提交.gitattributes
git add .gitattributes
git commit -m "🔧 添加Git LFS"
git push
```

### 5. 忘记了远程仓库地址

```bash
# 查看远程仓库
git remote -v

# 修改远程仓库
git remote set-url origin https://github.com/新用户名/新仓库名.git
```

---

## 📚 推荐的提交信息格式

使用表情符号让提交历史更清晰：

```bash
🎨 git commit -m "🎨 改进代码结构"
✨ git commit -m "✨ 添加新功能"
🐛 git commit -m "🐛 修复bug"
📝 git commit -m "📝 更新文档"
🚀 git commit -m "🚀 部署相关"
♻️  git commit -m "♻️ 重构代码"
🔧 git commit -m "🔧 修改配置"
🎉 git commit -m "🎉 初始提交"
```

---

## 🎯 完整部署检查清单

### ✅ GitHub部署

- [ ] Git已安装并配置
- [ ] 项目已初始化Git仓库
- [ ] .gitignore文件已创建
- [ ] 代码已提交到本地仓库
- [ ] GitHub仓库已创建
- [ ] 本地代码已推送到GitHub
- [ ] 可以在GitHub上看到代码

### ✅ Vercel部署

- [ ] Vercel账号已创建
- [ ] 项目已从GitHub导入
- [ ] 项目已成功部署
- [ ] 可以访问线上网站
- [ ] 自动部署已启用

### ✅ 安全检查

- [ ] API密钥不在代码中
- [ ] .env文件在.gitignore中
- [ ] 敏感信息已保护

---

## 🆘 需要帮助？

如果遇到问题：

1. **查看错误信息**：仔细阅读终端的错误提示
2. **搜索问题**：复制错误信息到Google/百度
3. **查看文档**：
   - Git: https://git-scm.com/doc
   - GitHub: https://docs.github.com
   - Vercel: https://vercel.com/docs

---

## 🎉 部署成功！

恭喜！你的项目现在已经：

✅ 托管在GitHub上
✅ 有版本控制
✅ 可以与他人协作
✅ （如果部署了Vercel）全世界都能访问！

**下一步**：

1. 添加README.md完善项目说明
2. 添加LICENSE选择开源协议
3. 邀请协作者
4. 持续开发新功能

---

**祝你的项目成功！** 🚀

