// 死活题题库
const TsumegoData = {
  getAll() {
    return this.problems;
  },

  getByDifficulty(difficulty) {
    return this.problems.filter(p => p.difficulty === difficulty);
  },

  getById(id) {
    return this.problems.find(p => p.id === id);
  },

  problems: [
    // ============ 初级 - 基础形状 ============
    {
      id: 1,
      title: "直三",
      difficulty: "初级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3]],
        white: [[2,1], [2,2], [2,3], [0,2]]
      },
      correctMoves: [{x: 0, y: 1}, {x: 0, y: 2}],
      solution: "点在直三中间是杀棋的要点！点后白棋只剩一个眼，被围的白棋死亡。",
      wrongMoveHint: "直三的要点在中间，缩小白棋的眼位。"
    },
    {
      id: 2,
      title: "弯三",
      difficulty: "初级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [2,1], [2,2]],
        white: [[2,0], [1,2], [2,3], [3,1]]
      },
      correctMoves: [{x: 2, y: 1}],
      solution: "点在弯三的拐点是杀棋要点！弯三和直三一样，点在要点上就能杀棋。",
      wrongMoveHint: "弯三的要点在拐角处，找到那个突出的点。"
    },
    {
      id: 3,
      title: "刀把五（刀五）",
      difficulty: "初级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [1,1], [2,1], [2,0]],
        white: [[1,0], [0,2], [1,2], [2,2]]
      },
      correctMoves: [{x: 0, y: 2}, {x: 1, y: 2}],
      solution: "刀五的要点在"刀柄"处！白1点点眼，黑2接则白3点另一边，黑棋做不出两只眼。",
      wrongMoveHint: "刀五的要点在刀柄的接口处，缩小眼的空间。"
    },
    {
      id: 4,
      title: "梅花五（花五）",
      difficulty: "初级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3], [2,1], [3,2]],
        white: [[2,0], [0,2], [2,2], [4,2], [2,4]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "梅花五的要点在中心！点中心后，白棋无论怎么走都只能做出一个眼。",
      wrongMoveHint: "梅花五的要点在正中间，点击棋形的中心点。"
    },
    {
      id: 5,
      title: "方四",
      difficulty: "初级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 4,
      setup: {
        black: [[0,0], [0,1], [1,0], [2,0], [2,1]],
        white: [[1,1], [0,2], [1,2]]
      },
      correctMoves: [{x: 0, y: 2}, {x: 1, y: 2}],
      solution: "方四已经是死形！无论黑棋怎么走，白棋都只能做一个眼。点在一角即可杀棋。",
      wrongMoveHint: "方四是典型的死形，随便点在哪里都能杀，找一个角试试。"
    },
    {
      id: 6,
      title: "直四（活型）",
      difficulty: "初级",
      type: "live",
      description: "黑先，做出两只眼活棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3], [1,4], [2,1], [2,4]],
        white: [[2,2], [2,3]]
      },
      correctMoves: [{x: 3, y: 1}],
      solution: "直四是活型！黑棋在1位补棋，白棋无法入侵。记住：四以上的棋形通常是活的。",
      wrongMoveHint: "直四已经是活棋，找一个可以扩大眼位的地方。"
    },
    // ============ 中级 - 手筋题 ============
    {
      id: 7,
      title: "紧气劫",
      difficulty: "中级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [1,0]],
        white: [[2,0], [2,1], [1,1]]
      },
      correctMoves: [{x: 1, y: 2}],
      solution: "紧气杀！点在这里紧气，白棋因为气紧无法做活。",
      wrongMoveHint: "请计算清楚白棋的气数，找到杀棋的要点。"
    },
    {
      id: 8,
      title: "倒扑",
      difficulty: "中级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,1], [0,2], [1,1], [2,1]],
        white: [[1,2], [2,2], [2,0], [3,1], [3,2]]
      },
      correctMoves: [{x: 1, y: 0}],
      solution: "倒扑！虽然自己会被吃掉一子，但可以吃掉白棋整块。倒扑是常用的吃子手筋！",
      wrongMoveHint: "试试牺牲一子，用倒扑的手筋可以吃掉白棋。"
    },
    {
      id: 9,
      title: "金鸡独立",
      difficulty: "中级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [0,3], [1,0], [2,0]],
        white: [[1,1], [1,2], [1,3], [2,1], [2,2]]
      },
      correctMoves: [{x: 3, y: 0}],
      solution: "金鸡独立！黑棋利用边线，让白棋无法在边角做活。点是边线外的那一步！",
      wrongMoveHint: "金鸡独立利用的是棋子在边线的特性，找找边线上的要点。"
    },
    {
      id: 10,
      title: "大头鬼",
      difficulty: "中级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0]],
        white: [[1,1], [1,2], [1,3], [2,0], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3], [4,2]]
      },
      correctMoves: [{x: 4, y: 0}],
      solution: "大头鬼！通过弃子诱导白棋形成紧气状态，最终吃掉白棋。这是经典的手筋！",
      wrongMoveHint: "这是经典的大头鬼手筋，需要通过弃子诱导白棋。"
    },
    {
      id: 11,
      title: "老鼠偷油",
      difficulty: "中级",
      type: "kill",
      description: "黑先，吃掉角上白棋",
      size: 5,
      setup: {
        black: [[0,0], [1,0], [2,0], [0,1], [3,1], [0,2]],
        white: [[1,1], [2,1], [1,2], [2,2]]
      },
      correctMoves: [{x: 1, y: 3}],
      solution: "老鼠偷油！利用角部的特殊特性，通过巧妙的次序吃掉角上的白棋。",
      wrongMoveHint: "试试角部的特殊走法，利用角上的特性。"
    },
    {
      id: 12,
      title: "胀牝牛",
      difficulty: "中级",
      type: "live",
      description: "黑先，做出两只眼活棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [2,0]],
        white: [[1,1], [2,1], [1,2]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "胀牝牛！利用对方气紧的特性，通过胀过去做出两只眼。点是关键的那一步！",
      wrongMoveHint: "胀牝牛的关键是利用对方气紧，找找能胀过去的位置。"
    },
    // ============ 高级 - 多步题 ============
    {
      id: 13,
      title: "相思断",
      difficulty: "高级",
      type: "kill",
      description: "黑先，吃掉联络的白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [1,1], [2,0]],
        white: [[1,2], [2,1], [2,2], [3,1], [3,2]]
      },
      correctMoves: [{x: 3, y: 0}],
      solution: "相思断！通过切断白棋的联络，使其成为被围之子。这是高级的切断手筋！",
      wrongMoveHint: "相思断的关键是切断，找找能断掉白棋联络的位置。"
    },
    {
      id: 14,
      title: "征子",
      difficulty: "高级",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 7,
      setup: {
        black: [[0,2], [1,2], [2,2], [3,2], [4,2]],
        white: [[2,1], [3,1], [4,1], [5,1], [3,0], [4,0]]
      },
      correctMoves: [{x: 2, y: 0}],
      solution: "征子（也叫追吃）！通过连续叫吃，迫使对方在逃跑时气越来越紧，最终被吃。",
      wrongMoveHint: "征子是追着打的吃子方法，需要计算逃跑方向和己方的叫吃方向。"
    },
    {
      id: 15,
      title: "接不归",
      difficulty: "高级",
      type: "kill",
      description: "黑先，让白棋接不归",
      size: 5,
      setup: {
        black: [[0,1], [1,1], [2,1], [3,1]],
        white: [[1,0], [2,0], [1,2], [2,2]]
      },
      correctMoves: [{x: 0, y: 0}],
      solution: "接不归！通过扑和紧气，让对方想接但接不回去。点是关键的那一步！",
      wrongMoveHint: "接不归的关键是让对方想接但气不够，找找能扑进去的位置。"
    }
  ]
};

// 练习统计管理
const TsumegoStats = {
  KEY: 'go_tsumego_stats',

  getAll() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  get(id) {
    const stats = this.getAll();
    return stats[id] || { attempts: 0, correct: 0 };
  },

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

  getAccuracy(id) {
    const stat = this.get(id);
    if (stat.attempts === 0) return 0;
    return Math.round((stat.correct / stat.attempts) * 100);
  },

  reset(id) {
    const stats = this.getAll();
    if (id) {
      delete stats[id];
    }
    localStorage.setItem(this.KEY, JSON.stringify(stats));
  }
};
