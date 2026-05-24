# 自动化测试指南

## 测试架构

本项目使用双层测试策略：

- **单元测试 (Jest)**：测试核心逻辑（围棋引擎、存储、工具函数）
- **端到端测试 (Playwright)**：测试用户交互流程（页面导航、落子、封盘等）

## 快速开始

```bash
# 安装依赖
npm install

# 运行单元测试
npm run test

# 运行单元测试（监听模式）
npm run test:watch

# 运行 E2E 测试
npm run test:e2e

# 运行 E2E 测试（UI 模式）
npm run test:e2e:ui

# 运行所有测试
npm run test:all

# 运行代码检查
npm run lint
```

## 测试覆盖范围

### 单元测试 (`tests/unit/`)

| 模块 | 测试文件 | 覆盖功能 |
|------|----------|----------|
| GoEngine | `go-engine.test.js` | 落子规则、提子、打劫、停一手、形势判断 |
| GoGame | `game.test.js` | 游戏流程、悔棋、数棋、SGF导出、复盘 |
| Storage | `storage.test.js` | 本地存储、历史记录、死活题进度 |
| Utils | `utils.test.js` | Toast、防抖、错误边界 |

### E2E 测试 (`tests/e2e/`)

| 页面 | 测试文件 | 覆盖场景 |
|------|----------|----------|
| 首页 | `home.spec.js` | 导航、响应式布局 |
| 设置页 | `setup.spec.js` | 随机/黑棋选择、玩家姓名、棋盘大小 |
| 对弈页 | `game.spec.js` | 落子、悔棋、停一手、封盘/续盘、保存 |

## CI/CD 集成

每次推送到 `main`/`master` 分支或提交 PR 时，GitHub Actions 会自动运行：

1. **单元测试** - 生成覆盖率报告
2. **E2E 测试** - 在 Chromium/Firefox/WebKit + 移动端浏览器中运行
3. **代码检查** - ESLint 静态分析

## 添加新测试

### 单元测试示例

```javascript
// tests/unit/feature.test.js
describe('新功能', () => {
  test('应该正确工作', () => {
    const result = newFeature();
    expect(result).toBe(true);
  });
});
```

### E2E 测试示例

```javascript
// tests/e2e/feature.spec.js
const { test, expect } = require('@playwright/test');

test('新页面功能', async ({ page }) => {
  await page.goto('/pages/new.html');
  await page.click('text=按钮');
  await expect(page.locator('.result')).toContainText('成功');
});
```

## 调试技巧

- **单元测试**：使用 `console.log` 或 `debugger` 语句
- **E2E 测试**：使用 `npm run test:e2e:ui` 打开 Playwright UI 模式
- **查看报告**：测试失败后查看 `playwright-report/` 和 `coverage/` 目录
