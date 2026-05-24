# 围棋 React 示例

这是一个简单的 React + TypeScript 围棋游戏示例，展示如何将原项目迁移到现代前端框架。

## 功能特性

- 支持 9/13/19 路棋盘
- 响应式设计，适配移动端
- 黑白交替落子
- 星位和天元显示
- 重新开始功能

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
react-example/
├── src/
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目配置
```

## 主要组件

### BoardComponent
棋盘组件，负责：
- 渲染网格线和星位
- 渲染棋子
- 处理用户点击
- 响应式大小调整

### App
主应用组件，包含：
- 游戏状态管理
- 棋盘大小切换
- 游戏重置功能

## 技术栈

- React 18
- TypeScript
- Vite
