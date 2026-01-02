#!/bin/bash

# 🚀 Storyboard Pro AI - GitHub部署脚本
# 使用方法：chmod +x 一键部署脚本.sh && ./一键部署脚本.sh

set -e  # 遇到错误立即退出

echo "🎬 Storyboard Pro AI - GitHub部署脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Git是否安装
echo "📋 检查Git..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git未安装${NC}"
    echo "请先安装Git："
    echo "  brew install git"
    exit 1
fi
echo -e "${GREEN}✅ Git已安装: $(git --version)${NC}"
echo ""

# 检查是否已初始化Git仓库
echo "📋 检查Git仓库..."
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  未找到Git仓库，正在初始化...${NC}"
    git init
    echo -e "${GREEN}✅ Git仓库已初始化${NC}"
else
    echo -e "${GREEN}✅ Git仓库已存在${NC}"
fi
echo ""

# 检查Git配置
echo "📋 检查Git配置..."
if [ -z "$(git config --global user.name)" ] || [ -z "$(git config --global user.email)" ]; then
    echo -e "${RED}❌ Git未配置用户信息${NC}"
    echo ""
    echo "请配置Git用户信息："
    read -p "请输入你的名字: " username
    read -p "请输入你的邮箱: " email
    git config --global user.name "$username"
    git config --global user.email "$email"
    echo -e "${GREEN}✅ Git用户信息已配置${NC}"
else
    echo -e "${GREEN}✅ Git已配置: $(git config --global user.name) <$(git config --global user.email)>${NC}"
fi
echo ""

# 添加所有文件
echo "📦 添加文件到Git..."
git add .
echo -e "${GREEN}✅ 文件已添加${NC}"
echo ""

# 检查是否有更改
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  没有新的更改需要提交${NC}"
else
    # 提交更改
    echo "💾 提交更改..."
    read -p "请输入提交信息 (留空使用默认): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="🎬 更新：Storyboard Pro AI"
    fi
    git commit -m "$commit_msg"
    echo -e "${GREEN}✅ 更改已提交${NC}"
fi
echo ""

# 检查当前分支
echo "📋 检查分支..."
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${YELLOW}⚠️  当前分支是 $current_branch，正在重命名为 main...${NC}"
    git branch -M main
    echo -e "${GREEN}✅ 分支已重命名为 main${NC}"
else
    echo -e "${GREEN}✅ 当前分支: main${NC}"
fi
echo ""

# 检查远程仓库
echo "📋 检查远程仓库..."
if git remote | grep -q "^origin$"; then
    remote_url=$(git remote get-url origin)
    echo -e "${GREEN}✅ 远程仓库已配置: $remote_url${NC}"
    echo ""
    read -p "是否要更新远程仓库地址? (y/N): " update_remote
    if [ "$update_remote" = "y" ] || [ "$update_remote" = "Y" ]; then
        read -p "请输入新的GitHub仓库URL: " new_remote_url
        git remote set-url origin "$new_remote_url"
        echo -e "${GREEN}✅ 远程仓库已更新${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  未配置远程仓库${NC}"
    echo ""
    echo "请先在GitHub上创建仓库："
    echo "  1. 访问 https://github.com/new"
    echo "  2. 仓库名: storyboard-pro-ai"
    echo "  3. 不要勾选任何初始化选项"
    echo "  4. 创建仓库"
    echo ""
    read -p "请输入GitHub仓库URL (格式: https://github.com/用户名/storyboard-pro-ai.git): " remote_url
    git remote add origin "$remote_url"
    echo -e "${GREEN}✅ 远程仓库已配置${NC}"
fi
echo ""

# 推送到GitHub
echo "🚀 推送到GitHub..."
echo -e "${YELLOW}⚠️  如果是第一次推送，可能需要输入GitHub Personal Access Token${NC}"
echo "获取Token: https://github.com/settings/tokens"
echo ""

if git push -u origin main; then
    echo ""
    echo -e "${GREEN}✅ 代码已成功推送到GitHub!${NC}"
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📌 下一步："
    echo "  1. 访问你的GitHub仓库查看代码"
    echo "  2. （可选）部署到Vercel："
    echo "     - 访问 https://vercel.com"
    echo "     - 用GitHub登录"
    echo "     - 导入 storyboard-pro-ai 仓库"
    echo "     - 点击Deploy"
    echo ""
else
    echo ""
    echo -e "${RED}❌ 推送失败${NC}"
    echo ""
    echo "可能的原因："
    echo "  1. 认证失败 - 请确保使用Personal Access Token而不是密码"
    echo "  2. 仓库不存在 - 请先在GitHub上创建仓库"
    echo "  3. 远程仓库地址错误 - 请检查URL"
    echo ""
    echo "手动推送："
    echo "  git push -u origin main"
    exit 1
fi

echo "========================================"
echo "✨ 完成！✨"

