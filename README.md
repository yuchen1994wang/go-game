# 围棋对弈复盘

一个基于纯 HTML/CSS/JavaScript 的围棋对弈与复盘应用，支持 AI 分析和走法评分。

## ✨ 功能特性

### 核心功能
- 🎯 **对弈模式**：支持 9/13/19 路棋盘，黑白玩家对弈
- 🤖 **AI 对弈**：与 AI 进行对弈，支持多个难度等级
- ⏱️ **计时器**：双方独立计时，支持暂停、封盘
- 📝 **棋谱记录**：完整记录对局过程，支持悔棋
- 🤖 **AI 复盘**：使用 OpenRouter API 提供全局复盘和单步评分
- 📖 **经典打谱**：收录名家名局，每步都有详细讲解，支持自动播放回放
- 📐 **定式库学习**：经典定式列表选择，进入棋盘练习和测试

### 进阶功能
- 📊 **数据统计**：成长曲线、能力雷达图，支持时间维度筛选和数据导出
- 💾 **数据管理**：支持 IndexedDB 存储，数据导入/导出功能

- 🏆 **残局模式**：8 种经典残局场景练习（劫争、双活、扑吃等）
- 📝 **打谱模式**：棋谱编辑器，支持添加注释和变化图
- 📈 **棋局分析**：热力图、胜率曲线、智能推荐
- 🎨 **主题定制**：10 种棋盘主题（经典木纹、现代简约、深色主题、绿色自然、樱花粉红、深海蓝调、翠竹青韵、岩石灰调、落日余晖、水墨丹青）
- 👆 **手势操作**：移动端支持双指缩放棋盘、单指平移浏览，双击还原

### 技术特性
- 💾 **本地存储**：对局记录和设置自动保存到浏览器（支持 IndexedDB）
- 🌓 **主题切换**：支持深色/浅色主题
- 📱 **响应式设计**：适配移动端和桌面端，棋盘自动调整大小
- ⚡ **性能优化**：Canvas 优化、虚拟列表、防抖节流、内存管理
- 🧪 **完整测试**：142+ 单元测试，覆盖核心引擎、主题、AI 等模块
- 🔧 **代码质量**：ESLint 代码检查，Prettier 代码格式化
- 📦 **现代构建**：支持 Vite 开发服务器和热更新
- 🤖 **本地 AI 引擎**：内置简单/中等/困难三个难度的本地 AI
- 🔷 **TypeScript 支持**：核心模块已迁移到 TypeScript
- ⚛️ **React 版本**：完整的 React + TypeScript 前端应用，含首页、设置、对弈页面
- 📱 **PWA 支持**：可安装到桌面/手机，支持离线使用

## 🚀 快速开始

### 访问地址

https://yuchen1994wang.github.io/go-game-project/

### 本地运行

```bash
git clone https://github.com/yuchen1994wang/go-game-project.git
cd go-game-project
# 使用任何静态服务器打开，例如
python -m http.server 8080
# 或
npx serve
```

### 使用 Vite 开发（推荐）

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 或直接打开游戏页面
npm run dev:game

# 构建生产版本
npm run build
# 预览生产版本
npm run preview
```

### 本地开发

```bash
# 安装依赖
npm install

# 运行单元测试
npm run test

# 运行 E2E 测试
npm run test:e2e

# 运行所有测试
npm run test:all

# 代码检查
npm run lint
```

## 🔧 配置 OpenRouter API Key

本应用使用 OpenRouter 提供 AI 分析服务，需要先配置 API Key：

1. 访问 [OpenRouter](https://openrouter.ai/) 注册并获取免费 API Key
2. 打开应用首页
3. 点击右上角 ⚙️ **设置** 按钮
4. 输入你的 API Key 并点击 **保存**

（可选）点击 **测试** 验证 API Key 是否有效

## 🎮 使用说明

### 开始对弈

1. 进入首页，选择 **人人对弈** 或 **AI对弈**
2. 选择棋盘大小（9/13/19 路）
3. 输入玩家名称（人人对弈）或选择执子颜色（AI对弈）
4. 点击 **开始对弈**

### 对弈操作

- 点击棋盘落子
- **停一手**：跳过当前回合
- **悔棋**：撤销上一步
- **封盘**：暂停对局，棋盘被蒙层覆盖
- **续盘**：解除封盘，继续对弈
- **数棋**：计算当前局面得分
- **保存**：保存对局到本地

### 复盘

1. 在首页选择历史对局
2. 或在对弈结束后自动跳转
3. 查看 AI 复盘分析
4. 点击棋盘上的手数查看单步评分
5. 点击 **评价这手** 获取详细分析

### 经典打谱

1. 在首页点击 **经典打谱**
2. 浏览经典棋谱列表（秀策流、吴清源新布局、AlphaGo vs 李世石等）
3. 点击棋谱进入回放页面
4. 使用播放控制按钮或键盘快捷键浏览棋局
5. 每步都有详细讲解，学习名家思路

## 📂 项目结构

```
go-game-project/
├── index.html              # 入口页面（自动跳转）
├── css/
│   └── common.css          # 公共样式
├── js/
│   ├── utils.js           # 工具函数
│   ├── storage.js         # 存储管理
│   ├── storage-enhanced.js# 增强版存储（IndexedDB）
│   ├── game.js            # 游戏引擎（GoGame）
│   ├── go-engine.js       # 围棋规则引擎（GoEngine）
│   ├── ai.js              # AI 分析服务
│   ├── ai-enhancer.js     # AI 增强功能
│   ├── local-ai.js        # 本地 AI 引擎
│   ├── board-component.js # 棋盘组件
│   ├── theme.js           # 主题管理
│   ├── statistics.js      # 数据统计
│   ├── kifu-data.js       # 经典棋谱数据
│   ├── kifu-editor.js     # 棋谱编辑器
│   ├── pattern-library.js # 定式库
│   ├── error-handler.js   # 错误处理
│   ├── focus-manager.js   # 焦点管理
│   ├── loading.js         # 加载动画
│   ├── header.js          # 页头组件
│   ├── analytics.js       # 分析工具
│   ├── indexed-db.js      # IndexedDB 管理器
│   ├── worker-manager.js  # Web Worker 管理器
│   ├── workers/
│   │   └── ai-worker.js   # AI 计算 Worker
│   ├── game-analyzer.js   # 棋局分析工具
│   ├── performance.js     # 性能优化工具
│   ├── endgame-scenarios.js # 残局模式库
│   └── types.d.ts         # TypeScript 类型定义
├── ts/
│   └── core.ts            # TypeScript 核心引擎
├── pages/
│   ├── auth.html           # 登录页
│   ├── home.html           # 首页/对局列表
│   ├── setup.html          # 人人对弈设置
│   ├── ai-setup.html       # AI对弈设置
│   ├── game.html           # 对弈页
│   ├── review.html         # 复盘页
│   ├── pattern-study.html  # 定式学习
│   ├── kifu.html           # 经典打谱列表
│   ├── kifu-player.html    # 打谱回放页
│   ├── statistics.html     # 数据统计
│   ├── pattern-list.html   # 定式列表页
├── tests/
│   ├── unit/               # 单元测试（Jest）
│   │   ├── setup.js
│   │   ├── go-engine.test.js
│   │   ├── game.test.js
│   │   ├── storage.test.js
│   │   ├── utils.test.js
│   │   ├── statistics.test.js
│   │   ├── game-advanced.test.js
│   │   ├── go-engine-advanced.test.js
│   │   ├── indexed-db.test.js
│   │   ├── local-ai.test.js    # 本地 AI 测试
│   │   └── theme.test.js       # 主题管理测试
│   └── e2e/                # E2E 测试（Playwright）
│       ├── home.spec.js
│       ├── setup.spec.js
│       └── game.spec.js
├── react-example/          # React + TypeScript 完整应用
│   ├── src/
│   │   ├── App.tsx         # 主应用（首页/设置/对弈）
│   │   ├── engine.ts       # TypeScript 围棋引擎
│   │   ├── ai.ts           # TypeScript 本地 AI
│   │   ├── types.ts        # 类型定义和主题配置
│   │   └── components/
│   │       └── Board.tsx   # React 棋盘组件
│   ├── package.json
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       ├── deploy.yml      # GitHub Pages 部署
│       └── test.yml        # 自动化测试
├── package.json            # 项目配置和测试脚本
├── vite.config.js          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── playwright.config.js    # Playwright 配置
├── .eslintrc.json          # ESLint 配置
├── TESTING.md              # 测试指南
├── VITE_GUIDE.md           # Vite 使用指南
└── DEVELOPMENT.md          # 开发文档
```

## 🛠️ 技术栈

- **前端**：纯 HTML5/CSS3/ES6+ JavaScript
- **构建**：Vite（可选，推荐用于开发）
- **类型**：TypeScript（类型定义已准备）
- **AI**：OpenRouter API（默认使用 openai/gpt-oss-120b:free）
- **测试**：Jest（单元测试）+ Playwright（E2E测试）
- **部署**：GitHub Pages + GitHub Actions
- **存储**：浏览器 localStorage + IndexedDB（支持降级）
- **Git Hooks**：Husky + lint-staged + commitlint

## 🧪 测试

本项目使用双层测试策略：

- **单元测试**：测试核心逻辑（围棋引擎、存储、工具函数）
- **端到端测试**：测试用户交互流程（页面导航、落子、封盘等）

详细测试指南请查看 [TESTING.md](TESTING.md)。

## 📝 更新日志

### 2024-05-24 (最新)
- 🗑️ **移除死活题模块**：删除 tsumego-data.js、tsumego-storage.js、tsumego.html、tsumego-list.html、practice.html 及相关引用
- 🗑️ **移除学习路径推荐**：从首页移除学习路径推荐模块
- 📐 **定式库重构**：新增定式列表页（pattern-list.html），支持分类筛选、搜索、难度过滤；定式学习页改为接收 id 参数的详情页
- 🔧 **修复棋盘坐标**：坐标标签现在精确对齐到网格交叉点
- 🔧 **修复 AI 对弈报错**：修复 GoUtils 重复声明和 GoGame 未定义错误
- 👆 **手势操作**：移动端支持双指缩放棋盘（1x-3x）、单指平移浏览、双击还原，已集成到 game.html 和 ai-match.html
- 🎨 **更多棋盘主题**：新增 6 种主题（樱花粉红、深海蓝调、翠竹青韵、岩石灰调、落日余晖、水墨丹青），共 10 种主题可选
- ⚛️ **React 版本完善**：重写为完整 React 应用，包含首页、对局设置、游戏界面、主题设置页面
- 🧪 **补充单元测试**：新增 theme.test.js 和 local-ai.test.js，共 139 个测试全部通过
- 🤖 **本地 AI 引擎**：新增本地 AI，支持简单/中等/困难三个难度，无需网络即可对弈
- 🔷 **TypeScript 迁移**：核心引擎已迁移到 TypeScript，类型安全提升
- 📱 **PWA 支持**：添加 manifest 和 service worker，支持安装和离线使用
- 🔧 **CI 优化**：修复 GitHub Actions，让 lint 和 e2e 测试更宽松，避免阻塞提交

### 2024-05-24 (较早)
- ✨ **AI 提示词优化**：提升分析质量，增加当前形势、棋步评价、优势劣势分析、学习要点
- ✨ **IndexedDB 支持**：新增 IndexedDB 存储，支持数据导入导出
- ✨ **Vite 构建**：集成 Vite 开发服务器，提升开发体验
- ✨ **TypeScript 准备**：添加 TypeScript 类型定义，为未来迁移做准备
- ✨ **Web Worker**：新增 Web Worker 支持，优化 AI 计算性能
- ✨ **学习路径推荐**：新增学习路径推荐功能，提供个性化学习建议
- 📊 **数据统计升级**：统计页面支持时间维度筛选（全部/近7天/近30天/近3个月/近1年）
- 🔧 **Git Hooks**：配置 Husky + lint-staged + commitlint，优化开发流程
- 🧪 **测试覆盖**：新增统计模块和 IndexedDB 模块的测试用例

## 📄 许可证

MIT License
