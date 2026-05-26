---
name: mobile-web-dev
version: 2.0.0
description: 移动端前端应用开发全流程助手。从需求确认、开发、本地测试到 GitHub Pages 部署的一站式工具，专为移动端前端项目优化。
---

# 移动端前端应用开发全流程助手

## 概述

本技能将带你完成**移动端优先**的 Web 项目从想法到上线的完整流程：
- 📋 **需求确认** - 整理功能细节，明确移动端核心场景
- 💻 **开发实现** - 移动端优先的前端开发
- 🔍 **本地测试** - 推送前必须完成移动端真机/模拟器验证（关键！）
- 🚀 **部署上线** - GitHub Pages 自动部署
- ✅ **验证验收** - 移动端冒烟测试、性能检测

---

## ⚠️ 移动端通用 Agent 能力（重要）

### 1. 移动端交互设计原则

**触摸友好：**
- 点击区域最小 44×44px（Apple HIG）或 48×48dp（Material Design）
- 按钮间距至少 8px，避免误触
- 悬停状态改为 `:active` 或触摸反馈
- 禁用 `user-select: none` 防止误选文字

**视口适配：**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

**安全区域处理（刘海屏/灵动岛）：**
```css
/* 适配刘海屏 */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 2. 移动端性能优化

**渲染性能：**
- 使用 `transform` 和 `opacity` 做动画（GPU 加速）
- 避免触发重排（layout）的属性动画
- 使用 `will-change` 谨慎优化
- 虚拟列表处理长列表（>50 项）

**加载性能：**
- 首屏资源 < 1MB
- 图片懒加载 + WebP 格式
- 字体使用 `font-display: swap`
- 关键 CSS 内联

**内存管理：**
- 及时清理事件监听
- 图片使用合适尺寸，避免内存溢出
- 页面隐藏时暂停动画/定时器

### 3. 移动端手势与输入

**手势支持：**
```javascript
// 基础手势检测
touchstart → touchmove → touchend
// 计算滑动方向、距离、速度
// 双指缩放：计算两点距离变化
// 长按：定时器判断
```

**⚠️ 手势与点击事件冲突处理：**
- 手势代码中不要使用 `isGesturing` 变量阻止点击事件
- 点击事件应该直接绑定到 `.intersection` 元素，通过 BoardRenderer 的 `onIntersectionClick` 回调处理
- 手势缩放和平移应该由 BoardRenderer 统一管理，避免每个页面重复实现

**虚拟键盘处理：**
```css
/* 键盘弹出时调整布局 */
@media (max-height: 500px) {
  /* 键盘弹出时的紧凑布局 */
}
```

**输入优化：**
- 使用正确的 input type（tel、email、number）
- 自动聚焦 + 键盘弹出
- 输入框在可视区域内（防止被键盘遮挡）

### 4. 外部资源依赖处理

**核心原则：** 当项目依赖外部资源（图片/API/字体等）时，**永远准备后备方案**

**图片后备方案：**
```html
<div class="img-container">
  <img src="image.webp" 
       onerror="this.src='fallback.jpg'; this.onerror=null;" 
       alt="描述">
</div>
```

**API 降级方案：**
```javascript
try {
  const data = await fetchData()
  setData(data)
} catch (error) {
  setError('加载失败，请重试')
  setData(fallbackData) // 使用本地缓存或默认数据
}
```

**Google Fonts 等外部字体加载失败：**
- 这是常见的网络问题，不影响核心业务功能
- 浏览器会自动回退到系统默认字体
- 如需确保字体一致性，可将字体文件下载到本地项目

**Agent 行为准则：**
- 引入外部资源时，同步实现后备方案
- 使用 `onError` / `onReject` 监听加载失败
- 失败时显示友好的错误提示和重试按钮
- **控制台看到 `net::ERR_ABORTED` 字体加载失败时，确认是网络问题即可，无需修复**

### 5. 资源可访问性验证

**验证流程：**
```bash
# 测试链接是否可访问
curl -I "资源URL" 2>&1 | head -n 10
```

**Agent 行为准则：**
- 当用户提供外部链接 → 立即用 curl 验证
- 发现链接失效 → 自动寻找替代方案
- 无法验证时 → 告知用户并请求确认

---

## 使用流程

### 阶段 1: 需求确认

**步骤：**
1. 与用户确认核心功能
2. 确认项目技术栈（纯 HTML/CSS/JS、Vue、React 等）
3. 明确移动端核心场景（触屏、手势、离线）
4. 整理功能清单和优先级

**移动端特有问题：**
- 目标设备范围（iOS Safari、Android Chrome、微信内置浏览器）
- 是否需要 PWA（添加到主屏、离线使用）
- 是否需要原生能力（相机、定位、震动）

**输出：**
- 功能列表（优先级排序）
- 页面结构规划
- 移动端交互流程图

---

### 阶段 2: 开发实现

**移动端优先开发 checklist：**

#### 基础设置
- [ ] viewport meta 标签正确设置
- [ ] 安全区域适配（env(safe-area-inset-*)）
- [ ] 禁止页面缩放（或限制缩放范围）
- [ ] 字体大小使用 rem 或 vw 适配
- [ ] 触摸高亮样式优化（`-webkit-tap-highlight-color`）

#### 布局适配
- [ ] 使用 flexbox/grid 布局
- [ ] 响应式断点（320px、375px、414px、768px）
- [ ] 底部固定栏适配安全区域
- [ ] 横屏/竖屏适配

#### 交互优化
- [ ] 按钮点击区域 ≥ 44px
- [ ] 添加触摸反馈（:active 或涟漪效果）
- [ ] 禁用双击缩放（`touch-action: manipulation`）
- [ ] 长按菜单处理（`-webkit-touch-callout: none`）
- [ ] 滑动手势支持（轮播、下拉刷新、侧滑菜单）

#### 性能优化
- [ ] 图片懒加载
- [ ] 使用 WebP 格式
- [ ] CSS 动画使用 transform/opacity
- [ ] 避免重排重绘
- [ ] 代码分割/按需加载

**检查点：**
- 代码可运行
- 基础功能完整
- 移动端布局适配
- 触摸交互流畅

**⚠️ 资源依赖检查（必须执行）：**
- 识别所有外部依赖（图片、图标库、API、字体等）
- 为每个外部资源准备后备方案
- 实现 onError/onReject 处理加载失败

---

### 阶段 3: 安全检查与本地测试（**必须执行，禁止跳过**）

#### ⚠️ 重要：移动端本地测试流程（**推送前必做**）

##### 1. 启动本地服务器
```bash
# 在项目根目录启动本地服务器
python3 -m http.server 8080
# 或使用其他方式（npm run dev、live-server 等）
```

##### 2. 多设备验证
**方式 A：浏览器开发者工具（基础）**
- Chrome DevTools → Toggle device toolbar
- 测试多种设备尺寸（iPhone SE、iPhone 14 Pro、Pixel 7、iPad）
- 模拟触摸事件、网络节流（3G/4G）

**方式 B：真机测试（推荐）**
```bash
# 获取本机 IP
ifconfig | grep "inet " | head -n 1
# 手机访问 http://<本机IP>:8080
```
- iOS Safari 需要开启「开发」菜单
- Android Chrome 使用 chrome://inspect

##### 3. 功能测试检查清单
- [ ] 页面可正常加载，无控制台报错
- [ ] 按钮点击响应正常，触摸区域足够大
- [ ] 表单输入正常，虚拟键盘不遮挡输入框
- [ ] 滑动手势流畅（轮播、下拉、侧滑）
- [ ] 双指缩放正常（如地图、图片查看器）
- [ ] 横竖屏切换布局正常
- [ ] 底部固定元素不遮挡内容
- [ ] 页面滚动流畅，无卡顿
- [ ] 数据存储/读取正常
- [ ] 新增功能按预期工作
- [ ] 外部资源加载正常（图片/字体/图标等）
- [ ] 外部资源后备方案生效
- [ ] **Google Fonts 等字体加载失败（`net::ERR_ABORTED`）是网络问题，不影响功能，无需修复**
- [ ] 弱网/离线场景测试（Network throttling）

##### 4. 性能测试
```bash
# Lighthouse 性能评分（Chrome DevTools → Lighthouse）
# 目标：Performance ≥ 60，Accessibility ≥ 90
```
- [ ] 首屏加载时间 < 3s（3G 网络）
- [ ] 交互响应时间 < 100ms
- [ ] 滚动帧率 > 50fps
- [ ] 内存占用合理（无泄漏）

**⚠️ 如果发现任何问题，先修复问题并重新测试，确认无误后再推送！**

#### 🔑 密钥扫描
检查代码中是否有硬编码的敏感信息：
```bash
# 简单模式：搜索常见关键词
grep -r -E "(sk_|password|token|secret|private_key)" --include="*.js" --include="*.html" --include="*.css" .
```

#### 🔗 外部资源验证（必须执行）
- 测试所有外部链接可访问性（使用 curl -I）
- 验证 CDN 和第三方库可用
- 确认图标库资源完整加载

#### 🔗 JS 依赖链检查（关键！）
```bash
# 1. 检查每个 HTML 文件的脚本加载顺序
grep -n "<script src" pages/*.html

# 2. 确认共享模块的依赖关系
grep -r "class.*Manager\|const.*Manager" js/
```

**示例（正确顺序）：**
```html
<script src="../js/utils.js"></script>
<script src="../js/storage.js"></script>
<script src="../js/header.js"></script>
```

**⚠️ 重构时特别注意：**
- 提取公共组件到独立 JS 文件后，**所有引用页面必须同步更新 script src**
- 被提取的代码中如果依赖 `this.xxx`，确保新类的 constructor 中仍然定义这些属性
- 重构后检查所有调用旧方法的地方（如 `Storage.saveGame` → `Storage.addGame`）

---

### 阶段 4: GitHub Pages 部署

**前提检查：**
1. ✅ 本地测试已完成，无问题
2. ✅ 移动端功能验证通过
3. 项目已推送到 GitHub 仓库
4. 仓库 Settings → Pages 已启用（Source 选择 GitHub Actions）

**部署步骤：**
1. 创建/检查 `.github/workflows/deploy.yml`
2. 提交并推送代码
3. 触发 GitHub Actions 自动部署
4. 等待部署完成（约 1-3 分钟）
5. 验证访问地址：`https://<username>.github.io/<repo>/`

**标准 deploy.yml 模板：**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main, master]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 阶段 5: 验证验收

**移动端检查清单：**
- ✅ 网站可正常访问
- ✅ 所有页面链接可跳转
- ✅ 核心功能正常运行
- ✅ 触摸交互流畅（点击、滑动、缩放）
- ✅ 响应式布局适配各种屏幕
- ✅ 横竖屏切换正常
- ✅ 底部安全区域适配
- ✅ 虚拟键盘不遮挡输入
- ✅ 外部资源正确加载
- ✅ 弱网/离线场景有降级方案
- ✅ Lighthouse 评分合格

**验证步骤：**
1. 访问部署地址
2. 使用真机测试（iOS + Android）
3. 测试核心功能
4. 检查浏览器控制台错误
5. 测试不同网络环境（WiFi/4G/3G/离线）
6. 确认后备方案在资源加载失败时正常工作

---

## 阶段 6: 移动端优化检查清单

### 性能优化

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| 首屏加载 < 3s | 3G 网络下首屏可见时间 | 🔴 高 |
| 图片懒加载 | 视口外图片延迟加载 | 🔴 高 |
| WebP 格式 | 现代图片格式，体积更小 | 🟡 中 |
| 字体加载优化 | `font-display: swap` 避免阻塞 | 🟡 中 |
| CSS 动画 GPU 加速 | 使用 transform/opacity | 🔴 高 |
| 虚拟列表 | 长列表只渲染可视区域 | 🟡 中 |
| 代码分割 | 按需加载，减少首屏 JS | 🟢 低 |
| Service Worker 缓存 | 静态资源离线缓存 | 🟡 中 |
| 内存管理 | 及时清理，避免泄漏 | 🟡 中 |
| **组件抽象复用** | **提取公共组件（如 BoardRenderer），避免多页面重复代码** | 🔴 **高** |

### 用户体验

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| 触摸区域 ≥ 44px | 防止误触 | 🔴 高 |
| 触摸反馈 | :active 或涟漪效果 | 🔴 高 |
| 加载状态反馈 | 骨架屏/加载动画 | 🔴 高 |
| 空状态提示 | 无数据时友好提示 | 🟡 中 |
| 错误状态处理 | 网络错误提示 + 重试 | 🔴 高 |
| 下拉刷新 | 列表页面支持 | 🟡 中 |
| 上拉加载更多 | 分页加载 | 🟡 中 |
| 侧滑返回 | 符合移动端习惯 | 🟢 低 |
| 震动反馈 | 关键操作触觉反馈 | 🟢 低 |
| 手势操作 | 滑动、缩放、长按 | 🟡 中 |

### 移动端适配

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| viewport 设置 | 禁止缩放或限制缩放 | 🔴 高 |
| 安全区域适配 | 刘海屏、灵动岛、圆角 | 🔴 高 |
| 底部固定栏 | 适配安全区域 + 键盘弹出 | 🔴 高 |
| 横竖屏适配 | 布局不错乱 | 🟡 中 |
| 1px 边框 | 高清屏适配 | 🟡 中 |
| 字体大小适配 | rem/vw 方案 | 🟡 中 |
| 禁用双击缩放 | `touch-action: manipulation` | 🔴 高 |
| 禁止文字选中 | `-webkit-user-select: none` | 🟢 低 |
| **Canvas/棋盘自适应** | **使用 CSS 变量（`--cell-size`）动态适配不同屏幕尺寸** | 🔴 **高** |
| **棋子尺寸动态计算** | **棋子、交叉点、坐标标签尺寸必须跟随 `cellSize` 变化** | 🔴 **高** |

### 可访问性

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| 色彩对比度 | WCAG AA 标准（4.5:1） | 🟡 中 |
| 焦点可见性 | 键盘导航焦点清晰 | 🟢 低 |
| ARIA 标签 | 交互元素语义化 | 🟢 低 |
| 语义化 HTML | 正确使用标签 | 🟡 中 |
| 屏幕阅读器 | alt 文本、label | 🟡 中 |

### PWA 支持（可选）

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| Web App Manifest | 添加到主屏配置 | 🟢 低 |
| Service Worker | 离线缓存 | 🟢 低 |
| 图标配置 | 各尺寸图标 | 🟢 低 |
| 启动画面 | 启动时显示 | 🟢 低 |

---

## 最佳实践

### 开发流程（必遵守）
- **改代码前确认**：所有代码改动前，先向用户说明改动思路，获得确认后再执行
- **交付可访问地址**：可上线版本完成后，必须提供最终访问 URL

### ⚠️ 标准开发与部署流程（严格遵守）

```
需求确认 → 开发实现 → 本地测试（含移动端） → 修复问题 → 再测试 → 确认无误 → 推送上线 → 线上验证
```

**关键点：**
1. **移动端测试是推送的前置条件**：没有真机/模拟器测试，绝对不能推送代码
2. **控制台检查是必须的**：打开 F12，确认没有错误
3. **功能验证要完整**：测试所有修改过的功能，特别是触摸交互

### 代码规范
- 变量命名清晰有意义
- 添加必要的注释
- 遵循项目已有的代码风格
- 移动端优先的 CSS（`min-width` 而非 `max-width`）

### Git 提交
- 小步提交，每提交一个功能点
- Commit message 格式：`类型: 简短描述`

### 安全性
- **永远不要** 把密钥、密码、Token 提交到代码库
- 使用环境变量或本地存储管理敏感信息

---

## 常见问题

### Q: 移动端点击延迟 300ms？
A: 添加 `<meta name="viewport" content="width=device-width">` 或使用 `touch-action: manipulation`

### Q: 虚拟键盘弹出遮挡输入框？
A: 使用 `scrollIntoView()` 或第三方库（如 `viewport-units-buggyfill`）

### Q: iOS 橡皮筋效果/回弹？
A: `body { overflow: hidden; }` 或 `-webkit-overflow-scrolling: touch`

### Q: 底部固定栏被键盘顶起？
A: 监听 `resize` 事件，键盘弹出时隐藏底部栏或调整布局

### Q: 1px 边框在 Retina 屏上太粗？
A: 使用伪元素 + transform: scale(0.5) 或 border-image

### Q: 页面滚动卡顿？
A: 添加 `-webkit-overflow-scrolling: touch` 或检查是否有大量重排

### Q: 外部资源加载失败？
A: 使用 onError 监听，显示后备内容

### Q: 部署后访问 404？
A: 检查 GitHub Pages 设置和 Actions 配置

### Q: 页面报错 "XXX is not defined"？
A: 检查 JS 依赖链，确认文件引入顺序正确

### Q: 重构后页面报错 "Cannot read properties of undefined (reading 'x')"？
A: 检查被提取的公共组件是否完整保留了原代码中的 `this.xxx` 属性定义

### Q: 重构后页面报错 "XXX is not a function"？
A: 检查方法名是否变更（如 `Storage.saveGame` → `Storage.addGame`），所有调用处需要同步更新

### Q: 推送前忘了测试，上线后发现问题怎么办？
A: 立即回滚，然后在本地修复并充分测试后再推送。

### Q: 每次完成开发测试上线后，应该思考什么问题？
A: **"还有什么可优化的？"** 从性能、体验、功能、内容等维度思考。
