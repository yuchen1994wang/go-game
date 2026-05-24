# 围棋数据统计模块使用指南

## 📁 文件结构

```
go-game-project/
├── js/
│   ├── statistics.js          # 核心统计模块
│   ├── storage.js              # 数据持久化（已存在）
│   └── tsumego-storage.js      # 死活题存储（已存在）
├── css/
│   └── common.css              # 公共样式（已存在）
└── statistics-demo.html        # 使用示例页面
```

## 🚀 快速开始

### 1. 引入依赖

确保在HTML中按正确顺序引入JavaScript文件：

```html
<script src="js/storage.js"></script>
<script src="js/tsumego-storage.js"></script>
<script src="js/statistics.js"></script>
```

### 2. 创建HTML容器

```html
<!-- 用户统计面板 -->
<div id="stats-panel"></div>

<!-- 成长曲线图表 -->
<div id="growth-chart"></div>

<!-- 对局统计 -->
<div id="game-stats"></div>

<!-- 练习统计 -->
<div id="practice-stats"></div>

<!-- 能力雷达图 -->
<div id="radar-chart"></div>
```

### 3. 初始化组件

```javascript
// 初始化所有统计组件
document.addEventListener('DOMContentLoaded', () => {
  // 用户统计面板
  const statsPanel = new StatisticsPanel('stats-panel');
  statsPanel.render();

  // 成长曲线
  const growthChart = new GrowthChart('growth-chart', {
    width: 800,
    height: 400,
    period: 'week'  // day, week, month, all
  });
  growthChart.setData();
  growthChart.render();

  // 对局统计
  const gameStats = new GameStats('game-stats');
  gameStats.render();

  // 练习统计
  const practiceStats = new PracticeStats('practice-stats');
  practiceStats.render();

  // 能力雷达图
  const radarChart = new RadarChart('radar-chart', {
    size: 400,
    levels: 5
  });
  radarChart.setData();
  radarChart.render();
});
```

## 📊 组件详解

### StatisticsPanel - 用户统计面板

显示用户的整体学习数据：

```javascript
const panel = new StatisticsPanel('container-id');

// 更新数据并重新渲染
panel.update();

// 可访问的统计数据
panel.stats = {
  totalGames: 50,           // 总对局数
  aiGames: 30,              // AI对局数
  practiceGames: 20,        // 练习对局数
  aiWinRate: 65.5,          // AI对局胜率 (%)
  practiceAccuracy: 78.2,   // 练习正确率 (%)
  practiceCompleted: 20,    // 练习完成数
  studyDays: 15,            // 学习天数
  totalMoves: 5420          // 总落子数
};
```

### GrowthChart - 成长曲线图表

使用纯SVG绘制的交互式图表：

```javascript
const chart = new GrowthChart('container-id', {
  width: 800,              // 图表宽度
  height: 400,             // 图表高度
  padding: 60,             // 内边距
  period: 'week'           // 时间范围: day, week, month, all
});

// 设置数据（从localStorage读取）
chart.setData();

// 渲染图表
chart.render();

// 特性：
// - 支持多条曲线（AI胜率、练习正确率）
// - 悬停显示详细数据点
// - 切换不同时间范围
// - 动画绘制效果
```

### GameStats - 对局统计

分析用户对局数据：

```javascript
const stats = new GameStats('container-id');
stats.render();

// 返回的统计数据
stats.stats = {
  totalGames: 50,          // 总对局数
  avgMoves: 120,           // 平均手数
  longestGame: 289,         // 最长对局
  shortestGame: 45,         // 最短对局
  currentStreak: 3,         // 当前连续胜/负
  bestStreak: 7,           // 最佳连续记录
  byDifficulty: {           // 按难度分布
    easy: 20,
    medium: 25,
    hard: 5
  },
  byBoardSize: {            // 按棋盘大小分布
    '9x9': 10,
    '13x13': 20,
    '19x19': 20
  }
};
```

### PracticeStats - 练习统计

分析练习数据：

```javascript
const practice = new PracticeStats('container-id');
practice.render();

// 返回的统计数据
practice.stats = {
  totalPracticed: 30,      // 总练习数
  accuracy: 75.5,          // 总体正确率
  avgTime: 45,             // 平均用时（秒）
  wrongCount: 8,           // 错题数
  byDifficulty: {          // 按难度统计
    easy: { total: 10, correct: 9 },
    medium: { total: 15, correct: 10 },
    hard: { total: 5, correct: 2 }
  },
  weakAreas: [             // 薄弱环节
    { type: 'lifeDeath', count: 5 }
  ],
  progress: 25             // 题目进度
};
```

### RadarChart - 能力雷达图

使用SVG绘制的能力雷达图：

```javascript
const radar = new RadarChart('container-id', {
  size: 400,              // 图表尺寸
  levels: 5,              // 等级圈数
  maxValue: 100           // 最大值
});

radar.setData();
radar.render();

// 能力维度
radar.data = {
  layout: 72,             // 布局能力
  lifeDeath: 68,          // 死活能力
  tesuji: 55,             // 手筋能力
  endgame: 80,           // 官子能力
  fighting: 62,           // 中盘战斗能力
  opening: 75             // 定式掌握
};
```

## 🔧 StatisticsService - 数据服务

提供数据查询和更新接口：

```javascript
// 获取总体统计数据
const overview = StatisticsService.getOverview();

// 获取成长数据（按时间范围）
const growthData = StatisticsService.getGrowthData('week'); // day, week, month, all

// 获取能力雷达图数据
const abilityData = StatisticsService.getAbilityRadar();

// 获取对局统计
const gameStats = StatisticsService.getGameStats();

// 获取练习统计详情
const practiceStats = StatisticsService.getPracticeStatsDetailed();

// 更新统计数据（在对局结束后调用）
StatisticsService.updateStats({
  type: 'ai',              // 'ai' 或 'practice'
  difficulty: 'medium',    // 'easy', 'medium', 'hard'
  boardSize: 19,
  moves: 156,
  winner: 1,               // 胜者: 1(黑) 或 2(白)
  playerColor: 1,           // 玩家执黑
  correct: false           // 仅练习对局有效
});
```

## 💾 数据存储

模块使用以下localStorage键值：

```javascript
// 对局历史（来自storage.js）
'go_game_history' - 包含所有对局记录

// 综合统计（statistics.js）
'go_statistics' - {
  games: 50,
  wins: 32,
  moves: 5420,
  streak: { current: 3, best: 7, type: 'win' },
  difficulty: { easy: 20, medium: 25, hard: 5 },
  boardSize: { '9x9': 10, '13x13': 20, '19x19': 20 },
  lastGames: [...]
}

// 练习统计（statistics.js）
'go_practice_stats' - 练习相关统计数据

// 死活题数据（来自tsumego-storage.js）
'go_tsumego_progress' - 题目进度
'go_tsumego_wrong' - 错题列表
'go_tsumego_best' - 最佳时间
'go_tsumego_best_steps' - 最佳步数
```

## 🎨 样式定制

组件使用CSS变量，可以轻松定制主题：

```css
:root {
  --accent-gold: #B8860B;     /* 金色 - 用于主要数据 */
  --accent-red: #C41E3A;      /* 红色 - 用于强调 */
  --success: #2E7D32;         /* 绿色 - 用于成功指标 */
  --panel-bg: rgba(255, 252, 245, 0.95);  /* 面板背景 */
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 8px 32px rgba(0, 0, 0, 0.12);
  --border-color: rgba(44, 24, 16, 0.15);
}

[data-theme="dark"] {
  --accent-gold: #FFD54F;
  --accent-red: #EF5350;
  --success: #66BB6A;
  --panel-bg: rgba(30, 30, 30, 0.95);
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-medium: 0 8px 32px rgba(0, 0, 0, 0.4);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

## ✨ 动画效果

所有组件都包含丰富的动画效果：

1. **数字增长动画** - 统计面板中的数字从0增长到实际值
2. **图表绘制动画** - 曲线从左到右逐渐绘制
3. **悬停高亮** - 鼠标悬停时元素放大高亮
4. **平滑过渡** - 所有交互都有流畅的过渡效果

## 📱 响应式设计

组件完全适配移动端：

```css
/* 桌面端：网格布局 */
@media (min-width: 769px) {
  .stats-panel {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 移动端：单列堆叠 */
@media (max-width: 768px) {
  .stats-panel {
    grid-template-columns: 1fr;
  }

  .period-selector {
    width: 100%;
    overflow-x: auto;
  }
}
```

## 🔄 更新数据

当对局结束后，更新统计数据的示例：

```javascript
// 游戏结束时的回调
function onGameEnd(gameResult) {
  const gameData = {
    type: gameResult.isPractice ? 'practice' : 'ai',
    difficulty: gameResult.difficulty || 'medium',
    boardSize: gameResult.boardSize || 19,
    moves: gameResult.moveCount,
    winner: gameResult.winner,
    playerColor: gameResult.playerColor,
    correct: gameResult.isCorrect
  };

  // 更新统计数据
  StatisticsService.updateStats(gameData);

  // 更新UI
  statsPanel.update();
  gameStats.update();
  growthChart.setData();
  growthChart.render();
}
```

## 🧪 测试数据生成

示例页面提供了测试数据生成功能：

```javascript
// 生成30条模拟对局数据
function generateDemoData() {
  for (let i = 0; i < 30; i++) {
    const gameData = {
      type: Math.random() > 0.5 ? 'ai' : 'practice',
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      boardSize: [9, 13, 19][Math.floor(Math.random() * 3)],
      moves: 50 + Math.floor(Math.random() * 200),
      winner: Math.random() > 0.5 ? 1 : 2,
      playerColor: 1,
      correct: Math.random() > 0.3,
      savedAt: new Date().toISOString()
    };
    Storage.addGame(gameData);
  }
}
```

## 📝 注意事项

1. **依赖项** - 确保 `storage.js` 和 `tsumego-storage.js` 在 `statistics.js` 之前加载
2. **主题支持** - 组件自动适配亮色/暗色主题（通过 `data-theme` 属性）
3. **性能** - 大数据量时考虑添加数据分页或懒加载
4. **清理** - 定期清理过期的对局历史以优化性能

## 🎯 下一步

- 查看 `statistics-demo.html` 了解完整的使用示例
- 根据项目需求自定义组件样式
- 集成到现有的围棋游戏页面中
