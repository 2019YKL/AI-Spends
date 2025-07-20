# AiSpends - AI订阅费用实时追踪器

一个现代化的AI订阅费用实时追踪应用，使用Next.js 14、TypeScript和Tailwind CSS构建。实时显示今日AI服务消费，并包含AI嘲讽功能。

## ✨ 功能特色

- 🔥 **实时费用追踪**: 实时显示今日各项AI服务消费
- 📊 **分类管理**: AI对话、编程工具、AI绘图、生产力工具四大分类
- 🎮 **切换控制**: 可开关服务来控制费用计算
- 🤖 **AI嘲讽功能**: DeepSeek驱动的AI助手会嘲讽你的订阅习惯
- 🎨 **火焰主题**: 黑红配色的"烧钱"主题设计
- 📱 **响应式设计**: 完美适配桌面和移动端
- ⚡ **丝滑动画**: 60fps的数字滚动动画

## 🛠️ 支持的AI服务

### 🤖 AI对话助手
- **Claude** (Anthropic)
- **ChatGPT** (OpenAI) 
- **Gemini** (Google)

### 💻 编程开发工具
- **Cursor** (AI代码编辑器)
- **Windsurf** (AI代码编辑器)
- **GitHub Copilot** (代码补全)
- **v0** (UI生成)

### 🎨 AI绘图/视频
- **Midjourney** (AI绘图)
- **Dreamina** (字节AI绘图)
- **Hailuo**, **Vidu**, **Kling**, **Pixverse**, **Trae** (AI视频)

### ⚡ 生产力工具
- **Notion** (笔记协作)
- **Raycast** (启动器)
- **Figma** (设计工具)

## 🚀 技术栈 | Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: OpenRouter API (DeepSeek)
- **Deployment**: Vercel

## 📦 快速开始 | Getting Started

### 环境要求 | Prerequisites

- Node.js 18+
- npm 或 yarn
- DeepSeek API密钥 (用于AI嘲讽功能)

### 安装步骤 | Installation

1. **克隆仓库 | Clone the repository**:
```bash
git clone https://github.com/2019YKL/AI-Spends.git
cd AI-Spends
```

2. **安装依赖 | Install dependencies**:
```bash
npm install
```

3. **配置环境变量 | Setup environment variables**:
创建 `.env.local` 文件并添加以下内容：
```bash
# ⚠️ 重要：这是OpenRouter的API密钥，不是DeepSeek官方API！
# OpenRouter API Key (for DeepSeek AI roasting feature)
# Get your API key from: https://openrouter.ai/ (NOT deepseek.com)
DEEPSEEK_API_KEY=sk-or-v1-your-openrouter-api-key-here
```

4. **启动开发服务器 | Run development server**:
```bash
npm run dev
```

5. **打开浏览器 | Open browser**: 
访问 [http://localhost:3000](http://localhost:3000)

## 🔧 部署指南 | Deployment

### Vercel部署 (推荐)

1. **部署到Vercel | Deploy to Vercel**:
   - Fork本仓库到你的GitHub
   - 连接到Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

2. **配置环境变量 | Configure Environment Variables**:
   在Vercel项目设置中添加以下环境变量：
   
   | Key | Value | Description |
   |-----|-------|-------------|
   | `DEEPSEEK_API_KEY` | `sk-or-v1-your-key` | **⚠️ 注意：这是OpenRouter的API密钥，不是DeepSeek官方的！** |

3. **获取API密钥 | Get API Key**:
   - **重要**: 访问 [OpenRouter](https://openrouter.ai/) (不是DeepSeek官网!)
   - 注册OpenRouter账号并获取API密钥
   - 密钥格式: `sk-or-v1-...` (OpenRouter格式)
   - **说明**: 本项目使用OpenRouter作为API代理来调用DeepSeek模型

### 本地构建 | Local Build

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构 | Project Structure

```
src/
├── app/                         # Next.js app router
│   ├── api/deepseek/chat/      # AI嘲讽API路由
│   ├── globals.css             # 全局样式和火焰主题
│   ├── layout.tsx              # 根布局组件
│   └── page.tsx                # 主仪表板页面
├── components/
│   ├── ui/                     # shadcn/ui组件库
│   ├── AIRoastChat.tsx         # AI嘲讽聊天组件
│   ├── CostTrackingCard.tsx    # 费用追踪卡片
│   ├── DotBackground.tsx       # 点状背景
│   └── SmoothNumber.tsx        # 丝滑数字动画
├── lib/
│   ├── ai-services-data.ts     # AI服务数据配置
│   ├── cost-calculator.ts      # 费用计算逻辑
│   └── utils.ts                # 工具函数
└── types/
    └── ai-services.ts          # TypeScript类型定义
```

## ⚙️ 自定义配置 | Customization

### 添加新的AI服务 | Adding New AI Services

在 `src/lib/ai-services-data.ts` 中添加服务:

```typescript
{
  id: 'new-service',
  name: 'New AI Service', 
  category: 'ai-chat', // ai-chat | code-editor | ai-image | productivity
  icon: '/icon/new-service.svg',
  color: 'bg-indigo-500',
  subscriptionPrice: 20, // 月费 (USD)
  billingCycle: 30,      // 计费周期 (天)
  billingStartDate: '2024-01-01',
  isActive: true
}
```

### 修改主题 | Theming

在 `src/app/globals.css` 中自定义火焰主题颜色和动画效果。

### API配置 | API Configuration

AI嘲讽功能使用OpenRouter API，可在 `src/app/api/deepseek/chat/route.ts` 中调整模型参数。

## 🌟 特色功能 | Features

### 🔥 实时费用计算 | Real-time Cost Calculation
- 基于每日消费模型，从今日00:00开始计算
- 60fps丝滑数字滚动动画
- 支持服务开关控制

### 🤖 AI嘲讽系统 | AI Roasting System  
- 集成DeepSeek模型
- 程序员文化专属吐槽
- 中文"雌小鬼"风格对话

### 🎨 火焰主题设计 | Fire Theme Design
- 黑红配色"烧钱"主题
- Raycast风格玻璃态效果
- 响应式设计

## 📝 许可证 | License

MIT License - 可自由用于个人或商业用途

## 🤝 贡献 | Contributing

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 💬 支持 | Support

如有问题或建议，请在GitHub上提交Issue。

---

**⚡ 一键部署 | Quick Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/2019YKL/AI-Spends&env=DEEPSEEK_API_KEY&envDescription=OpenRouter%20API%20Key%20for%20DeepSeek%20AI%20roasting%20feature&envLink=https://openrouter.ai/)

记得在Vercel中配置 `DEEPSEEK_API_KEY` 环境变量！

---

## 🔗 相关链接 | Links

- **作者博客**: [jkaihub.com](https://jkaihub.com/) - 分享AI、编程和技术洞察
- **项目仓库**: [GitHub](https://github.com/2019YKL/AI-Spends)
- **在线体验**: [Demo](https://ai-spends.vercel.app/)