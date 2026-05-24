/**
 * 围棋定式库学习模块
 * 提供定式浏览、学习、练习的完整功能
 */

// 定式数据库（扩展到50+）
const PATTERNS_DATA = [
  // ============ 星位定式 ============
  {
    id: 'star-1',
    name: '小飞挂一间高夹',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 4, y: 5, color: 'black' },
      { x: 4, y: 2, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 5, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' }
    ],
    description: '星位小飞挂后，一间高夹是最常见的应对之一。黑棋通过扳粘取得角部实地，白棋获得外势。',
    variations: [
      {
        name: '托退定式',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 4, y: 5, color: 'black' },
          { x: 4, y: 2, color: 'white' },
          { x: 3, y: 5, color: 'black' },
          { x: 5, y: 3, color: 'white' },
          { x: 2, y: 3, color: 'black' },
          { x: 3, y: 2, color: 'white' },
          { x: 3, y: 4, color: 'black' }
        ]
      }
    ],
    keyPoints: ['一间高夹的意图是获取外势', '黑棋扳粘确保角部安全', '白棋利用黑棋弱点获取利益'],
    relatedPatterns: ['star-2', 'star-3']
  },
  {
    id: 'star-2',
    name: '小飞挂小飞应',
    category: '星位',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 4, y: 2, color: 'white' },
      { x: 3, y: 2, color: 'black' },
      { x: 4, y: 3, color: 'white' }
    ],
    description: '最简单的星位定式之一，双方和平发展，各取所需。',
    variations: [],
    keyPoints: ['双方各自守角', '布局平稳', '适合追求效率的棋风'],
    relatedPatterns: ['star-1', 'star-4']
  },
  {
    id: 'star-3',
    name: '小飞挂肩冲',
    category: '星位',
    difficulty: 3,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 5, y: 2, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' },
      { x: 2, y: 2, color: 'white' }
    ],
    description: '针对无忧角或强势星位的攻击手段，通过肩冲击垮对方角部棋形。',
    variations: [
      {
        name: '三三点角',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 5, y: 2, color: 'black' },
          { x: 3, y: 2, color: 'white' },
          { x: 2, y: 2, color: 'black' },
          { x: 4, y: 3, color: 'white' },
          { x: 3, y: 4, color: 'black' }
        ]
      }
    ],
    keyPoints: ['肩冲压缩对方空间', '白棋可以考虑点角转换', '后续变化复杂'],
    relatedPatterns: ['star-1', '33-1']
  },
  {
    id: 'star-4',
    name: '小飞挂一间低夹',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 4, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' }
    ],
    description: '一间低夹比高夹更注重实地，适合稳健型棋手。',
    variations: [
      {
        name: '压长定式',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 3, y: 5, color: 'black' },
          { x: 3, y: 6, color: 'white' },
          { x: 4, y: 5, color: 'black' },
          { x: 2, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['低夹更实在', '黑棋可以压长取势', '棋形敦厚'],
    relatedPatterns: ['star-1', 'star-2']
  },
  {
    id: 'star-5',
    name: '二间高挂',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 1, y: 5, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' }
    ],
    description: '二间高挂较为从容，给予对方多种选择，适合快速布局。',
    variations: [],
    keyPoints: ['位置较远，较为从容', '对方可以选择应或脱先', '可发展为各种形态'],
    relatedPatterns: ['star-1', 'star-2']
  },
  {
    id: 'star-6',
    name: '大飞挂',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 0, y: 5, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 3, y: 1, color: 'white' },
      { x: 4, y: 2, color: 'black' }
    ],
    description: '大飞挂意在破坏对方角部，同时保持全局配合。',
    variations: [],
    keyPoints: ['破坏性强', '对方角部受损', '后续发展多样'],
    relatedPatterns: ['star-1', 'star-5']
  },
  // 小目定式
  {
    id: 'komoku-1',
    name: '小目一间高挂-托退',
    category: '小目',
    difficulty: 1,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 2, y: 4, color: 'black' }
    ],
    description: '最基础的小目定式之一，双方和平转换，各有所得。',
    variations: [
      {
        name: '一间跳应',
        moves: [
          { x: 3, y: 4, color: 'black' },
          { x: 2, y: 6, color: 'white' },
          { x: 2, y: 5, color: 'black' },
          { x: 3, y: 6, color: 'white' },
          { x: 3, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['白棋托退获取实地', '黑棋跳起保持外势', '棋形正派'],
    relatedPatterns: ['komoku-2', 'komoku-3']
  },
  {
    id: 'komoku-2',
    name: '小目一间高挂-一间低夹',
    category: '小目',
    difficulty: 2,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 1, y: 4, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 2, y: 4, color: 'white' },
      { x: 3, y: 4, color: 'black' }
    ],
    description: '一间低夹是对付小目高挂的积极手段，追求主动。',
    variations: [],
    keyPoints: ['低夹追求主动', '黑棋可压可跳', '变化丰富'],
    relatedPatterns: ['komoku-1', 'komoku-3']
  },
  {
    id: 'komoku-3',
    name: '小目一间高挂-一间高夹',
    category: '小目',
    difficulty: 3,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 1, y: 3, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 4, y: 4, color: 'white' },
      { x: 2, y: 4, color: 'black' }
    ],
    description: '高夹较为激烈，双方短兵相接，战斗从序盘开始。',
    variations: [
      {
        name: '靠出变化',
        moves: [
          { x: 3, y: 4, color: 'black' },
          { x: 2, y: 6, color: 'white' },
          { x: 2, y: 5, color: 'black' },
          { x: 1, y: 3, color: 'white' },
          { x: 2, y: 3, color: 'black' },
          { x: 3, y: 3, color: 'white' }
        ]
      }
    ],
    keyPoints: ['高夹战斗性强', '白棋靠出是常见应对', '双方均可战'],
    relatedPatterns: ['komoku-1', 'komoku-2']
  },
  {
    id: 'komoku-4',
    name: '小目小飞挂-一间高夹',
    category: '小目',
    difficulty: 2,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 4, y: 4, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 2, y: 4, color: 'white' }
    ],
    description: '小目小飞挂后的一间高夹是经典定式，双方各取所需。',
    variations: [],
    keyPoints: ['高夹追求外势', '黑棋扳粘确保角部', '白棋获得外势'],
    relatedPatterns: ['komoku-1', 'komoku-5']
  },
  {
    id: 'komoku-5',
    name: '小目小飞挂-一间低夹',
    category: '小目',
    difficulty: 1,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 4, y: 5, color: 'black' },
      { x: 5, y: 4, color: 'white' },
      { x: 2, y: 4, color: 'black' }
    ],
    description: '低夹较为稳健，适合稳健型棋手。',
    variations: [],
    keyPoints: ['低夹稳健', '黑棋可压长', '白棋可肩冲'],
    relatedPatterns: ['komoku-1', 'komoku-4']
  },
  {
    id: 'komoku-6',
    name: '小目一间低挂',
    category: '小目',
    difficulty: 2,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 4, y: 7, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 2, y: 4, color: 'white' },
      { x: 4, y: 4, color: 'black' }
    ],
    description: '一间低挂较为少见，但有其独特价值。',
    variations: [],
    keyPoints: ['低挂取地', '对方可应可脱先', '后续手段多样'],
    relatedPatterns: ['komoku-1', 'komoku-4']
  },
  // 目外定式
  {
    id: 'moku-1',
    name: '目外-小目挂',
    category: '目外',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 4, y: 4, color: 'black' },
      { x: 5, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' }
    ],
    description: '目外配合小目挂，形成有趣的布局配合。',
    variations: [],
    keyPoints: ['目外位置独特', '小目挂获取实地', '全局配合好'],
    relatedPatterns: ['komoku-1', 'moku-2']
  },
  {
    id: 'moku-2',
    name: '目外-星位挂',
    category: '目外',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' }
    ],
    description: '目外配合星位，形成快速布局。',
    variations: [],
    keyPoints: ['目外与星位配合', '双方发展迅速', '棋形轻快'],
    relatedPatterns: ['star-2', 'moku-1']
  },
  {
    id: 'moku-3',
    name: '目外-三三入侵',
    category: '目外',
    difficulty: 3,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 2, y: 2, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 3, color: 'white' }
    ],
    description: '目外位置特殊，三三入侵是常见选择。',
    variations: [],
    keyPoints: ['三三入侵直接取地', '目外位置特殊', '后续攻防复杂'],
    relatedPatterns: ['33-1', 'moku-1']
  },
  // 三三定式
  {
    id: '33-1',
    name: '三三点角-基本型',
    category: '三三',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 2, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 2, y: 4, color: 'white' },
      { x: 3, y: 4, color: 'black' },
      { x: 4, y: 3, color: 'white' }
    ],
    description: '三三点角是最直接的变化，简单明了。',
    variations: [
      {
        name: '挡下变化',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 2, color: 'white' },
          { x: 2, y: 3, color: 'black' },
          { x: 1, y: 3, color: 'white' },
          { x: 3, y: 4, color: 'black' },
          { x: 2, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['点角直接取地', '挡上挡下选择', '简单明了'],
    relatedPatterns: ['star-3', 'komoku-1']
  },
  {
    id: '33-2',
    name: '三三入侵-托断',
    category: '三三',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' },
      { x: 4, y: 3, color: 'white' },
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 3, color: 'white' },
      { x: 2, y: 2, color: 'black' }
    ],
    description: '托断是三三入侵的复杂变化，双方短兵相接。',
    variations: [],
    keyPoints: ['托断战斗激烈', '后续变化复杂', '需要详细计算'],
    relatedPatterns: ['33-1', 'komoku-3']
  },
  {
    id: '33-3',
    name: '三三肩冲',
    category: '三三',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 5, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' },
      { x: 2, y: 2, color: 'white' }
    ],
    description: '针对三三的肩冲，直接压缩对方空间。',
    variations: [],
    keyPoints: ['肩冲击溃棋形', '压缩对方空间', '白棋需要转身'],
    relatedPatterns: ['star-3', '33-1']
  },
  {
    id: '33-4',
    name: '三三一间跳',
    category: '三三',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 3, y: 1, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 4, y: 2, color: 'white' }
    ],
    description: '三三的一间跳是稳健的防守方式。',
    variations: [],
    keyPoints: ['一间跳稳健', '确保角部安全', '棋形正派'],
    relatedPatterns: ['33-1', '33-2']
  },
  // 更多复杂定式
  {
    id: 'advanced-1',
    name: '妖刀定式',
    category: '星位',
    difficulty: 4,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 4, y: 5, color: 'black' },
      { x: 3, y: 5, color: 'white' },
      { x: 5, y: 3, color: 'black' },
      { x: 2, y: 3, color: 'white' },
      { x: 3, y: 6, color: 'black' },
      { x: 3, y: 4, color: 'white' },
      { x: 2, y: 4, color: 'black' }
    ],
    description: '妖刀定式是星位定式中变化最复杂的之一，因其精妙而被命名为"妖刀"。',
    variations: [
      {
        name: '大雪崩',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 4, y: 5, color: 'black' },
          { x: 3, y: 5, color: 'white' },
          { x: 4, y: 4, color: 'black' },
          { x: 4, y: 6, color: 'white' },
          { x: 5, y: 4, color: 'black' },
          { x: 3, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['变化极其复杂', '双方均有好坏', '需要详细研究', '名称来源于其精妙'],
    relatedPatterns: ['star-1', 'star-4', 'advanced-2']
  },
  {
    id: 'advanced-2',
    name: '大雪崩定式',
    category: '星位',
    difficulty: 5,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 4, y: 5, color: 'black' },
      { x: 3, y: 5, color: 'white' },
      { x: 4, y: 4, color: 'black' },
      { x: 4, y: 6, color: 'white' },
      { x: 5, y: 4, color: 'black' },
      { x: 3, y: 4, color: 'white' },
      { x: 5, y: 6, color: 'black' },
      { x: 5, y: 5, color: 'white' }
    ],
    description: '大雪崩是围棋中最复杂的定式之一，变化万千，是高手必争之地。',
    variations: [
      {
        name: '内拐',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 4, y: 5, color: 'black' },
          { x: 3, y: 5, color: 'white' },
          { x: 4, y: 4, color: 'black' },
          { x: 4, y: 6, color: 'white' },
          { x: 3, y: 6, color: 'black' },
          { x: 2, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['变化极其复杂', '内拐外拐选择', '大雪崩之名', '高手研究焦点'],
    relatedPatterns: ['advanced-1', 'star-1', 'star-4']
  },
  {
    id: 'advanced-3',
    name: '小目一间高挂-托退定式',
    category: '小目',
    difficulty: 1,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 2, y: 4, color: 'white' },
      { x: 4, y: 4, color: 'black' }
    ],
    description: '小目托退是围棋中最基础也是最重要的定式之一。',
    variations: [
      {
        name: '小飞应',
        moves: [
          { x: 3, y: 4, color: 'black' },
          { x: 2, y: 6, color: 'white' },
          { x: 2, y: 5, color: 'black' },
          { x: 3, y: 6, color: 'white' },
          { x: 3, y: 5, color: 'black' },
          { x: 2, y: 4, color: 'white' },
          { x: 3, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['最基础定式', '双方各有所得', '变化多端'],
    relatedPatterns: ['komoku-1', 'komoku-2', 'komoku-3']
  },
  {
    id: 'advanced-4',
    name: '星位-小飞挂-托右上',
    category: '星位',
    difficulty: 3,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 4, y: 4, color: 'black' },
      { x: 5, y: 3, color: 'white' },
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 4, color: 'white' }
    ],
    description: '星位小飞挂后的托右上变化，形成有趣的棋形。',
    variations: [],
    keyPoints: ['托右上取地', '形成新型棋形', '外势与实地平衡'],
    relatedPatterns: ['star-1', 'star-2', 'komoku-1']
  },
  {
    id: 'advanced-5',
    name: '小目-小目挂',
    category: '小目',
    difficulty: 2,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 4, y: 4, color: 'white' },
      { x: 4, y: 5, color: 'black' }
    ],
    description: '两个小目相邻，形成经典的小目配合。',
    variations: [],
    keyPoints: ['小目配合', '角部交换', '双方发展'],
    relatedPatterns: ['komoku-1', 'komoku-4', 'komoku-5']
  },

  // ============ 高目定式 ============
  {
    id: 'takamusu-1',
    name: '高目小飞挂',
    category: '高目',
    difficulty: 2,
    moves: [
      { x: 3, y: 2, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' }
    ],
    description: '高目位置特殊，配合小飞挂形成独特棋形。',
    variations: [],
    keyPoints: ['高目取势', '小飞挂常见', '配合独特'],
    relatedPatterns: ['star-2', 'komoku-1']
  },
  {
    id: 'takamusu-2',
    name: '高目一间高挂',
    category: '高目',
    difficulty: 3,
    moves: [
      { x: 3, y: 2, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 4, y: 4, color: 'white' },
      { x: 2, y: 4, color: 'black' }
    ],
    description: '高目一间高挂是积极的下法，追求主动。',
    variations: [],
    keyPoints: ['一间高挂积极', '黑棋可压长', '战斗性强'],
    relatedPatterns: ['takamusu-1', 'komoku-3']
  },

  // ============ 定式变化图 ============
  {
    id: 'variation-1',
    name: '星位-托退定式',
    category: '星位',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 4, y: 4, color: 'white' },
      { x: 2, y: 4, color: 'black' },
      { x: 3, y: 5, color: 'white' },
      { x: 3, y: 4, color: 'black' }
    ],
    description: '托退是星位定式中常见的变化，简单实用。',
    variations: [
      {
        name: '连扳',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 4, y: 4, color: 'white' },
          { x: 2, y: 4, color: 'black' },
          { x: 3, y: 5, color: 'white' },
          { x: 3, y: 4, color: 'black' },
          { x: 4, y: 5, color: 'white' }
        ]
      }
    ],
    keyPoints: ['托退取地', '简单实用', '变化多样'],
    relatedPatterns: ['star-2', 'komoku-1']
  },
  {
    id: 'variation-2',
    name: '星位-靠压定式',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 4, y: 5, color: 'black' }
    ],
    description: '靠压是星位定式中取势的常见手法。',
    variations: [],
    keyPoints: ['靠压取势', '黑棋外势', '白棋实地'],
    relatedPatterns: ['star-1', 'star-4']
  },
  {
    id: 'variation-3',
    name: '星位-肩冲三三',
    category: '星位',
    difficulty: 3,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 5, y: 2, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' },
      { x: 2, y: 2, color: 'white' }
    ],
    description: '肩冲三三是积极压缩对方的方法。',
    variations: [
      {
        name: '点角转换',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 5, y: 2, color: 'black' },
          { x: 3, y: 2, color: 'white' },
          { x: 2, y: 2, color: 'black' },
          { x: 4, y: 3, color: 'white' },
          { x: 3, y: 4, color: 'black' }
        ]
      }
    ],
    keyPoints: ['肩冲击空', '压缩空间', '白棋需转身'],
    relatedPatterns: ['star-3', '33-1']
  },

  // ============ 小目复杂定式 ============
  {
    id: 'komoku-advanced-1',
    name: '小目-一间高挂-靠出',
    category: '小目',
    difficulty: 3,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 1, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 3, y: 3, color: 'white' }
    ],
    description: '靠出变化激烈，双方短兵相接。',
    variations: [],
    keyPoints: ['靠出战斗', '短兵相接', '变化复杂'],
    relatedPatterns: ['komoku-3', 'advanced-1']
  },
  {
    id: 'komoku-advanced-2',
    name: '小目-一间高挂-压长',
    category: '小目',
    difficulty: 2,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 3, y: 7, color: 'white' },
      { x: 4, y: 5, color: 'black' },
      { x: 2, y: 4, color: 'white' }
    ],
    description: '压长取势是小目的经典变化。',
    variations: [],
    keyPoints: ['压长取势', '外势明显', '棋形正派'],
    relatedPatterns: ['komoku-1', 'komoku-2']
  },
  {
    id: 'komoku-advanced-3',
    name: '小目-一间高挂-飞压',
    category: '小目',
    difficulty: 3,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 1, y: 3, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 4, y: 4, color: 'white' },
      { x: 2, y: 4, color: 'black' }
    ],
    description: '飞压是积极追求外势的下法。',
    variations: [],
    keyPoints: ['飞压取势', '追求外势', '战斗性强'],
    relatedPatterns: ['komoku-3', 'komoku-advanced-1']
  },

  // ============ 更多星位定式 ============
  {
    id: 'star-7',
    name: '星位-一间低夹-靠出',
    category: '星位',
    difficulty: 3,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 4, y: 3, color: 'white' },
      { x: 4, y: 4, color: 'black' },
      { x: 3, y: 3, color: 'white' }
    ],
    description: '一间低夹后靠出是复杂变化。',
    variations: [],
    keyPoints: ['靠出复杂', '双方战斗', '变化丰富'],
    relatedPatterns: ['star-4', 'advanced-1']
  },
  {
    id: 'star-8',
    name: '星位-一间低夹-跳出',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 4, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' }
    ],
    description: '跳出是稳健的选择。',
    variations: [],
    keyPoints: ['跳出稳健', '保持连接', '棋形正派'],
    relatedPatterns: ['star-4', 'star-2']
  },
  {
    id: 'star-9',
    name: '星位-压长定式',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 4, y: 5, color: 'black' }
    ],
    description: '压长是取势的经典手法。',
    variations: [],
    keyPoints: ['压长取势', '外势明显', '常见下法'],
    relatedPatterns: ['star-1', 'star-4']
  },
  {
    id: 'star-10',
    name: '星位-拆上',
    category: '星位',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 5, y: 5, color: 'black' }
    ],
    description: '拆上是快速的布局手法。',
    variations: [],
    keyPoints: ['拆上快速', '追求效率', '可脱先'],
    relatedPatterns: ['star-2', 'star-5']
  },

  // ============ 更多三三定式 ============
  {
    id: '33-5',
    name: '三三-托退',
    category: '三三',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' },
      { x: 4, y: 3, color: 'white' },
      { x: 3, y: 4, color: 'black' }
    ],
    description: '三三托退是简单的取地变化。',
    variations: [],
    keyPoints: ['托退取地', '简单明了', '实地优先'],
    relatedPatterns: ['33-1', 'komoku-1']
  },
  {
    id: '33-6',
    name: '三三-飞压',
    category: '三三',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 5, y: 2, color: 'white' },
      { x: 5, y: 1, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 2, color: 'black' }
    ],
    description: '飞压是积极压缩三三的方法。',
    variations: [],
    keyPoints: ['飞压缩地', '积极下法', '白棋需应对'],
    relatedPatterns: ['33-3', 'star-3']
  },

  // ============ 布局定式 ============
  {
    id: 'layout-1',
    name: '二连星布局',
    category: '布局',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 9, y: 3, color: 'black' }
    ],
    description: '二连星是常见的布局方式，追求外势。',
    variations: [],
    keyPoints: ['二连星取势', '布局快速', '常见下法'],
    relatedPatterns: ['star-1', 'layout-2']
  },
  {
    id: 'layout-2',
    name: '三连星布局',
    category: '布局',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 9, y: 3, color: 'black' },
      { x: 15, y: 3, color: 'black' }
    ],
    description: '三连星是激进的布局，追求外势和势力。',
    variations: [],
    keyPoints: ['三连星激进', '追求外势', '布局效率'],
    relatedPatterns: ['layout-1', 'star-1']
  },
  {
    id: 'layout-3',
    name: '中国流布局',
    category: '布局',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 9, y: 6, color: 'black' },
      { x: 3, y: 6, color: 'black' }
    ],
    description: '中国流是注重全局配合的布局。',
    variations: [],
    keyPoints: ['中国流配合', '全局观念', '厚势优先'],
    relatedPatterns: ['layout-1', 'layout-2']
  },

  // ============ 更多复杂定式 ============
  {
    id: 'complex-1',
    name: '星位-大斜定式',
    category: '星位',
    difficulty: 4,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 1, y: 4, color: 'white' },
      { x: 4, y: 1, color: 'black' },
      { x: 2, y: 2, color: 'white' },
      { x: 1, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' }
    ],
    description: '大斜是围棋中最复杂的变化之一，有"大斜百变"之称。',
    variations: [
      {
        name: '大雪崩',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 1, y: 4, color: 'white' },
          { x: 4, y: 1, color: 'black' },
          { x: 2, y: 2, color: 'white' },
          { x: 1, y: 2, color: 'black' },
          { x: 3, y: 1, color: 'white' }
        ]
      }
    ],
    keyPoints: ['大斜百变', '极其复杂', '高手研究'],
    relatedPatterns: ['advanced-1', 'advanced-2']
  },
  {
    id: 'complex-2',
    name: '小目-目外定式',
    category: '小目',
    difficulty: 3,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 1, y: 5, color: 'white' },
      { x: 4, y: 3, color: 'black' },
      { x: 5, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' }
    ],
    description: '小目配合目外是独特的布局配合。',
    variations: [],
    keyPoints: ['目外特殊', '配合独特', '全局配合'],
    relatedPatterns: ['moku-1', 'komoku-1']
  },
  {
    id: 'complex-3',
    name: '星位-小目配合',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 3, y: 6, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 2, y: 3, color: 'black' }
    ],
    description: '星位和小目的配合是常见的布局。',
    variations: [],
    keyPoints: ['星小配合', '常见布局', '效率高'],
    relatedPatterns: ['star-2', 'komoku-1']
  },

  // ============ 定式精解 ============
  {
    id: 'classic-1',
    name: '小目托退定式-基本型',
    category: '小目',
    difficulty: 1,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' },
      { x: 3, y: 6, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 2, y: 4, color: 'white' }
    ],
    description: '小目托退是围棋中最基础最重要的定式之一。',
    variations: [
      {
        name: '拆一',
        moves: [
          { x: 3, y: 4, color: 'black' },
          { x: 2, y: 6, color: 'white' },
          { x: 2, y: 5, color: 'black' },
          { x: 3, y: 6, color: 'white' },
          { x: 3, y: 5, color: 'black' },
          { x: 2, y: 4, color: 'white' },
          { x: 2, y: 3, color: 'black' }
        ]
      }
    ],
    keyPoints: ['最基础定式', '双方各得', '变化丰富'],
    relatedPatterns: ['komoku-1', 'komoku-advanced-2']
  },
  {
    id: 'classic-2',
    name: '星位小飞挂-一间低夹',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' },
      { x: 4, y: 3, color: 'white' },
      { x: 2, y: 3, color: 'black' }
    ],
    description: '一间低夹是星位小飞挂的经典应对。',
    variations: [
      {
        name: '压长',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 5, color: 'white' },
          { x: 3, y: 5, color: 'black' },
          { x: 4, y: 3, color: 'white' },
          { x: 2, y: 3, color: 'black' },
          { x: 3, y: 2, color: 'white' }
        ]
      }
    ],
    keyPoints: ['低夹经典', '可压可跳', '变化多端'],
    relatedPatterns: ['star-1', 'star-4']
  },
  {
    id: 'classic-3',
    name: '三三点角-基本型',
    category: '三三',
    difficulty: 1,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 2, color: 'white' },
      { x: 2, y: 3, color: 'black' },
      { x: 2, y: 4, color: 'white' },
      { x: 3, y: 4, color: 'black' },
      { x: 4, y: 3, color: 'white' }
    ],
    description: '三三点角是最直接的变化，简单明了。',
    variations: [
      {
        name: '挡下',
        moves: [
          { x: 3, y: 3, color: 'black' },
          { x: 2, y: 2, color: 'white' },
          { x: 2, y: 3, color: 'black' },
          { x: 1, y: 3, color: 'white' },
          { x: 3, y: 4, color: 'black' },
          { x: 2, y: 4, color: 'white' }
        ]
      }
    ],
    keyPoints: ['点角直接', '简单明了', '取地实惠'],
    relatedPatterns: ['33-1', 'star-3']
  },

  // ============ 最新流行定式 ============
  {
    id: 'modern-1',
    name: 'AI布局-迷你中国流',
    category: '布局',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 9, y: 6, color: 'black' },
      { x: 4, y: 6, color: 'black' }
    ],
    description: '迷你中国流是现代AI布局的代表。',
    variations: [],
    keyPoints: ['AI布局', '效率高', '全局配合'],
    relatedPatterns: ['layout-3', 'star-2']
  },
  {
    id: 'modern-2',
    name: '星位-肩冲小目',
    category: '星位',
    difficulty: 3,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 3, y: 6, color: 'black' },
      { x: 5, y: 4, color: 'white' },
      { x: 4, y: 4, color: 'black' },
      { x: 2, y: 4, color: 'white' }
    ],
    description: '现代流行的肩冲小目变化。',
    variations: [],
    keyPoints: ['现代流行', '压缩空间', '效率高'],
    relatedPatterns: ['star-3', 'komoku-1']
  },
  {
    id: 'modern-3',
    name: '三三-托上定式',
    category: '三三',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 3, y: 2, color: 'white' },
      { x: 4, y: 1, color: 'black' },
      { x: 3, y: 1, color: 'white' },
      { x: 2, y: 2, color: 'black' }
    ],
    description: '托上是现代流行的三三变化。',
    variations: [],
    keyPoints: ['托上现代', '取地实惠', '效率高'],
    relatedPatterns: ['33-5', '33-1']
  },

  // ============ 攻防定式 ============
  {
    id: 'attack-1',
    name: '星位被挂-攻击方法',
    category: '星位',
    difficulty: 2,
    moves: [
      { x: 3, y: 3, color: 'black' },
      { x: 2, y: 5, color: 'white' },
      { x: 3, y: 5, color: 'black' }
    ],
    description: '星位被小飞挂后的攻击方法。',
    variations: [],
    keyPoints: ['攻击星位', '一间低夹', '积极应对'],
    relatedPatterns: ['star-1', 'star-4']
  },
  {
    id: 'attack-2',
    name: '小目被挂-防守方法',
    category: '小目',
    difficulty: 2,
    moves: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 6, color: 'white' },
      { x: 2, y: 5, color: 'black' }
    ],
    description: '小目被一间高挂后的防守方法。',
    variations: [],
    keyPoints: ['小目防守', '托退稳健', '常见应对'],
    relatedPatterns: ['komoku-1', 'komoku-2']
  }
];

/**
 * 定式库管理器
 */
class PatternLibrary {
  constructor() {
    this.patterns = [];
    this.favorites = this.loadFavorites();
    this.progress = this.loadProgress();
  }

  loadPatterns() {
    this.patterns = [...PATTERNS_DATA];
    return this.patterns;
  }

  getAll() {
    return this.patterns;
  }

  getById(id) {
    return this.patterns.find(p => p.id === id);
  }

  getByCategory(category) {
    return this.patterns.filter(p => p.category === category);
  }

  getByDifficulty(difficulty) {
    return this.patterns.filter(p => p.difficulty === difficulty);
  }

  search(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return this.patterns.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.description.toLowerCase().includes(lowerKeyword) ||
      p.keyPoints.some(kp => kp.toLowerCase().includes(lowerKeyword))
    );
  }

  getRelated(patternId) {
    const pattern = this.getById(patternId);
    if (!pattern) {return [];}
    return pattern.relatedPatterns.map(id => this.getById(id)).filter(Boolean);
  }

  toggleFavorite(patternId) {
    const index = this.favorites.indexOf(patternId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(patternId);
    }
    this.saveFavorites();
    return this.isFavorite(patternId);
  }

  isFavorite(patternId) {
    return this.favorites.includes(patternId);
  }

  getFavorites() {
    return this.favorites.map(id => this.getById(id)).filter(Boolean);
  }

  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem('go-pattern-favorites') || '[]');
    } catch {
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem('go-pattern-favorites', JSON.stringify(this.favorites));
  }

  markAsStudied(patternId) {
    if (!this.progress.studied.includes(patternId)) {
      this.progress.studied.push(patternId);
      this.saveProgress();
    }
  }

  markAsPracticed(patternId) {
    if (!this.progress.practiced.includes(patternId)) {
      this.progress.practiced.push(patternId);
      this.saveProgress();
    }
  }

  getProgress() {
    return {
      total: this.patterns.length,
      studied: this.progress.studied.length,
      practiced: this.progress.practiced.length,
      accuracy: this.calculateAccuracy()
    };
  }

  calculateAccuracy() {
    try {
      const records = JSON.parse(localStorage.getItem('go-pattern-records') || '[]');
      if (records.length === 0) {return 0;}
      const correct = records.filter(r => r.correct).length;
      return Math.round((correct / records.length) * 100);
    } catch {
      return 0;
    }
  }

  savePracticeRecord(patternId, correct, time) {
    try {
      const records = JSON.parse(localStorage.getItem('go-pattern-records') || '[]');
      records.push({ patternId, correct, time, date: new Date().toISOString() });
      if (records.length > 100) {records.shift();}
      localStorage.setItem('go-pattern-records', JSON.stringify(records));
    } catch (e) {
      console.error('保存练习记录失败:', e);
    }
  }

  loadProgress() {
    try {
      return JSON.parse(localStorage.getItem('go-pattern-progress') || '{"studied":[],"practiced":[]}');
    } catch {
      return { studied: [], practiced: [] };
    }
  }

  saveProgress() {
    localStorage.setItem('go-pattern-progress', JSON.stringify(this.progress));
  }
}

/**
 * 定式展示器
 */
class PatternViewer {
  constructor(containerId, pattern, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`容器 #${containerId} 不存在`);
    }
    
    this.pattern = pattern;
    this.currentMove = 0;
    this.currentVariation = 0;
    this.showMoveNumbers = options.showMoveNumbers !== false;
    this.autoPlay = false;
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.container.className = 'pattern-viewer';
    
    const boardContainer = document.createElement('div');
    boardContainer.className = 'viewer-board-container';
    
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'viewer-canvas';
    this.setupCanvas();
    boardContainer.appendChild(this.canvas);
    
    this.container.appendChild(boardContainer);
    
    this.renderControls();
    this.renderInfo();
    this.renderVariations();
    this.drawPattern();
  }

  setupCanvas() {
    const boardSize = 19;
    const cellSize = Math.min(25, Math.floor(400 / boardSize));
    const padding = 20;
    const canvasSize = cellSize * (boardSize - 1) + padding * 2;
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = `${canvasSize}px`;
    this.canvas.style.height = `${canvasSize}px`;
    
    this.boardSize = boardSize;
    this.cellSize = cellSize;
    this.padding = padding;
    this.ctx = this.canvas.getContext('2d');
  }

  renderControls() {
    const controls = document.createElement('div');
    controls.className = 'viewer-controls';
    
    const btnStyle = 'padding: 8px 16px; margin: 0 4px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;';
    
    controls.innerHTML = `
      <button class="control-btn" data-action="first" style="${btnStyle} background: var(--primary); color: white;">⏮ 到开始</button>
      <button class="control-btn" data-action="prev" style="${btnStyle} background: var(--primary); color: white;">◀ 上一步</button>
      <button class="control-btn" data-action="next" style="${btnStyle} background: var(--primary); color: white;">下一步 ▶</button>
      <button class="control-btn" data-action="last" style="${btnStyle} background: var(--primary); color: white;">到结束 ⏭</button>
      <button class="control-btn" data-action="play" style="${btnStyle} background: var(--success); color: white;">▶ 播放</button>
    `;
    
    this.container.appendChild(controls);
    
    const info = document.createElement('div');
    info.className = 'move-info';
    info.textContent = `第 ${this.currentMove} / ${this.getCurrentMoves().length} 手`;
    this.container.appendChild(info);
    
    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('.control-btn');
      if (!btn) {return;}
      
      const action = btn.dataset.action;
      switch (action) {
        case 'first': this.goToStart(); break;
        case 'prev': this.prevMove(); break;
        case 'next': this.nextMove(); break;
        case 'last': this.goToEnd(); break;
        case 'play': this.toggleAutoPlay(); break;
      }
    });
  }

  renderInfo() {
    const infoPanel = document.createElement('div');
    infoPanel.className = 'viewer-info';
    
    const difficultyStars = '★'.repeat(this.pattern.difficulty) + '☆'.repeat(5 - this.pattern.difficulty);
    
    infoPanel.innerHTML = `
      <h3>${this.pattern.name}</h3>
      <div class="info-meta">
        <span class="category-tag">${this.pattern.category}</span>
        <span class="difficulty">${difficultyStars}</span>
      </div>
      <p class="description">${this.pattern.description}</p>
      <div class="key-points">
        <h4>要点：</h4>
        <ul>${this.pattern.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
      </div>
    `;
    
    this.container.appendChild(infoPanel);
  }

  renderVariations() {
    if (!this.pattern.variations || this.pattern.variations.length === 0) {return;}
    
    const variationsPanel = document.createElement('div');
    variationsPanel.className = 'variations-panel';
    
    let html = '<h4>变化图</h4><div class="variations-list">';
    html += `<button class="variation-btn ${this.currentVariation === 0 ? 'active' : ''}" data-variation="0">基本型</button>`;
    
    this.pattern.variations.forEach((v, i) => {
      html += `<button class="variation-btn ${this.currentVariation === i + 1 ? 'active' : ''}" data-variation="${i + 1}">${v.name}</button>`;
    });
    
    html += '</div>';
    variationsPanel.innerHTML = html;
    this.container.appendChild(variationsPanel);
    
    variationsPanel.addEventListener('click', (e) => {
      const btn = e.target.closest('.variation-btn');
      if (!btn) {return;}
      
      this.currentVariation = parseInt(btn.dataset.variation);
      this.currentMove = 0;
      this.drawPattern();
      
      document.querySelectorAll('.variation-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  }

  getCurrentMoves() {
    if (this.currentVariation === 0) {
      return this.pattern.moves;
    }
    return this.pattern.variations[this.currentVariation - 1].moves;
  }

  drawPattern() {
    const ctx = this.ctx;
    const { cellSize, padding, boardSize } = this;
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < boardSize; i++) {
      const pos = padding + i * cellSize;
      
      ctx.beginPath();
      ctx.moveTo(padding, pos);
      ctx.lineTo(padding + (boardSize - 1) * cellSize, pos);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(pos, padding);
      ctx.lineTo(pos, padding + (boardSize - 1) * cellSize);
      ctx.stroke();
    }
    
    const starPoints = [[3, 3], [9, 3], [15, 3], [3, 9], [9, 9], [15, 9], [3, 15], [9, 15], [15, 15]];
    ctx.fillStyle = '#000';
    starPoints.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(padding + x * cellSize, padding + y * cellSize, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    const moves = this.getCurrentMoves();
    for (let i = 0; i < Math.min(this.currentMove, moves.length); i++) {
      const move = moves[i];
      this.drawStone(move.x, move.y, move.color, i + 1, i === moves.length - 1);
    }
    
    const info = this.container.querySelector('.move-info');
    if (info) {
      info.textContent = `第 ${this.currentMove} / ${moves.length} 手`;
    }
  }

  drawStone(x, y, color, moveNumber = null, isLast = false) {
    const ctx = this.ctx;
    const { cellSize, padding } = this;
    const px = padding + x * cellSize;
    const py = padding + y * cellSize;
    const radius = cellSize * 0.4;
    
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    
    if (color === 'black') {
      const gradient = ctx.createRadialGradient(px - radius * 0.3, py - radius * 0.3, 0, px, py, radius);
      gradient.addColorStop(0, '#666');
      gradient.addColorStop(1, '#000');
      ctx.fillStyle = gradient;
    } else {
      const gradient = ctx.createRadialGradient(px - radius * 0.3, py - radius * 0.3, 0, px, py, radius);
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(0.7, '#ddd');
      gradient.addColorStop(1, '#aaa');
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
    }
    
    ctx.fill();
    if (color === 'white') {ctx.stroke();}
    
    if (isLast) {
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#c41e3a';
      ctx.fill();
    }
    
    if (this.showMoveNumbers && moveNumber) {
      ctx.fillStyle = color === 'black' ? '#fff' : '#000';
      ctx.font = `bold ${cellSize * 0.35}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(moveNumber.toString(), px, py);
    }
  }

  goToStart() {
    this.currentMove = 0;
    this.drawPattern();
  }

  goToEnd() {
    this.currentMove = this.getCurrentMoves().length;
    this.drawPattern();
  }

  nextMove() {
    const moves = this.getCurrentMoves();
    if (this.currentMove < moves.length) {
      this.currentMove++;
      this.drawPattern();
    }
  }

  prevMove() {
    if (this.currentMove > 0) {
      this.currentMove--;
      this.drawPattern();
    }
  }

  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    
    const playBtn = this.container.querySelector('[data-action="play"]');
    if (playBtn) {
      playBtn.textContent = this.autoPlay ? '⏸ 暂停' : '▶ 播放';
    }
    
    if (this.autoPlay) {
      this.autoPlayInterval = setInterval(() => {
        const moves = this.getCurrentMoves();
        if (this.currentMove < moves.length) {
          this.nextMove();
        } else {
          this.toggleAutoPlay();
        }
      }, 1000);
    } else {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  destroy() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.container.innerHTML = '';
  }
}

/**
 * 定式练习
 */
class PatternQuiz {
  constructor(containerId, library) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`容器 #${containerId} 不存在`);
    }
    
    this.library = library;
    this.currentQuiz = null;
    this.correctCount = 0;
    this.totalCount = 0;
    this.startTime = null;
    this.timerInterval = null;
    this.quizCount = 5;
  }

  render() {
    this.container.innerHTML = '';
    this.container.className = 'pattern-quiz';
    
    const header = document.createElement('div');
    header.className = 'quiz-header';
    header.innerHTML = `
      <h3>定式练习</h3>
      <div class="quiz-stats">
        <span>正确: <strong class="correct-count">${this.correctCount}</strong></span>
        <span>总计: <strong class="total-count">${this.totalCount}</strong></span>
        <span>正确率: <strong class="accuracy">${this.getAccuracy()}%</strong></span>
      </div>
    `;
    this.container.appendChild(header);
    
    const boardArea = document.createElement('div');
    boardArea.className = 'quiz-board-area';
    boardArea.innerHTML = `
      <canvas id="quiz-canvas" class="quiz-canvas"></canvas>
      <div class="quiz-controls">
        <button class="quiz-btn new-quiz-btn">开始新练习</button>
      </div>
    `;
    this.container.appendChild(boardArea);
    
    const optionsArea = document.createElement('div');
    optionsArea.className = 'quiz-options';
    optionsArea.id = 'quiz-options';
    this.container.appendChild(optionsArea);
    
    const timerArea = document.createElement('div');
    timerArea.className = 'quiz-timer';
    timerArea.id = 'quiz-timer';
    this.container.appendChild(timerArea);
    
    const feedbackArea = document.createElement('div');
    feedbackArea.className = 'quiz-feedback';
    feedbackArea.id = 'quiz-feedback';
    this.container.appendChild(feedbackArea);
    
    this.container.querySelector('.new-quiz-btn').addEventListener('click', () => this.startNewQuiz());
    
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.getElementById('quiz-canvas');
    if (!this.canvas) {return;}
    
    const boardSize = 19;
    const cellSize = 18;
    const padding = 15;
    const canvasSize = cellSize * (boardSize - 1) + padding * 2;
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = '320px';
    this.canvas.style.height = '320px';
    
    this.boardSize = boardSize;
    this.cellSize = cellSize;
    this.padding = padding;
    this.ctx = this.canvas.getContext('2d');
  }

  startNewQuiz() {
    const patterns = this.library.getAll();
    this.quizPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    const movesToShow = Math.min(3, Math.floor(this.quizPattern.moves.length / 2));
    this.shownMoves = this.quizPattern.moves.slice(0, movesToShow);
    
    const correctMove = this.quizPattern.moves[movesToShow];
    this.correctAnswer = correctMove;
    
    this.wrongAnswers = this.generateWrongAnswers(correctMove, 3);
    this.allOptions = this.shuffleArray([correctMove, ...this.wrongAnswers]);
    
    this.currentQuiz = {
      pattern: this.quizPattern,
      movesShown: movesToShow,
      startTime: Date.now()
    };
    
    this.drawQuizBoard();
    this.renderOptions();
    this.startTimer();
    
    document.getElementById('quiz-feedback').innerHTML = '';
  }

  generateWrongAnswers(correctMove, count) {
    const wrongMoves = [];
    const patterns = this.library.getAll();
    
    while (wrongMoves.length < count) {
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      const randomMove = randomPattern.moves[Math.floor(Math.random() * randomPattern.moves.length)];
      
      if (randomMove.x !== correctMove.x || randomMove.y !== correctMove.y) {
        if (!wrongMoves.some(w => w.x === randomMove.x && w.y === randomMove.y)) {
          wrongMoves.push(randomMove);
        }
      }
    }
    
    return wrongMoves;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  drawQuizBoard() {
    if (!this.ctx) {return;}
    
    const ctx = this.ctx;
    const { cellSize, padding, boardSize } = this;
    
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < boardSize; i++) {
      const pos = padding + i * cellSize;
      
      ctx.beginPath();
      ctx.moveTo(padding, pos);
      ctx.lineTo(padding + (boardSize - 1) * cellSize, pos);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(pos, padding);
      ctx.lineTo(pos, padding + (boardSize - 1) * cellSize);
      ctx.stroke();
    }
    
    const starPoints = [[3, 3], [9, 3], [15, 3], [3, 9], [9, 9], [15, 9], [3, 15], [9, 15], [15, 15]];
    ctx.fillStyle = '#000';
    starPoints.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(padding + x * cellSize, padding + y * cellSize, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    this.shownMoves.forEach((move, i) => {
      this.drawQuizStone(move.x, move.y, move.color, i + 1, i === this.shownMoves.length - 1);
    });
    
    ctx.fillStyle = 'rgba(0, 123, 255, 0.3)';
    ctx.fillRect(0, 0, this.canvas.width, 30);
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText('下一步应该下在哪里？', 10, 20);
  }

  drawQuizStone(x, y, color, moveNumber = null, isLast = false) {
    const ctx = this.ctx;
    const { cellSize, padding } = this;
    const px = padding + x * cellSize;
    const py = padding + y * cellSize;
    const radius = cellSize * 0.4;
    
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    
    if (color === 'black') {
      const gradient = ctx.createRadialGradient(px - radius * 0.3, py - radius * 0.3, 0, px, py, radius);
      gradient.addColorStop(0, '#666');
      gradient.addColorStop(1, '#000');
      ctx.fillStyle = gradient;
    } else {
      const gradient = ctx.createRadialGradient(px - radius * 0.3, py - radius * 0.3, 0, px, py, radius);
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(0.7, '#ddd');
      gradient.addColorStop(1, '#aaa');
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
    }
    
    ctx.fill();
    if (color === 'white') {ctx.stroke();}
    
    if (isLast) {
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#c41e3a';
      ctx.fill();
    }
    
    if (moveNumber) {
      ctx.fillStyle = color === 'black' ? '#fff' : '#000';
      ctx.font = `bold ${cellSize * 0.35}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(moveNumber.toString(), px, py);
    }
  }

  renderOptions() {
    const optionsContainer = document.getElementById('quiz-options');
    if (!optionsContainer) {return;}
    
    optionsContainer.innerHTML = '<h4>选择下一步：</h4><div class="options-grid"></div>';
    const grid = optionsContainer.querySelector('.options-grid');
    
    this.allOptions.forEach((move, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.x = move.x;
      btn.dataset.y = move.y;
      btn.innerHTML = `
        <div class="option-stone ${move.color}"></div>
        <span>${String.fromCharCode(65 + move.x)}${19 - move.y}</span>
      `;
      btn.addEventListener('click', () => this.checkAnswer(move, btn));
      grid.appendChild(btn);
    });
  }

  checkAnswer(selectedMove, btnElement) {
    const isCorrect = selectedMove.x === this.correctAnswer.x && 
                      selectedMove.y === this.correctAnswer.y;
    
    const time = (Date.now() - this.currentQuiz.startTime) / 1000;
    this.totalCount++;
    
    if (isCorrect) {
      this.correctCount++;
      btnElement.classList.add('correct');
      this.showFeedback(true, '正确！');
      this.drawCorrectMove();
    } else {
      btnElement.classList.add('wrong');
      this.showFeedback(false, '错误！正确答案是：' + 
        String.fromCharCode(65 + this.correctAnswer.x) + (19 - this.correctAnswer.y));
      this.showCorrectAnswer();
    }
    
    this.library.savePracticeRecord(this.quizPattern.id, isCorrect, time);
    this.updateStats();
    
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = true;
    });
    
    setTimeout(() => {
      if (this.totalCount < this.quizCount) {
        this.startNewQuiz();
      } else {
        this.showFinalResult();
      }
    }, 2000);
  }

  drawCorrectMove() {
    this.drawQuizStone(
      this.correctAnswer.x, 
      this.correctAnswer.y, 
      this.correctAnswer.color,
      this.shownMoves.length + 1,
      true
    );
  }

  showCorrectAnswer() {
    document.querySelectorAll('.option-btn').forEach(btn => {
      const x = parseInt(btn.dataset.x);
      const y = parseInt(btn.dataset.y);
      if (x === this.correctAnswer.x && y === this.correctAnswer.y) {
        btn.classList.add('correct');
      }
    });
  }

  showFeedback(isCorrect, message) {
    const feedback = document.getElementById('quiz-feedback');
    feedback.innerHTML = `
      <div class="feedback ${isCorrect ? 'correct' : 'wrong'}">
        ${message}
      </div>
    `;
    
    if (isCorrect) {
      feedback.querySelector('.feedback').style.animation = 'correctPulse 0.5s ease';
    } else {
      feedback.querySelector('.feedback').style.animation = 'wrongShake 0.5s ease';
    }
  }

  updateStats() {
    const correctEl = this.container.querySelector('.correct-count');
    const totalEl = this.container.querySelector('.total-count');
    const accuracyEl = this.container.querySelector('.accuracy');
    
    if (correctEl) {correctEl.textContent = this.correctCount;}
    if (totalEl) {totalEl.textContent = this.totalCount;}
    if (accuracyEl) {accuracyEl.textContent = this.getAccuracy();}
  }

  getAccuracy() {
    if (this.totalCount === 0) {return 0;}
    return Math.round((this.correctCount / this.totalCount) * 100);
  }

  startTimer() {
    const timerEl = document.getElementById('quiz-timer');
    if (!timerEl) {return;}
    
    timerEl.textContent = '用时: 0秒';
    
    this.timerInterval = setInterval(() => {
      if (this.currentQuiz) {
        const elapsed = Math.floor((Date.now() - this.currentQuiz.startTime) / 1000);
        timerEl.textContent = `用时: ${elapsed}秒`;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  showFinalResult() {
    this.stopTimer();
    
    const feedback = document.getElementById('quiz-feedback');
    feedback.innerHTML = `
      <div class="final-result">
        <h3>练习完成！</h3>
        <p>正确率: ${this.getAccuracy()}%</p>
        <p>正确: ${this.correctCount} / ${this.totalCount}</p>
        <button class="quiz-btn" onclick="location.reload()">再来一次</button>
      </div>
    `;
  }

  destroy() {
    this.stopTimer();
    this.container.innerHTML = '';
  }
}

/**
 * 定式学习界面
 */
class PatternStudyUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`容器 #${containerId} 不存在`);
    }
    
    this.library = new PatternLibrary();
    this.library.loadPatterns();
    this.currentCategory = 'all';
    this.searchKeyword = '';
    this.viewer = null;
    this.quiz = null;
    
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = '';
    this.container.className = 'pattern-study-ui';
    
    const sidebar = this.renderSidebar();
    const mainContent = this.renderMainContent();
    
    this.container.appendChild(sidebar);
    this.container.appendChild(mainContent);
    
    this.renderPatternList();
  }

  renderSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'study-sidebar';
    
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <h2>📚 定式库</h2>
        <div class="progress-overview">
          <div class="progress-item">
            <span class="progress-label">已学习</span>
            <span class="progress-value">${this.library.getProgress().studied}</span>
          </div>
          <div class="progress-item">
            <span class="progress-label">已练习</span>
            <span class="progress-value">${this.library.getProgress().practiced}</span>
          </div>
          <div class="progress-item">
            <span class="progress-label">正确率</span>
            <span class="progress-value">${this.library.getProgress().accuracy}%</span>
          </div>
        </div>
      </div>
      
      <div class="search-box">
        <input type="text" id="pattern-search" placeholder="搜索定式..." />
        <button class="search-btn">🔍</button>
      </div>
      
      <div class="category-filters">
        <button class="category-btn active" data-category="all">全部</button>
        <button class="category-btn" data-category="星位">⭐ 星位</button>
        <button class="category-btn" data-category="小目">🎯 小目</button>
        <button class="category-btn" data-category="目外">🌙 目外</button>
        <button class="category-btn" data-category="三三">🔷 三三</button>
      </div>
      
      <div class="difficulty-filter">
        <label>难度筛选：</label>
        <select id="difficulty-select">
          <option value="all">全部难度</option>
          <option value="1">⭐ 入门</option>
          <option value="2">⭐⭐ 基础</option>
          <option value="3">⭐⭐⭐ 进阶</option>
          <option value="4">⭐⭐⭐⭐ 高手</option>
          <option value="5">⭐⭐⭐⭐⭐ 大师</option>
        </select>
      </div>
      
      <div class="pattern-list" id="pattern-list"></div>
    `;
    
    return sidebar;
  }

  renderMainContent() {
    const main = document.createElement('div');
    main.className = 'study-main';
    
    main.innerHTML = `
      <div class="main-header">
        <h2 id="current-title">选择一个定式开始学习</h2>
      </div>
      <div class="main-tabs">
        <button class="tab-btn active" data-tab="viewer">📖 学习</button>
        <button class="tab-btn" data-tab="quiz">✏️ 练习</button>
      </div>
      <div class="main-content">
        <div class="tab-content active" id="viewer-content">
          <div class="placeholder-content">
            <p>从左侧选择一个定式开始学习</p>
          </div>
        </div>
        <div class="tab-content" id="quiz-content">
          <div class="placeholder-content">
            <p>从左侧选择一个定式开始练习</p>
          </div>
        </div>
      </div>
    `;
    
    return main;
  }

  renderPatternList() {
    const listContainer = document.getElementById('pattern-list');
    if (!listContainer) {return;}
    
    let patterns = this.library.getAll();
    
    if (this.currentCategory !== 'all') {
      patterns = patterns.filter(p => p.category === this.currentCategory);
    }
    
    if (this.searchKeyword) {
      patterns = this.library.search(this.searchKeyword);
      if (this.currentCategory !== 'all') {
        patterns = patterns.filter(p => p.category === this.currentCategory);
      }
    }
    
    const difficultyFilter = document.getElementById('difficulty-select')?.value;
    if (difficultyFilter && difficultyFilter !== 'all') {
      patterns = patterns.filter(p => p.difficulty === parseInt(difficultyFilter));
    }
    
    listContainer.innerHTML = patterns.map(pattern => this.createPatternCard(pattern)).join('');
    
    listContainer.querySelectorAll('.pattern-card').forEach(card => {
      card.addEventListener('click', () => {
        const patternId = card.dataset.id;
        this.selectPattern(patternId);
        
        listContainer.querySelectorAll('.pattern-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
      
      const favBtn = card.querySelector('.fav-btn');
      if (favBtn) {
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const patternId = card.dataset.id;
          this.library.toggleFavorite(patternId);
          this.updateFavoriteButton(favBtn, patternId);
        });
      }
    });
  }

  createPatternCard(pattern) {
    const difficultyStars = '★'.repeat(pattern.difficulty) + '☆'.repeat(5 - pattern.difficulty);
    const isFavorite = this.library.isFavorite(pattern.id);
    const isStudied = this.library.progress.studied.includes(pattern.id);
    
    return `
      <div class="pattern-card ${isStudied ? 'studied' : ''}" data-id="${pattern.id}">
        <div class="card-header">
          <h4>${pattern.name}</h4>
          <button class="fav-btn ${isFavorite ? 'active' : ''}">${isFavorite ? '❤️' : '🤍'}</button>
        </div>
        <div class="card-meta">
          <span class="category-tag">${pattern.category}</span>
          <span class="difficulty">${difficultyStars}</span>
        </div>
        <div class="card-preview">
          <canvas class="preview-canvas" data-pattern="${pattern.id}"></canvas>
        </div>
        ${isStudied ? '<div class="studied-badge">已学习</div>' : ''}
      </div>
    `;
  }

  updateFavoriteButton(btn, patternId) {
    const isFavorite = this.library.isFavorite(patternId);
    btn.classList.toggle('active', isFavorite);
    btn.textContent = isFavorite ? '❤️' : '🤍';
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const categoryBtn = e.target.closest('.category-btn');
      if (categoryBtn) {
        this.currentCategory = categoryBtn.dataset.category;
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        categoryBtn.classList.add('active');
        this.renderPatternList();
        this.drawPreviews();
      }
      
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn) {
        const tab = tabBtn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        tabBtn.classList.add('active');
        document.getElementById(`${tab}-content`).classList.add('active');
      }
    });
    
    const searchInput = document.getElementById('pattern-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchKeyword = e.target.value;
        this.renderPatternList();
        this.drawPreviews();
      });
    }
    
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
      difficultySelect.addEventListener('change', () => {
        this.renderPatternList();
        this.drawPreviews();
      });
    }
    
    setTimeout(() => this.drawPreviews(), 100);
  }

  selectPattern(patternId) {
    const pattern = this.library.getById(patternId);
    if (!pattern) {return;}
    
    this.library.markAsStudied(patternId);
    
    document.getElementById('current-title').textContent = pattern.name;
    
    const viewerContent = document.getElementById('viewer-content');
    viewerContent.innerHTML = `<div id="pattern-viewer"></div>`;
    
    if (this.viewer) {
      this.viewer.destroy();
    }
    
    this.viewer = new PatternViewer('pattern-viewer', pattern);
    
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = `<div id="pattern-quiz"></div>`;
    
    if (this.quiz) {
      this.quiz.destroy();
    }
    
    this.quiz = new PatternQuiz('pattern-quiz', this.library);
    this.quiz.render();
    
    const tabBtn = document.querySelector('.tab-btn[data-tab="viewer"]');
    if (tabBtn) {
      tabBtn.click();
    }
  }

  drawPreviews() {
    const canvases = this.container.querySelectorAll('.preview-canvas');
    
    canvases.forEach(canvas => {
      const patternId = canvas.dataset.pattern;
      const pattern = this.library.getById(patternId);
      if (!pattern) {return;}
      
      const boardSize = 19;
      const cellSize = 4;
      const padding = 3;
      const canvasSize = cellSize * (boardSize - 1) + padding * 2;
      
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < boardSize; i++) {
        const pos = padding + i * cellSize;
        
        ctx.beginPath();
        ctx.moveTo(padding, pos);
        ctx.lineTo(padding + (boardSize - 1) * cellSize, pos);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(pos, padding);
        ctx.lineTo(pos, padding + (boardSize - 1) * cellSize);
        ctx.stroke();
      }
      
      const previewMoves = pattern.moves.slice(0, Math.min(8, pattern.moves.length));
      previewMoves.forEach(move => {
        const px = padding + move.x * cellSize;
        const py = padding + move.y * cellSize;
        const radius = cellSize * 0.4;
        
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        
        if (move.color === 'black') {
          ctx.fillStyle = '#000';
        } else {
          ctx.fillStyle = '#fff';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 0.5;
        }
        
        ctx.fill();
        if (move.color === 'white') {ctx.stroke();}
      });
    });
  }

  destroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
    if (this.quiz) {
      this.quiz.destroy();
    }
    this.container.innerHTML = '';
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PatternLibrary, PatternViewer, PatternQuiz, PatternStudyUI };
}
