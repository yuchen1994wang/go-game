// 死活题题库
const TsumegoData = {
  // 获取所有题目
  getAll() {
    return this.problems;
  },

  // 根据难度获取题目
  getByDifficulty(difficulty) {
    return this.problems.filter(p => p.difficulty === difficulty);
  },

  // 根据ID获取题目
  getById(id) {
    return this.problems.find(p => p.id === id);
  },

  // 题库（先放几道经典题目，后续可扩展）
  problems: [
    {
      id: 1,
      title: "直三",
      difficulty: "初级",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3]], // 直三形状
        white: [[2,1], [2,2], [2,3], [0,2]] // 被包围的白棋
      },
      correctMoves: [{x: 0, y: 1}, {x: 0, y: 2}], // 正确答案：点在直三中间，缩小眼位
      solution: "点在直三中间是杀棋的要点！点后白棋只剩一个眼，被围的白棋死亡。",
      wrongMoveHint: "不是这个位置，请再想想杀棋的要点。"
    },
    {
      id: 2,
      title: "弯三",
      difficulty: "初级",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [2,1], [2,2]],
        white: [[2,0], [1,2], [2,3], [3,1]] // 弯三形状
      },
      correctMoves: [{x: 2, y: 1}], // 正确答案：点在弯三的拐点
      solution: "点在弯三的拐点是杀棋要点！弯三和直三一样，点在要点上就能杀棋。",
      wrongMoveHint: "不是这个位置，请再想想弯三的要点在哪里。"
    },
    {
      id: 3,
      title: "板六活型",
      difficulty: "初级",
      description: "黑先，做出两只眼活棋",
      size: 6,
      setup: {
        black: [[1,1], [1,2], [1,3], [1,4], [2,1], [3,1]],
        white: [[2,2], [2,3], [2,4], [3,2], [3,3], [3,4]] // 板六
      },
      correctMoves: [{x: 4, y: 1}], // 正确答案：扩大眼位
      solution: "板六已经是活型！黑棋在1位接上，白棋无法入侵。记住：板六是无忧型。",
      wrongMoveHint: "这道题已经活了，看看下一步应该怎么加强。"
    },
    {
      id: 4,
      title: "紧气劫",
      difficulty: "中级",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [1,0]],
        white: [[2,0], [2,1], [1,1]] // 刀把五
      },
      correctMoves: [{x: 1, y: 2}], // 正确答案
      solution: "紧气杀！点在这里，白棋因为气紧无法做活。",
      wrongMoveHint: "请计算清楚白棋的气数，找到杀棋的要点。"
    },
    {
      id: 5,
      title: "倒扑",
      difficulty: "中级",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,1], [0,2], [1,1], [2,1]],
        white: [[1,2], [2,2], [2,0], [3,1], [3,2]] // 梅花五被围
      },
      correctMoves: [{x: 1, y: 0}], // 正确答案：倒扑
      solution: "倒扑！虽然自己会被吃掉一子，但可以吃掉白棋整块。倒扑是常用的吃子手筋！",
      wrongMoveHint: "试试牺牲一子，用倒扑的手筋可以吃掉白棋。"
    },
    {
      id: 6,
      title: "大头鬼",
      difficulty: "高级",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0]],
        white: [[1,1], [1,2], [1,3], [2,0], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3], [4,2]] // 大头鬼形状
      },
      correctMoves: [{x: 4, y: 0}, {x: 4, y: 1}], // 大头鬼的正确走法
      solution: "大头鬼！通过弃子诱导白棋形成紧气状态，最终吃掉白棋。这是经典的手筋！",
      wrongMoveHint: "这是经典的大头鬼手筋，需要通过弃子诱导白棋。"
    }
  ]
};

// 练习统计管理
const TsumegoStats = {
  KEY: 'go_tsumego_stats',

  // 获取所有统计
  getAll() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // 获取单个题目的统计
  get(id) {
    const stats = this.getAll();
    return stats[id] || { attempts: 0, correct: 0 };
  },

  // 记录尝试
  recordAttempt(id, isCorrect) {
    const stats = this.getAll();
    if (!stats[id]) {
      stats[id] = { attempts: 0, correct: 0 };
    }
    stats[id].attempts++;
    if (isCorrect) {
      stats[id].correct++;
    }
    localStorage.setItem(this.KEY, JSON.stringify(stats));
    return stats[id];
  },

  // 获取正确率
  getAccuracy(id) {
    const stat = this.get(id);
    if (stat.attempts === 0) return 0;
    return Math.round((stat.correct / stat.attempts) * 100);
  },

  // 重置统计
  reset(id) {
    const stats = this.getAll();
    if (id) {
      delete stats[id];
    }
    localStorage.setItem(this.KEY, JSON.stringify(stats));
  }
};
