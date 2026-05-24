// 死活题题库
const TsumegoData = {
  getAll() {
    return this.problems;
  },

  getByDifficulty(difficulty) {
    return this.problems.filter(p => p.difficulty === difficulty);
  },

  getByLocation(location) {
    if (location === '全部') {return this.problems;}
    return this.problems.filter(p => p.location === location);
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
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3]],
        white: [[2,1], [2,2], [2,3], [0,2]]
      },
      correctMoves: [{x: 0, y: 1}],
      solution: "点在直三中间是杀棋的要点！点后白棋只剩一个眼，被围的白棋死亡。",
      wrongMoveHint: "直三的要点在中间，缩小白棋的眼位。",
      hint: "这是典型的直三死活题！要点在棋形的正中间。白棋如果被点在中间，只能做出一个大眼，无法活棋。请尝试点击 (0,1) 或 (0,2) 位置！"
    },
    {
      id: 2,
      title: "弯三",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [1,3], [2,2]],
        white: [[2,0], [1,2], [2,3], [3,1]]
      },
      correctMoves: [{x: 2, y: 1}],
      solution: "点在弯三的拐点是杀棋要点！弯三和直三一样，点在要点上就能杀棋。",
      wrongMoveHint: "弯三的要点在拐角处，找到那个突出的点。",
      hint: "弯三的要点在棋形的拐弯处！虽然形状是弯曲的，但死活原理和直三一样，都要点在中心点。请尝试点击 (2,1) 位置！"
    },
    {
      id: 3,
      title: "刀把五（刀五）",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [0,3], [1,0], [1,3], [2,0], [2,3], [3,1], [3,2]],
        white: [[1,1], [1,2], [2,1], [3,0]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: '刀五的要点在"刀柄"处！点在(2,2)位置，白棋就做不出两只眼了。',
      wrongMoveHint: "刀五的要点在刀柄的接口处，找到棋形的中心点。",
      hint: '刀五形状像一把刀，要点在刀柄和刀身的连接处！点在(2,2)位置，白棋就被点死了。刀五是死形，一点就死！'
    },
    {
      id: 4,
      title: "梅花五（花五）",
      difficulty: "初级",
      location: "中腹",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3], [2,1], [3,2]],
        white: [[2,0], [0,2], [2,3], [4,2], [2,4]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "梅花五的要点在中心！点中心后，白棋无论怎么走都只能做出一个眼。",
      wrongMoveHint: "梅花五的要点在正中间，点击棋形的中心点。",
      hint: "梅花五是经典的死活题！形状像一朵梅花，要点在正中心(2,2)。点中心后，白棋无论怎么走都只能做出一个眼，无法活棋！"
    },
    {
      id: 5,
      title: "方四",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 4,
      setup: {
        black: [[0,0], [0,1], [1,0], [2,0], [2,1]],
        white: [[1,1], [0,2], [1,2]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "方四已经是死形！无论黑棋怎么走，白棋都只能做一个眼。点在一角即可杀棋。",
      wrongMoveHint: "方四是典型的死形，随便点在哪里都能杀，找一个角试试。",
      hint: "方四是典型的死形！就算黑棋不走，白棋也做不出两只眼。你可以随便点在 (0,2) 或 (1,2) 位置！"
    },
    {
      id: 6,
      title: "直四（活型）",
      difficulty: "初级",
      location: "边路",
      type: "live",
      description: "黑先，做出两只眼活棋",
      size: 5,
      setup: {
        black: [[1,1], [1,2], [1,3], [1,4], [2,1], [2,4]],
        white: [[2,2], [2,3]]
      },
      correctMoves: [{x: 3, y: 1}],
      solution: "直四是活型！黑棋在1位补棋，白棋无法入侵。记住：四以上的棋形通常是活的。",
      wrongMoveHint: "直四已经是活棋，找一个可以扩大眼位的地方。",
      hint: "直四是活形！黑棋需要巩固自己的眼位。请尝试点击 (3,1) 位置，扩大眼位确保活棋！"
    },
    // ============ 中级 - 手筋题 ============
    {
      id: 7,
      title: "紧气劫",
      difficulty: "中级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [1,0]],
        white: [[2,0], [2,1], [1,1]]
      },
      correctMoves: [{x: 1, y: 2}],
      solution: "紧气杀！点在这里紧气，白棋因为气紧无法做活。",
      wrongMoveHint: "请计算清楚白棋的气数，找到杀棋的要点。",
      hint: "这是一道紧气杀的题目！请计算白棋的气数，找到能紧气的位置。请尝试点击 (1,2) 位置！"
    },
    {
      id: 8,
      title: "倒扑",
      difficulty: "中级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,1], [0,2], [1,1], [2,1]],
        white: [[1,2], [2,2], [2,0], [3,1], [3,2]]
      },
      correctMoves: [{x: 1, y: 0}],
      solution: "倒扑！虽然自己会被吃掉一子，但可以吃掉白棋整块。倒扑是常用的吃子手筋！",
      wrongMoveHint: "试试牺牲一子，用倒扑的手筋可以吃掉白棋。",
      hint: "倒扑是经典的吃子手筋！需要先牺牲一子，然后吃掉对方更多的子。请尝试点击 (1,0) 位置，虽然会被白棋吃掉，但你可以反吃回来！"
    },
    {
      id: 9,
      title: "金鸡独立",
      difficulty: "中级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [0,3], [1,0], [2,0]],
        white: [[1,1], [1,2], [1,3], [2,1], [2,2]]
      },
      correctMoves: [{x: 3, y: 0}],
      solution: "金鸡独立！黑棋利用边线，让白棋无法在边角做活。点是边线外的那一步！",
      wrongMoveHint: "金鸡独立利用的是棋子在边线的特性，找找边线上的要点。",
      hint: "金鸡独立是利用边线的手筋！白棋两边都不能入气，所以无法吃掉黑棋。请尝试点击 (3,0) 位置！"
    },
    {
      id: 10,
      title: "大头鬼",
      difficulty: "中级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0]],
        white: [[1,1], [1,2], [1,3], [2,0], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3], [4,2]]
      },
      correctMoves: [{x: 4, y: 0}],
      solution: "大头鬼！通过弃子诱导白棋形成紧气状态，最终吃掉白棋。这是经典的手筋！",
      wrongMoveHint: "这是经典的大头鬼手筋，需要通过弃子诱导白棋。",
      hint: "大头鬼是经典的弃子手筋！通过牺牲几子，让白棋气变紧，最终吃掉白棋。请尝试点击 (4,0) 位置！"
    },
    {
      id: 11,
      title: "老鼠偷油",
      difficulty: "中级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉角上白棋",
      size: 5,
      setup: {
        black: [[0,0], [1,0], [2,0], [0,1], [3,1], [0,2]],
        white: [[1,1], [2,1], [1,2], [2,2]]
      },
      correctMoves: [{x: 1, y: 3}],
      solution: "老鼠偷油！利用角部的特殊特性，通过巧妙的次序吃掉角上的白棋。",
      wrongMoveHint: "试试角部的特殊走法，利用角上的特性。",
      hint: "老鼠偷油是角部的经典死活！利用角上只能连不能断的特性。请尝试点击 (1,3) 位置！"
    },
    {
      id: 12,
      title: "胀牝牛",
      difficulty: "中级",
      location: "角部",
      type: "live",
      description: "黑先，做出两只眼活棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [2,0]],
        white: [[1,1], [2,1], [1,2]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "胀牝牛！利用对方气紧的特性，通过胀过去做出两只眼。点是关键的那一步！",
      wrongMoveHint: "胀牝牛的关键是利用对方气紧，找找能胀过去的位置。",
      hint: "胀牝牛是利用对方气紧的活棋手筋！白棋气紧，无法阻止黑棋胀过去做眼。请尝试点击 (2,2) 位置！"
    },
    // ============ 高级 - 多步题 ============
    {
      id: 13,
      title: "相思断",
      difficulty: "高级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉联络的白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [1,1], [2,0]],
        white: [[1,2], [2,1], [2,2], [3,1], [3,2]]
      },
      correctMoves: [{x: 3, y: 0}],
      solution: "相思断！通过切断白棋的联络，使其成为被围之子。这是高级的切断手筋！",
      wrongMoveHint: "相思断的关键是切断，找找能断掉白棋联络的位置。",
      hint: "相思断是经典的切断手筋！通过巧妙的手段切断白棋的联络。请尝试点击 (3,0) 位置！"
    },
    {
      id: 14,
      title: "征子",
      difficulty: "高级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 7,
      setup: {
        black: [[0,2], [1,2], [2,2], [3,2], [4,2]],
        white: [[2,1], [3,1], [4,1], [5,1], [3,0], [4,0]]
      },
      correctMoves: [{x: 2, y: 0}],
      solution: "征子（也叫追吃）！通过连续叫吃，迫使对方在逃跑时气越来越紧，最终被吃。",
      wrongMoveHint: "征子是追着打的吃子方法，需要计算逃跑方向和己方的叫吃方向。",
      hint: "征子是经典的追吃手筋！通过连续叫吃，追着白棋跑，让它气越来越紧。请尝试点击 (2,0) 位置开始叫吃！"
    },
    {
      id: 15,
      title: "接不归",
      difficulty: "高级",
      location: "中腹",
      type: "kill",
      description: "黑先，让白棋接不归",
      size: 5,
      setup: {
        black: [[0,1], [1,1], [2,1], [3,1]],
        white: [[1,0], [2,0], [1,2], [2,2]]
      },
      correctMoves: [{x: 0, y: 0}],
      solution: "接不归！通过扑和紧气，让对方想接但接不回去。点是关键的那一步！",
      wrongMoveHint: "接不归的关键是让对方想接但气不够，找找能扑进去的位置。",
      hint: "接不归是经典的吃子手筋！通过扑进去，让白棋想接但接不回去。请尝试点击 (0,0) 位置！"
    },
    // ============ 新增题目 ============
    // 初级题
    {
      id: 16,
      title: "曲四",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,1], [0,2], [1,0], [1,3], [2,0], [2,3]],
        white: [[1,2], [2,1], [2,2]]
      },
      correctMoves: [{x: 1, y: 1}],
      solution: "曲四的要点在内部！点在(1,1)位置，白棋无法做出两只眼。曲四是典型的死活形状。",
      wrongMoveHint: "曲四的要点在内部，找到能缩小眼位的位置。",
      hint: "曲四是经典的死活形状！要点在内部。请尝试点击 (1,1) 位置，点入白棋内部！"
    },
    {
      id: 17,
      title: "闪电四",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [1,3], [2,1]],
        white: [[1,1], [1,2]]
      },
      correctMoves: [{x: 2, y: 0}],
      solution: "闪电四（也叫聚四）的要点在 (2,0)！点在这里，白棋无法做活。",
      wrongMoveHint: "闪电四的要点在突出的位置，找到能缩小眼位的地方。",
      hint: "闪电四是聚四的一种！要点在突出的位置。请尝试点击 (2,0) 位置！"
    },
    {
      id: 18,
      title: "直二（死形）",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 4,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [1,3]],
        white: [[1,1], [1,2]]
      },
      correctMoves: [{x: 0, y: 3}],
      solution: "直二是死形！无论黑棋怎么走，白棋都无法做出两只眼。点击任意位置都能杀棋。",
      wrongMoveHint: "直二是死形，随便点在哪里都可以。",
      hint: "直二是典型的死形！白棋只有两个并排的交叉点，无法做出两只眼。请尝试点击 (1,1) 或 (1,2) 位置！"
    },
    {
      id: 19,
      title: "刀五变形",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [0,3], [1,0], [1,3], [2,3], [3,1], [3,2]],
        white: [[1,1], [1,2], [2,1], [3,0]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "刀五变形的要点还是在中心！点在(2,2)位置，白棋无法做出两只眼。",
      wrongMoveHint: "刀五的要点在中心，找到棋形的中心点。",
      hint: "这是刀五的变形！虽然形状略有不同，但要点还是在中心。请尝试点击 (2,2) 位置！"
    },
    {
      id: 20,
      title: "聚三",
      difficulty: "初级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 4,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [2,0], [2,1]],
        white: [[1,2], [2,2]]
      },
      correctMoves: [{x: 1, y: 1}],
      solution: "聚三（也叫弯三）的要点在中心！点在(1,1)位置，白棋无法做出两只眼。",
      wrongMoveHint: "聚三的要点在中心，找到三个交叉点的中心位置。",
      hint: "聚三的要点在三个交叉点的中心！请尝试点击 (1,1) 位置！"
    },
    // 中级题
    {
      id: 21,
      title: "点方",
      difficulty: "中级",
      location: "中腹",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,1], [0,2], [1,0], [2,0], [3,1], [3,2]],
        white: [[1,2], [2,1], [2,2]]
      },
      correctMoves: [{x: 1, y: 1}],
      solution: "点方是经典的杀棋手筋！点在四个白子围成的正方形中心，白棋无法做活。",
      wrongMoveHint: "点方的要点在四个白子围成的正方形中心位置。",
      hint: "点方是经典手筋！四个白子围成一个正方形，要点在中心。请尝试点击 (1,1) 位置！"
    },
    {
      id: 22,
      title: "黄莺扑蝶",
      difficulty: "中级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,2], [0,3], [1,1], [1,4], [2,0], [2,5]],
        white: [[2,1], [2,2], [2,3], [2,4], [3,2], [3,3]]
      },
      correctMoves: [{x: 3, y: 1}],
      solution: "黄莺扑蝶！通过点在(3,1)位置，缩小白棋的眼位，最终杀掉白棋。",
      wrongMoveHint: "黄莺扑蝶的要点在侧面，找到能缩小眼位的位置。",
      hint: "黄莺扑蝶是经典的杀棋手法！从侧面进攻，缩小白棋的眼位。请尝试点击 (3,1) 位置！"
    },
    {
      id: 23,
      title: "大猪嘴",
      difficulty: "中级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [2,0], [2,1], [2,2]],
        white: [[1,1], [1,2], [2,3], [3,1], [3,2]]
      },
      correctMoves: [{x: 1, y: 3}],
      solution: "大猪嘴的要点在 (1,3)！先扳，再点，白棋无法做活。这是经典的角部死活。",
      wrongMoveHint: "大猪嘴的要点在角部的二一路，找到那个位置。",
      hint: "大猪嘴是经典的角部死活！要点在二一路。请尝试点击 (1,3) 位置！"
    },
    {
      id: 24,
      title: "小猪嘴",
      difficulty: "中级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [1,0], [2,0], [2,1]],
        white: [[1,1], [2,2], [3,1]]
      },
      correctMoves: [{x: 1, y: 2}],
      solution: "小猪嘴的要点在 (1,2)！点在这里，白棋无法做出两只眼。",
      wrongMoveHint: "小猪嘴的要点在白棋内部，找到能破坏眼位的位置。",
      hint: "小猪嘴是大猪嘴的简化版！要点在白棋内部。请尝试点击 (1,2) 位置！"
    },
    {
      id: 25,
      title: "金柜角",
      difficulty: "中级",
      location: "角部",
      type: "live",
      description: "黑先，做出两只眼活棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [2,0]],
        white: [[1,1], [2,1], [1,2], [2,2]]
      },
      correctMoves: [{x: 0, y: 3}],
      solution: "金柜角的活棋要点在 (0,3)！立在这里，黑棋可以确保做出两只眼。",
      wrongMoveHint: "金柜角的活棋要点在一路立，找到那个位置。",
      hint: "金柜角是经典的角部活棋！一路立是要点。请尝试点击 (0,3) 位置！"
    },
    // 高级题
    {
      id: 26,
      title: "倒脱靴",
      difficulty: "高级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,2], [0,3], [1,1], [1,4], [2,2], [2,3]],
        white: [[1,2], [1,3], [3,2], [3,3]]
      },
      correctMoves: [{x: 2, y: 1}],
      solution: "倒脱靴！先让白棋吃掉几子，然后再倒脱回来吃掉白棋。这是高级的弃子手筋！",
      wrongMoveHint: "倒脱靴需要先弃子，再吃回来，计算清楚变化。",
      hint: "倒脱靴是高级弃子手筋！先让白棋吃，再吃回来。请尝试点击 (2,1) 位置！"
    },
    {
      id: 27,
      title: "龙回头",
      difficulty: "高级",
      location: "边路",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,1], [0,2], [0,3], [0,4], [1,0], [1,5]],
        white: [[1,1], [1,2], [1,3], [1,4], [2,2], [2,3]]
      },
      correctMoves: [{x: 2, y: 1}],
      solution: "龙回头！通过巧妙的次序，最终杀掉白棋。这是高级的死活题。",
      wrongMoveHint: "龙回头需要计算多步，找到正确的行棋次序。",
      hint: "龙回头是高级死活！需要仔细计算。请尝试点击 (2,1) 位置！"
    },
    {
      id: 28,
      title: "紧气杀",
      difficulty: "高级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [2,0], [3,1], [3,2]],
        white: [[1,1], [1,2], [2,1], [2,2], [2,3], [3,3]]
      },
      correctMoves: [{x: 1, y: 3}],
      solution: "紧气杀！通过连续紧气，让白棋气尽而亡。这是高级的紧气手筋。",
      wrongMoveHint: "紧气杀需要计算气数，找到正确的紧气次序。",
      hint: "紧气杀是高级手筋！通过连续紧气杀掉白棋。请尝试点击 (1,3) 位置！"
    },
    {
      id: 29,
      title: "活杀",
      difficulty: "高级",
      location: "中腹",
      type: "live",
      description: "黑先，做出两只眼活棋",
      size: 6,
      setup: {
        black: [[0,1], [0,2], [0,3], [1,0], [1,4], [2,1], [2,3]],
        white: [[1,1], [1,2], [1,3]]
      },
      correctMoves: [{x: 2, y: 2}],
      solution: "活杀！虽然看起来危险，但黑棋可以通过巧妙的手段做出两只眼。",
      wrongMoveHint: "活杀需要找到唯一的活棋要点，仔细计算。",
      hint: "活杀是高级活棋！看似危险，但有活路。请尝试点击 (2,2) 位置！"
    },
    {
      id: 30,
      title: "角部八目",
      difficulty: "高级",
      location: "角部",
      type: "kill",
      description: "黑先，吃掉白棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [0,3], [1,0], [2,0], [3,0]],
        white: [[1,2], [1,3], [2,1], [2,2], [2,3], [3,1], [3,2]]
      },
      correctMoves: [{x: 1, y: 1}],
      solution: "角部八目的要点在 (1,1)！点在中心，白棋无法做出两只眼。",
      wrongMoveHint: "角部八目的要点在中心，找到棋形的中心点。",
      hint: "角部八目是经典死活！要点在中心。请尝试点击 (1,1) 位置！"
    },
    // ============ 多步题 ============
    {
      id: 31,
      title: "相思断·续",
      difficulty: "高级",
      location: "边路",
      type: "kill",
      description: "黑先，两步杀棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,0], [1,1], [2,0]],
        white: [[1,2], [2,1], [2,2], [3,1], [3,2]]
      },
      steps: [
        {
          description: "第一步：切断白棋联络",
          correctMoves: [{x: 3, y: 0}],
          solution: "相思断的第一步！点在(3,0)位置切断白棋联络。",
          afterMoves: { white: [[1,2], [2,2]] }
        },
        {
          description: "第二步：叫吃",
          correctMoves: [{x: 1, y: 1}],
          solution: "叫吃！白棋被切断后只剩一口气，可以吃掉。",
          afterMoves: { white: [[2,2]] }
        }
      ],
      correctMoves: [{x: 3, y: 0}],
      solution: "相思断两步杀！先切断再叫吃。",
      wrongMoveHint: "先找切断的要点，再找叫吃的点。",
      hint: "这是两步题！第一步切断白棋联络，第二步叫吃。请仔细计算两步的变化！"
    },
    {
      id: 32,
      title: "倒扑三步",
      difficulty: "高级",
      location: "边路",
      type: "kill",
      description: "黑先，三步杀棋",
      size: 6,
      setup: {
        black: [[0,0], [0,1], [0,2], [1,2], [2,0], [2,1], [3,0]],
        white: [[1,1], [2,2], [3,1], [3,2], [4,1]]
      },
      steps: [
        {
          description: "第一步：扑入",
          correctMoves: [{x: 1, y: 0}],
          solution: "第一步扑入！虽然会被吃，但为后续做准备。",
          afterMoves: { white: [[0,1], [2,2], [3,1]] }
        },
        {
          description: "第二步：叫吃",
          correctMoves: [{x: 2, y: 1}],
          solution: "叫吃！白棋气紧，无法接回。",
          afterMoves: { white: [[0,1], [3,1]] }
        },
        {
          description: "第三步：提子",
          correctMoves: [{x: 1, y: 1}],
          solution: "提掉白子！通过倒扑吃掉白棋整块。",
          afterMoves: {}
        }
      ],
      correctMoves: [{x: 1, y: 0}],
      solution: "倒扑三步杀！扑入→叫吃→提子。",
      wrongMoveHint: "倒扑需要三步：先扑，再叫吃，最后提子。",
      hint: "这是三步题！经典的倒扑手筋。请计算每一步的变化！"
    },
    {
      id: 33,
      title: "金鸡独立两步",
      difficulty: "中级",
      location: "边路",
      type: "kill",
      description: "黑先，两步杀棋",
      size: 5,
      setup: {
        black: [[0,0], [0,1], [0,2], [0,3], [1,0], [2,0]],
        white: [[1,1], [1,2], [1,3], [2,2]]
      },
      steps: [
        {
          description: "第一步：紧气",
          correctMoves: [{x: 2, y: 1}],
          solution: "紧气！让白棋气更紧。",
          afterMoves: { white: [[1,1], [1,2], [2,2]] }
        },
        {
          description: "第二步：叫吃",
          correctMoves: [{x: 3, y: 0}],
          solution: "金鸡独立！利用边线，白棋两边不能入气。",
          afterMoves: {}
        }
      ],
      correctMoves: [{x: 2, y: 1}],
      solution: "金鸡独立两步杀！先紧气再利用边线特性。",
      wrongMoveHint: "先紧气，再利用边线。",
      hint: "这是两步题！利用金鸡独立的手筋，先紧气再叫吃。一步一步来！"
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
    if (stat.attempts === 0) {return 0;}
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
