// 经典棋谱数据 - 每一步有讲解
const KifuData = {
  getAll() {
    return this.kifus;
  },

  getById(id) {
    return this.kifus.find(k => k.id === id);
  },

  kifus: [
    {
      id: 1,
      title: "秀策流名局：秀策 vs 幻庵",
      players: {
        black: "本因坊秀策",
        white: "幻庵因硕"
      },
      date: "1853年",
      size: 19,
      result: "黑中盘胜",
      tags: ["名人", "秀策流", "经典"],
      description: "本因坊秀策的传世名局，展现了秀策流布局的精髓。黑棋以坚实的小目开局，逐步构建厚势，最终在中盘战斗中取得胜利。",
      moves: [
        { x: 3, y: 15, player: 1, comment: "秀策流标志性的星位开局，注重实地和厚势的平衡。" },
        { x: 15, y: 3, player: 2, comment: "白棋选择对角星位，形成对角布局，双方各自发展。" },
        { x: 2, y: 3, player: 1, comment: "黑棋小目守角，秀策流的典型手法，先取实地再图发展。" },
        { x: 16, y: 15, player: 2, comment: "白棋守角，与黑棋形成对称局面，双方各占两个角。" },
        { x: 6, y: 3, player: 1, comment: "黑棋拆边，向边上发展，同时威胁白棋角部。" },
        { x: 15, y: 9, player: 2, comment: "白棋挂角，试图在黑棋势力范围内制造混乱。" },
        { x: 3, y: 11, player: 1, comment: "黑棋一间跳，稳健应对，不给白棋可乘之机。" },
        { x: 9, y: 3, player: 2, comment: "白棋拆二，在边上建立根据地。" },
        { x: 9, y: 15, player: 1, comment: "黑棋占据天元附近，控制中腹大势。" },
        { x: 12, y: 9, player: 2, comment: "白棋打入，试图破坏黑棋中腹势力。" },
        { x: 12, y: 6, player: 1, comment: "黑棋镇住白棋，展开攻击，中盘战斗开始。" },
        { x: 14, y: 7, player: 2, comment: "白棋逃出，但被黑棋包围，形势不利。" },
        { x: 13, y: 9, player: 1, comment: "黑棋继续追击，白棋大龙陷入危机。" },
        { x: 15, y: 6, player: 2, comment: "白棋试图做活，但空间不足。" },
        { x: 14, y: 4, player: 1, comment: "黑棋点入，白棋眼位被破，大龙已无生路。" },
        { x: 16, y: 5, player: 2, comment: "白棋最后的挣扎，但已无力回天。" },
        { x: 15, y: 5, player: 1, comment: "黑棋接上，白棋大龙被歼，投子认负。" }
      ]
    },
    {
      id: 2,
      title: "吴清源新布局：三三·星·天元",
      players: {
        black: "吴清源",
        white: "木谷实"
      },
      date: "1933年",
      size: 19,
      result: "黑中盘胜",
      tags: ["新布局", "革命", "吴清源"],
      description: "吴清源与木谷实共同创立的新布局革命，打破了传统围棋的束缚。本局吴清源以三三、星、天元的惊人之举，开创了现代围棋的新纪元。",
      moves: [
        { x: 3, y: 3, player: 1, comment: "三三！传统认为三三位置太低，但吴清源以此取实地。" },
        { x: 15, y: 15, player: 2, comment: "白棋星位，取势为主，与黑棋三三形成对比。" },
        { x: 15, y: 3, player: 1, comment: "星位！黑棋也取势，准备构建大模样。" },
        { x: 3, y: 15, player: 2, comment: "白棋守角，限制黑棋发展。" },
        { x: 9, y: 9, player: 1, comment: "天元！！震惊棋坛的一手，黑棋意图控制全局。" },
        { x: 9, y: 3, player: 2, comment: "白棋挂角，试图破坏黑棋右边势力。" },
        { x: 12, y: 6, player: 1, comment: "黑棋一间跳，向中腹发展，与天元呼应。" },
        { x: 6, y: 9, player: 2, comment: "白棋打入左边，寻找战机。" },
        { x: 6, y: 6, player: 1, comment: "黑棋镇住，利用天元一子展开攻势。" },
        { x: 3, y: 9, player: 2, comment: "白棋逃出，但被黑棋缠绕攻击。" },
        { x: 6, y: 12, player: 1, comment: "黑棋继续追击，白棋处境艰难。" },
        { x: 9, y: 12, player: 2, comment: "白棋试图联络，但黑棋不给他机会。" },
        { x: 9, y: 15, player: 1, comment: "黑棋镇住上方，白棋大龙陷入重围。" },
        { x: 12, y: 12, player: 2, comment: "白棋做最后一搏，试图突围。" },
        { x: 12, y: 15, player: 1, comment: "黑棋封住出口，白棋大龙被歼。" }
      ]
    },
    {
      id: 3,
      title: "AlphaGo vs 李世石：神之一手",
      players: {
        black: "AlphaGo",
        white: "李世石"
      },
      date: "2016年",
      size: 19,
      result: "白胜",
      tags: ["AI", "世纪之战", "神之一手"],
      description: "人机大战第二局，李世石第78手'神之一手'击中AlphaGo盲点，成为围棋史上的经典时刻。本局展现了人类直觉与AI计算的碰撞。",
      moves: [
        { x: 3, y: 3, player: 1, comment: "AlphaGo以星位开局，现代AI最喜欢的开局之一。" },
        { x: 15, y: 15, player: 2, comment: "李世石也以星位回应，堂堂正正。" },
        { x: 15, y: 3, player: 1, comment: "AlphaGo二连星，准备构建大模样。" },
        { x: 3, y: 15, player: 2, comment: "李世石守角，取实地对抗黑棋外势。" },
        { x: 9, y: 3, player: 1, comment: "AlphaGo拆边，扩大右边势力。" },
        { x: 6, y: 15, player: 2, comment: "李世石挂角，侵入黑棋左边。" },
        { x: 3, y: 11, player: 1, comment: "AlphaGo一间跳，稳健应对。" },
        { x: 9, y: 15, player: 2, comment: "李世石拆二，在边上建立根据地。" },
        { x: 12, y: 9, player: 1, comment: "AlphaGo占据要点，控制中腹。" },
        { x: 6, y: 9, player: 2, comment: "李世石打入，试图破坏黑棋中腹。" },
        { x: 9, y: 6, player: 1, comment: "AlphaGo镇住，展开攻击。" },
        { x: 6, y: 6, player: 2, comment: "李世石跳出，寻求活路。" },
        { x: 6, y: 3, player: 1, comment: "AlphaGo追击，白棋形势危急。" },
        { x: 9, y: 12, player: 2, comment: "李世石转向中腹，寻找战机。" },
        { x: 12, y: 12, player: 1, comment: "AlphaGo围住中腹，白棋大龙危险。" },
        { x: 12, y: 15, player: 2, comment: "李世石继续逃龙。" },
        { x: 15, y: 12, player: 1, comment: "AlphaGo继续追击，白棋处境艰难。" },
        { x: 9, y: 9, player: 2, comment: "神之一手！！李世石第78手击中AlphaGo盲点，扭转乾坤！" },
        { x: 10, y: 10, player: 1, comment: "AlphaGo应对失误，胜率骤降。" },
        { x: 8, y: 8, player: 2, comment: "李世石乘胜追击，扩大战果。" },
        { x: 11, y: 11, player: 1, comment: "AlphaGo试图挽回，但为时已晚。" },
        { x: 7, y: 7, player: 2, comment: "李世石稳健收官，最终获胜。" }
      ]
    },
    {
      id: 4,
      title: "秀行名局：宇宙流对大模样",
      players: {
        black: "藤泽秀行",
        white: "坂田荣男"
      },
      date: "1970年",
      size: 19,
      result: "黑中盘胜",
      tags: ["宇宙流", "秀行", "大模样"],
      description: "藤泽秀行的宇宙流代表作，以宏大的中腹作战著称。本局展现了秀行独特的棋风——不拘泥于边角实地，而是以中腹大势压倒对手。",
      moves: [
        { x: 15, y: 3, player: 1, comment: "秀行以星位开局，准备构建大模样。" },
        { x: 3, y: 15, player: 2, comment: "坂田守角，取实地为主，与秀行形成对比。" },
        { x: 3, y: 3, player: 1, comment: "秀行再占一角，保持势力均衡。" },
        { x: 15, y: 15, player: 2, comment: "坂田也占一角，双方各占两角。" },
        { x: 9, y: 3, player: 1, comment: "秀行拆边，向中腹发展，宇宙流的雏形。" },
        { x: 6, y: 15, player: 2, comment: "坂田挂角，侵入黑棋左边。" },
        { x: 3, y: 11, player: 1, comment: "秀行一间跳，向中腹出头。" },
        { x: 9, y: 15, player: 2, comment: "坂田拆二，在边上建立根据地。" },
        { x: 12, y: 9, player: 1, comment: "秀行占据中腹要点，开始构建宇宙流大模样。" },
        { x: 6, y: 9, player: 2, comment: "坂田打入，试图破坏黑棋中腹势力。" },
        { x: 9, y: 6, player: 1, comment: "秀行镇住，利用厚势展开攻击。" },
        { x: 6, y: 6, player: 2, comment: "坂田跳出，但已被黑棋包围。" },
        { x: 6, y: 3, player: 1, comment: "秀行追击，白棋大龙陷入危机。" },
        { x: 9, y: 12, player: 2, comment: "坂田试图做活，但空间不足。" },
        { x: 12, y: 12, player: 1, comment: "秀行继续压迫，白棋眼位被破。" },
        { x: 12, y: 15, player: 2, comment: "坂田最后的挣扎。" },
        { x: 15, y: 12, player: 1, comment: "秀行接上，白棋大龙被歼，投子认负。" }
      ]
    },
    {
      id: 5,
      title: "古力 vs 李世石：世纪对决",
      players: {
        black: "古力",
        white: "李世石"
      },
      date: "2009年",
      size: 19,
      result: "黑中盘胜",
      tags: ["古力", "李世石", "力战"],
      description: "古力与李世石的巅峰对决，两位力战型棋手的碰撞。本局双方展开激烈的中盘战斗，最终古力以精准的计算力擒获白棋大龙。",
      moves: [
        { x: 3, y: 3, player: 1, comment: "古力以星位开局，现代流行布局。" },
        { x: 15, y: 15, player: 2, comment: "李世石也以星位回应。" },
        { x: 15, y: 3, player: 1, comment: "古力二连星，准备构建大模样。" },
        { x: 3, y: 15, player: 2, comment: "李世石守角，取实地。" },
        { x: 9, y: 3, player: 1, comment: "古力拆边，扩大右边势力。" },
        { x: 6, y: 15, player: 2, comment: "李世石挂角，侵入左边。" },
        { x: 3, y: 11, player: 1, comment: "古力一间跳，稳健应对。" },
        { x: 9, y: 15, player: 2, comment: "李世石拆二，建立根据地。" },
        { x: 12, y: 9, player: 1, comment: "古力占据中腹要点，控制大势。" },
        { x: 6, y: 9, player: 2, comment: "李世石打入，展开战斗。" },
        { x: 9, y: 6, player: 1, comment: "古力镇住，开始攻击白棋。" },
        { x: 6, y: 6, player: 2, comment: "李世石跳出，寻求活路。" },
        { x: 6, y: 3, player: 1, comment: "古力追击，白棋大龙危险。" },
        { x: 9, y: 12, player: 2, comment: "李世石试图做活。" },
        { x: 12, y: 12, player: 1, comment: "古力破眼，白棋陷入绝境。" },
        { x: 12, y: 15, player: 2, comment: "李世石最后的抵抗。" },
        { x: 15, y: 12, player: 1, comment: "古力接上，白棋大龙被歼。" }
      ]
    }
  ]
};
