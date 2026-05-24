/**
 * 学习路径推荐系统
 * 根据用户水平推荐个性化的围棋学习路径
 */

class LearningPathRecommender {
  constructor() {
    this.userLevel = null;
    this.weakAreas = [];
    this.strongAreas = [];
    this.learningHistory = [];
  }

  /**
   * 分析用户能力
   * @param {Array} gameHistory - 游戏历史
   * @param {Object} tsumegoStats - 死活题练习统计
   * @returns {Object} 能力分析结果
   */
  analyzeUserAbility(gameHistory, tsumegoStats) {
    const analysis = {
      overallLevel: this.calculateOverallLevel(gameHistory, tsumegoStats),
      strengths: [],
      weaknesses: [],
      recommendedLevel: 'beginner'
    };

    const abilities = this.analyzeAbilities(gameHistory);
    analysis.strengths = abilities.filter(a => a.score >= 60).map(a => a.name);
    analysis.weaknesses = abilities.filter(a => a.score < 40).map(a => a.name);

    analysis.recommendedLevel = this.determineLevel(analysis.overallLevel);

    this.userLevel = analysis.recommendedLevel;
    this.weakAreas = analysis.weaknesses;
    this.strongAreas = analysis.strengths;

    return analysis;
  }

  /**
   * 计算综合水平
   * @param {Array} games - 游戏历史
   * @param {Object} stats - 统计信息
   * @returns {number} 水平分数 (0-100)
   */
  calculateOverallLevel(games, stats) {
    if (!games || games.length === 0) return 30;

    const winRate = games.filter(g => g.result === 'win').length / games.length;
    const avgMoves = games.reduce((sum, g) => sum + (g.moves || 0), 0) / games.length;
    const tsumegoRate = stats.total > 0 ? stats.correct / stats.total : 0.5;

    const level = (winRate * 40) + (Math.min(avgMoves / 200, 1) * 30) + (tsumegoRate * 30);

    return Math.round(level);
  }

  /**
   * 分析各项能力
   * @param {Array} games - 游戏历史
   * @returns {Array} 各项能力评分
   */
  analyzeAbilities(games) {
    const recentGames = games.slice(-20);

    const abilities = [
      {
        name: '布局',
        score: this.evaluateOpening(recentGames),
        description: '开局的棋子配置和方向选择'
      },
      {
        name: '定式',
        score: this.evaluateJoseki(recentGames),
        description: '常见定式的掌握程度'
      },
      {
        name: '中盘战斗',
        score: this.evaluateMiddlegame(recentGames),
        description: '中盘的攻防和势力消长'
      },
      {
        name: '死活',
        score: this.evaluateTsumego(recentGames),
        description: '死活题的解题能力'
      },
      {
        name: '官子',
        score: this.evaluateEndgame(recentGames),
        description: '收官的精度和目数计算'
      },
      {
        name: '大局观',
        score: this.evaluateOverall(recentGames),
        description: '整体局势的把握和控制'
      }
    ];

    return abilities;
  }

  /**
   * 评估布局能力
   */
  evaluateOpening(games) {
    if (games.length === 0) return 50;

    const goodStarts = games.filter(g =>
      (g.phase === 'opening' || g.phase === 'early') && g.result === 'win'
    ).length;

    return Math.round((goodStarts / games.length) * 100);
  }

  /**
   * 评估定式掌握
   */
  evaluateJoseki(games) {
    return 50 + Math.random() * 20;
  }

  /**
   * 评估中盘战斗
   */
  evaluateMiddlegame(games) {
    if (games.length === 0) return 50;

    const middleGames = games.filter(g => g.phase === 'middle');
    if (middleGames.length === 0) return 50;

    const goodMiddle = middleGames.filter(g => g.result === 'win').length;
    return Math.round((goodMiddle / middleGames.length) * 100);
  }

  /**
   * 评估死活能力
   */
  evaluateTsumego(games) {
    const stats = Storage.getTsumegoProgress ? Storage.getTsumegoProgress() : {};
    const total = stats.totalSolved || 0;
    const correct = stats.correctCount || 0;

    if (total === 0) return 50;
    return Math.round((correct / total) * 100);
  }

  /**
   * 评估官子能力
   */
  evaluateEndgame(games) {
    if (games.length === 0) return 50;

    const goodEndgames = games.filter(g =>
      (g.phase === 'endgame') && g.result === 'win'
    ).length;

    return Math.round((goodEndgames / games.length) * 100);
  }

  /**
   * 评估大局观
   */
  evaluateOverall(games) {
    if (games.length === 0) return 50;

    const wins = games.filter(g => g.result === 'win').length;
    const avgMoves = games.reduce((sum, g) => sum + (g.moves || 0), 0) / games.length;

    const score = (wins / games.length) * 60 + (Math.min(avgMoves / 200, 1) * 40);

    return Math.round(score);
  }

  /**
   * 确定推荐等级
   * @param {number} level - 水平分数
   * @returns {string} 推荐等级
   */
  determineLevel(level) {
    if (level < 25) return 'beginner';
    if (level < 45) return 'elementary';
    if (level < 60) return 'intermediate';
    if (level < 75) return 'advanced';
    return 'expert';
  }

  /**
   * 获取学习路径
   * @returns {Array} 学习路径列表
   */
  getLearningPath() {
    const paths = {
      beginner: [
        {
          stage: 1,
          title: '基础规则与吃子',
          description: '掌握围棋基本规则和吃子技巧',
          duration: '1-2周',
          resources: ['基础规则视频', '吃子练习题'],
          exercises: ['吃子题 50道', '对弈 5局']
        },
        {
          stage: 2,
          title: '围棋礼仪与布局',
          description: '学习围棋礼仪和基础布局理念',
          duration: '2-3周',
          resources: ['布局入门教程', '星位定式基础'],
          exercises: ['布局练习', '定式练习 30道']
        },
        {
          stage: 3,
          title: '接触战基础',
          description: '学习棋子的连接和分断',
          duration: '2-3周',
          resources: ['连接与分断', '基础对杀'],
          exercises: ['对杀题 40道', '实战练习']
        }
      ],
      elementary: [
        {
          stage: 1,
          title: '定式深入',
          description: '掌握更多定式和变化',
          duration: '3-4周',
          resources: ['小目定式', '三三变化'],
          exercises: ['定式题 60道']
        },
        {
          stage: 2,
          title: '死活与手筋',
          description: '提升死活题解题能力',
          duration: '3-4周',
          resources: ['死活基础', '常用手筋'],
          exercises: ['死活题 80道', '手筋题 40道']
        },
        {
          stage: 3,
          title: '中盘战术',
          description: '学习基本的中盘战术',
          duration: '3-4周',
          resources: ['攻击与防守', '势力消长'],
          exercises: ['战术练习', '对弈 10局']
        }
      ],
      intermediate: [
        {
          stage: 1,
          title: '布局与大局观',
          description: '提升布局构思和大局观',
          duration: '4-6周',
          resources: ['布局理论', '大势判断'],
          exercises: ['布局练习', '形势判断训练']
        },
        {
          stage: 2,
          title: '攻防转换',
          description: '掌握攻防转换的时机',
          duration: '4-6周',
          resources: ['攻防要点', '战机把握'],
          exercises: ['攻防题 60道', '对弈 15局']
        },
        {
          stage: 3,
          title: '官子技术',
          description: '系统学习官子收束',
          duration: '4-6周',
          resources: ['官子基础', '常见官子类型'],
          exercises: ['官子题 80道']
        }
      ],
      advanced: [
        {
          stage: 1,
          title: '复杂定式',
          description: '学习高级定式变化',
          duration: '6-8周',
          resources: ['流行布局', '新型定式'],
          exercises: ['定式题 100道']
        },
        {
          stage: 2,
          title: '高级战术',
          description: '掌握高级战术和手筋',
          duration: '6-8周',
          resources: ['精选手筋', '战术组合'],
          exercises: ['手筋题 100道', '对弈 20局']
        },
        {
          stage: 3,
          title: '全局构思',
          description: '提升全局控制能力',
          duration: '6-8周',
          resources: ['全局战略', '名局赏析'],
          exercises: ['复盘分析', '战略练习']
        }
      ],
      expert: [
        {
          stage: 1,
          title: 'AI时代的围棋',
          description: '学习AI时代的围棋理念',
          duration: '持续学习',
          resources: ['AI布局分析', '现代围棋理论'],
          exercises: ['AI对局分析']
        },
        {
          stage: 2,
          title: '精细化计算',
          description: '提升复杂局面的计算力',
          duration: '持续学习',
          resources: ['高难度死活', '复杂对杀'],
          exercises: ['极限计算训练']
        }
      ]
    };

    return paths[this.userLevel] || paths.beginner;
  }

  /**
   * 获取针对性练习推荐
   * @returns {Array} 练习推荐列表
   */
  getRecommendedPractice() {
    const recommendations = [];

    for (const weakness of this.weakAreas) {
      recommendations.push({
        type: weakness,
        priority: 'high',
        reason: '根据您的数据分析，这是需要加强的领域',
        duration: '每天 15-30分钟',
        tips: this.getPracticeTips(weakness)
      });
    }

    for (const strength of this.strongAreas) {
      recommendations.push({
        type: strength,
        priority: 'medium',
        reason: '继续保持和提升您的优势',
        duration: '每天 10-20分钟',
        tips: this.getPracticeTips(strength)
      });
    }

    return recommendations;
  }

  /**
   * 获取练习技巧
   * @param {string} ability - 能力名称
   * @returns {Array} 练习技巧列表
   */
  getPracticeTips(ability) {
    const tips = {
      '布局': [
        '每天分析3-5个高手的对局开局',
        '练习星位、小目等多种布局类型',
        '注意棋子之间的配合和方向'
      ],
      '定式': [
        '理解定式背后的原理而非死记硬背',
        '关注定式的后续变化',
        '学习定式的取舍标准'
      ],
      '中盘战斗': [
        '练习计算力的提升',
        '注意棋子的厚薄和效率',
        '学会判断战斗的时机'
      ],
      '死活': [
        '每天做10-15道死活题',
        '从简单题开始逐步提高难度',
        '做完后要验证答案并理解思路'
      ],
      '官子': [
        '学习常见官子的价值计算',
        '练习逆收官的判断',
        '注意收官的先后手'
      ],
      '大局观': [
        '多看高手对局，学习全局构思',
        '练习形势判断',
        '注意棋盘上价值的判断'
      ]
    };

    return tips[ability] || ['坚持练习，不断进步'];
  }

  /**
   * 生成学习报告
   * @returns {Object} 学习报告
   */
  generateReport() {
    return {
      currentLevel: this.userLevel,
      strengths: this.strongAreas,
      weaknesses: this.weakAreas,
      learningPath: this.getLearningPath(),
      recommendedPractice: this.getRecommendedPractice(),
      nextMilestone: this.getNextMilestone(),
      encouragement: this.getEncouragement()
    };
  }

  /**
   * 获取下一个里程碑
   * @returns {Object} 里程碑信息
   */
  getNextMilestone() {
    const milestones = {
      beginner: { target: 'elementary', requirements: ['完成基础吃子', '掌握基本定式'] },
      elementary: { target: 'intermediate', requirements: ['提升死活能力', '理解中盘战斗'] },
      intermediate: { target: 'advanced', requirements: ['布局大局观提升', '官子技术进步'] },
      advanced: { target: 'expert', requirements: ['全面提升', '稳定胜率'] },
      expert: { target: 'master', requirements: ['持续精进', '形成个人风格'] }
    };

    return milestones[this.userLevel] || milestones.beginner;
  }

  /**
   * 获取鼓励语
   * @returns {string} 鼓励语
   */
  getEncouragement() {
    const messages = [
      '围棋之路，贵在坚持。每天进步一点点！',
      '失败是成功之母，每一局棋都是学习的机会。',
      '专注于过程，结果自然会来。',
      '保持好奇心，享受围棋的乐趣！',
      '与自己对弈，不断突破极限。'
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}

const recommender = new LearningPathRecommender();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LearningPathRecommender, recommender };
}
