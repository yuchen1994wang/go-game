/**
 * 围棋引擎公共工具函数
 * 用于 game.js 和 go-engine.js 之间的代码共享
 * 
 * 使用统一的数字表示法：
 * - BLACK: 1 (黑棋)
 * - WHITE: 2 (白棋)
 * - EMPTY: 0 (空位)
 */

const GoUtils = {
  // 常量定义
  BLACK: 1,
  WHITE: 2,
  EMPTY: 0,
  
  // 字符串常量（用于显示）
  BLACK_STR: '黑棋',
  WHITE_STR: '白棋',
  
  // 默认贴目
  DEFAULT_KOMI: 6.5,
  
  // AI 难度级别
  AI_LEVELS: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    EXPERT: 'expert'
  },

  /**
   * 获取给定坐标的相邻坐标
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @param {number} size - 棋盘大小
   * @returns {Array<Array<number>>} 相邻坐标数组
   */
  getNeighbors(x, y, size) {
    const neighbors = [];
    if (x > 0) {neighbors.push([x - 1, y]);}
    if (x < size - 1) {neighbors.push([x + 1, y]);}
    if (y > 0) {neighbors.push([x, y - 1]);}
    if (y < size - 1) {neighbors.push([x, y + 1]);}
    return neighbors;
  },

  /**
   * 检查坐标是否在棋盘范围内
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @param {number} size - 棋盘大小
   * @returns {boolean} 是否在范围内
   */
  isValidPosition(x, y, size) {
    return x >= 0 && x < size && y >= 0 && y < size;
  },

  /**
   * 生成棋盘唯一键
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @returns {string} 唯一键
   */
  posKey(x, y) {
    return `${x},${y}`;
  },

  /**
   * 获取对手棋子
   * @param {number} player - 当前玩家 (1=黑, 2=白)
   * @returns {number} 对手玩家
   */
  getOpponent(player) {
    return player === this.BLACK ? this.WHITE : this.BLACK;
  },

  /**
   * 检查是否为黑棋
   * @param {number} player - 玩家
   * @returns {boolean} 是否为黑棋
   */
  isBlack(player) {
    return player === this.BLACK;
  },

  /**
   * 检查是否为白棋
   * @param {number} player - 玩家
   * @returns {boolean} 是否为白棋
   */
  isWhite(player) {
    return player === this.WHITE;
  },

  /**
   * 获取玩家名称
   * @param {number} player - 玩家 (1=黑, 2=白)
   * @returns {string} 玩家名称
   */
  getPlayerName(player) {
    return player === this.BLACK ? this.BLACK_STR : this.WHITE_STR;
  },

  /**
   * 创建空棋盘
   * @param {number} size - 棋盘大小
   * @returns {Array<Array<number>>} 空棋盘
   */
  createEmptyBoard(size) {
    return Array(size).fill(null).map(() => Array(size).fill(this.EMPTY));
  },

  /**
   * 深拷贝棋盘
   * @param {Array<Array<number>>} board - 棋盘
   * @returns {Array<Array<number>>} 拷贝的棋盘
   */
  cloneBoard(board) {
    return board.map(row => [...row]);
  },

  /**
   * 生成唯一的棋盘哈希（用于缓存）
   * @param {Array<Array<number>>} board - 棋盘
   * @returns {string} 哈希值
   */
  generateBoardHash(board) {
    return board.map(row => row.join('')).join('|');
  }
};

// 兼容性导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoUtils;
}
