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
      title: "入门：占角与守角",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "占角", "守角"],
      description: "围棋入门第一课：学习如何占角和守角。角部是围棋中最重要的区域，用最少棋子获得最大实地。",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角：星位是围棋最常见的开局点，位于三线和四线交叉处，兼顾实地和外势。" },
        { x: 6, y: 2, player: 2, comment: "白2占角：对方占了一个角，我们也占一个角，保持平衡。" },
        { x: 2, y: 6, player: 1, comment: "黑3占角：继续占角，三个角都被占了，黑棋占据两个角。" },
        { x: 6, y: 6, player: 2, comment: "白4占角：白棋也占据两个角，双方各占半壁江山。" },
        { x: 3, y: 2, player: 1, comment: "黑5守角：小目守角是巩固角部实地的好方法，让角部更稳固。" },
        { x: 5, y: 2, player: 2, comment: "白6挂角：白棋来干扰黑棋守角，这是常见的攻防手段。" },
        { x: 2, y: 3, player: 1, comment: "黑7跳：向中腹出头，同时巩固角部，一子两用。" },
        { x: 6, y: 5, player: 2, comment: "白8拆边：在边上建立根据地，向中腹发展。" },
        { x: 4, y: 4, player: 1, comment: "黑9占中腹：占据天元附近要点，控制全局大势。" }
      ]
    },
    {
      id: 2,
      title: "入门：连接与切断",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "连接", "切断"],
      description: "围棋入门第二课：学习连接自己的棋子和切断对方的棋子。连接让棋子变强，切断让对手变弱。",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角：从星位开始。" },
        { x: 6, y: 2, player: 2, comment: "白2占角：对角呼应。" },
        { x: 2, y: 6, player: 1, comment: "黑3占角：继续占角。" },
        { x: 3, y: 2, player: 2, comment: "白4挂角：来攻击黑棋角部。" },
        { x: 2, y: 3, player: 1, comment: "黑5跳：出头并连接角部棋子。" },
        { x: 4, y: 2, player: 2, comment: "白6拆二：在边上建立阵地。" },
        { x: 3, y: 3, player: 1, comment: "黑7连接：把两个黑子连起来，形成坚固的阵地！" },
        { x: 5, y: 2, player: 2, comment: "白8切断：试图切断黑棋，但黑棋已经连接好了。" },
        { x: 4, y: 3, player: 1, comment: "黑9反击：黑棋已经连成一片，白棋切断失败。" }
      ]
    },
    {
      id: 3,
      title: "入门：吃子技巧",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "吃子", "技巧"],
      description: "围棋入门第三课：学习如何吃掉对方的棋子。当对方的棋子只剩最后一口气时，就可以吃掉它！",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角。" },
        { x: 6, y: 2, player: 2, comment: "白2占角。" },
        { x: 3, y: 2, player: 1, comment: "黑3小飞守角。" },
        { x: 5, y: 2, player: 2, comment: "白4靠近黑棋。" },
        { x: 4, y: 2, player: 1, comment: "黑5挡住白棋！" },
        { x: 4, y: 3, player: 2, comment: "白6试图逃跑。" },
        { x: 4, y: 1, player: 1, comment: "黑7追击！白棋只剩两口气了。" },
        { x: 5, y: 3, player: 2, comment: "白8继续逃跑。" },
        { x: 5, y: 1, player: 1, comment: "黑9继续追击！白棋只剩一口气了！" },
        { x: 6, y: 3, player: 2, comment: "白10最后的挣扎。" },
        { x: 6, y: 1, player: 1, comment: "黑11吃掉白棋！这就是'征子'（也叫'扭羊头'），一路追吃到底！" }
      ]
    },
    {
      id: 4,
      title: "入门：眼与活棋",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "眼", "活棋"],
      description: "围棋入门第四课：学习什么是'眼'和如何让棋子活棋。有两只眼的棋就是活棋，对方永远吃不掉！",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角。" },
        { x: 6, y: 2, player: 2, comment: "白2占角。" },
        { x: 2, y: 6, player: 1, comment: "黑3占角。" },
        { x: 6, y: 6, player: 2, comment: "白4占角。" },
        { x: 3, y: 2, player: 1, comment: "黑5小飞：向边上行棋。" },
        { x: 2, y: 3, player: 2, comment: "白6靠近：来干扰黑棋。" },
        { x: 3, y: 3, player: 1, comment: "黑7做眼：这是做眼的关键一步！角部有了眼形。" },
        { x: 3, y: 4, player: 2, comment: "白8破坏：白棋来破坏黑棋的眼。" },
        { x: 2, y: 4, player: 1, comment: "黑9连接：保护好眼位，黑棋在角上已经活了！" },
        { x: 4, y: 3, player: 2, comment: "白10继续攻击。" },
        { x: 4, y: 2, player: 1, comment: "黑11再做一只眼：现在黑棋有两只眼了，白棋永远吃不掉！" }
      ]
    },
    {
      id: 5,
      title: "入门：围地与收官",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "围地", "收官"],
      description: "围棋入门第五课：学习如何围地和收官。围地就是用自己的棋子围住空点，收官是最后阶段争夺小地方。",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角。" },
        { x: 6, y: 2, player: 2, comment: "白2占角。" },
        { x: 2, y: 6, player: 1, comment: "黑3占角。" },
        { x: 6, y: 6, player: 2, comment: "白4占角。" },
        { x: 3, y: 2, player: 1, comment: "黑5守角。" },
        { x: 5, y: 2, player: 2, comment: "白6守角。" },
        { x: 2, y: 5, player: 1, comment: "黑7守角。" },
        { x: 5, y: 6, player: 2, comment: "白8守角。" },
        { x: 4, y: 2, player: 1, comment: "黑9拆边：向边上发展，扩大地盘。" },
        { x: 4, y: 6, player: 2, comment: "白10拆边：白棋也扩大地盘。" },
        { x: 4, y: 4, player: 1, comment: "黑11占中腹：控制中央，连接两边。" },
        { x: 3, y: 4, player: 2, comment: "白12收官：最后阶段争夺小地方，每目都很重要！" }
      ]
    },
    {
      id: 6,
      title: "布局：小目定式",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "小目", "定式"],
      description: "学习小目定式的基本变化，理解角部的标准应对。",
      moves: [
        { x: 2, y: 3, player: 1, comment: "黑1下小目：小目是最常见的开局点之一。" },
        { x: 2, y: 2, player: 2, comment: "白2小飞挂角：从外侧挂角攻击。" },
        { x: 3, y: 2, player: 1, comment: "黑3尖顶：压迫白棋。" },
        { x: 4, y: 2, player: 2, comment: "白4长：向外发展。" },
        { x: 3, y: 3, player: 1, comment: "黑5挡：守住角部。" },
        { x: 4, y: 3, player: 2, comment: "白6拆二：在边上安定。" },
        { x: 5, y: 4, player: 1, comment: "黑7飞：扩张势力。" }
      ]
    },
    {
      id: 7,
      title: "基础：打劫",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "打劫", "规则"],
      description: "学习围棋中有趣的打劫规则，理解劫的基本概念。",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角。" },
        { x: 6, y: 2, player: 2, comment: "白2占角。" },
        { x: 3, y: 2, player: 1, comment: "黑3小飞守角。" },
        { x: 3, y: 3, player: 2, comment: "白4点三三：侵入角部。" },
        { x: 2, y: 3, player: 1, comment: "黑5挡。" },
        { x: 2, y: 4, player: 2, comment: "白6爬。" },
        { x: 1, y: 3, player: 1, comment: "黑7扳。" },
        { x: 1, y: 4, player: 2, comment: "白8打吃！形成打劫！" },
        { x: 1, y: 2, player: 1, comment: "黑9提劫：吃掉白棋。" },
        { x: 4, y: 2, player: 2, comment: "白10找劫材：不能马上提回。" },
        { x: 5, y: 2, player: 1, comment: "黑11应劫。" },
        { x: 1, y: 4, player: 2, comment: "白12提劫：现在可以提回来了！" }
      ]
    },
    {
      id: 8,
      title: "基础：双活",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "基础教程",
      size: 9,
      result: "教学对局",
      tags: ["入门", "双活", "死活"],
      description: "学习双活的概念，双方共享气的特殊形态。",
      moves: [
        { x: 4, y: 4, player: 1, comment: "黑1天元。" },
        { x: 3, y: 4, player: 2, comment: "白2靠近。" },
        { x: 5, y: 4, player: 1, comment: "黑3另一边。" },
        { x: 4, y: 3, player: 2, comment: "白4上边。" },
        { x: 4, y: 5, player: 1, comment: "黑5下边。" },
        { x: 3, y: 3, player: 2, comment: "白6斜着走。" },
        { x: 5, y: 5, player: 1, comment: "黑7另一边。" },
        { x: 5, y: 3, player: 2, comment: "白8继续。" },
        { x: 3, y: 5, player: 1, comment: "黑9完成：形成双活！双方各有一口公气。" }
      ]
    },
    {
      id: 9,
      title: "实战：序盘要点",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "实战教程",
      size: 9,
      result: "教学对局",
      tags: ["实战", "序盘", "要点"],
      description: "学习序盘阶段的关键要点，掌握开局的基本思路。",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1星位。" },
        { x: 6, y: 6, player: 2, comment: "白2对角星。" },
        { x: 6, y: 2, player: 1, comment: "黑3占另一边。" },
        { x: 2, y: 6, player: 2, comment: "白4占最后一角。" },
        { x: 3, y: 2, player: 1, comment: "黑5小飞守角。" },
        { x: 5, y: 6, player: 2, comment: "白6小飞守角。" },
        { x: 4, y: 2, player: 1, comment: "黑7拆边。" },
        { x: 4, y: 6, player: 2, comment: "白8拆边。" },
        { x: 4, y: 4, player: 1, comment: "黑9占天元：控制中央！" }
      ]
    },
    {
      id: 10,
      title: "技巧：扑",
      players: {
        black: "黑方",
        white: "白方"
      },
      date: "技巧教程",
      size: 9,
      result: "教学对局",
      tags: ["技巧", "扑", "吃子"],
      description: "学习'扑'的技巧，这是高级吃子手段的基础。",
      moves: [
        { x: 2, y: 2, player: 1, comment: "黑1占角。" },
        { x: 3, y: 2, player: 2, comment: "白2靠近。" },
        { x: 2, y: 3, player: 1, comment: "黑3跳。" },
        { x: 3, y: 3, player: 2, comment: "白4连接。" },
        { x: 1, y: 2, player: 1, comment: "黑5立下。" },
        { x: 1, y: 3, player: 2, comment: "白6挡住。" },
        { x: 1, y: 4, player: 1, comment: "黑7扑！精妙的一手！" },
        { x: 1, y: 3, player: 2, comment: "白8必须提掉黑棋。" },
        { x: 2, y: 4, player: 1, comment: "黑9打吃！白棋被吃掉了！" }
      ]
    }
  ]
};
