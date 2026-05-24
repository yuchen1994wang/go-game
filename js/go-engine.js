/**
 * 围棋规则引擎
 * 统一使用数字常量：BLACK=1, WHITE=2, EMPTY=0
 */

// 加载公共工具模块
if (typeof GoUtils === 'undefined') {
  if (typeof require !== 'undefined') {
    try {
      GoUtils = require('./go-utils');
    } catch (e) {
      GoUtils = {};
    }
  } else {
    GoUtils = {};
  }
}

/**
 * 围棋规则引擎类
 * 负责处理围棋规则、落子验证、提子等核心逻辑
 */
class GoEngine {
  /**
   * 创建围棋引擎实例
   * @param {number} size - 棋盘大小，默认19
   */
  constructor(size = 19) {
    this.size = size;
    this.board = GoUtils.createEmptyBoard(size);
    this.currentPlayer = GoUtils.BLACK;
    this.moveHistory = [];
    this.capturedByBlack = 0;
    this.capturedByWhite = 0;
    this.koPoint = null;
  }

  /**
   * 重置游戏
   */
  reset() {
    this.board = GoUtils.createEmptyBoard(this.size);
    this.currentPlayer = GoUtils.BLACK;
    this.moveHistory = [];
    this.capturedByBlack = 0;
    this.capturedByWhite = 0;
    this.koPoint = null;
  }

  /**
   * 克隆引擎状态
   * @returns {GoEngine} 克隆的引擎
   */
  clone() {
    const engine = new GoEngine(this.size);
    engine.board = GoUtils.cloneBoard(this.board);
    engine.currentPlayer = this.currentPlayer;
    engine.moveHistory = [...this.moveHistory];
    engine.capturedByBlack = this.capturedByBlack;
    engine.capturedByWhite = this.capturedByWhite;
    engine.koPoint = this.koPoint ? { ...this.koPoint } : null;
    return engine;
  }

  /**
   * 获取指定坐标的邻居
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @returns {Array<Array<number>>} 邻居坐标数组
   */
  getNeighbors(x, y) {
    return GoUtils.getNeighbors(x, y, this.size);
  }

  /**
   * 获取指定坐标的棋子所属的棋组
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @returns {Object} 包含stones和liberties的对象
   */
  getGroup(x, y) {
    const color = this.board[y][x];
    if (color === GoUtils.EMPTY) {return { stones: [], liberties: 0 };}

    const stones = [];
    const liberties = new Set();
    const visited = new Set();
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const key = GoUtils.posKey(cx, cy);
      if (visited.has(key)) {continue;}
      visited.add(key);

      if (this.board[cy][cx] === color) {
        stones.push([cx, cy]);
        const neighbors = this.getNeighbors(cx, cy);
        for (const [nx, ny] of neighbors) {
          if (this.board[ny][nx] === GoUtils.EMPTY) {
            liberties.add(GoUtils.posKey(nx, ny));
          } else if (this.board[ny][nx] === color && !visited.has(GoUtils.posKey(nx, ny))) {
            stack.push([nx, ny]);
          }
        }
      }
    }

    return { stones, liberties: liberties.size };
  }

  /**
   * 检查落子是否合法
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @returns {boolean} 是否合法
   */
  isValidMove(x, y) {
    if (!GoUtils.isValidPosition(x, y, this.size)) {return false;}
    if (this.board[y][x] !== GoUtils.EMPTY) {return false;}
    if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) {return false;}

    const testBoard = this.clone();
    testBoard.board[y][x] = this.currentPlayer;

    const opponent = GoUtils.getOpponent(this.currentPlayer);
    const captured = testBoard.removeCapturedStones(opponent);

    if (captured > 0) {return true;}

    const group = testBoard.getGroup(x, y);
    if (group.liberties === 0) {return false;}

    return true;
  }

  /**
   * 移除被吃的棋子
   * @param {number} player - 玩家 (BLACK or WHITE)
   * @returns {number} 被吃棋子数量
   */
  removeCapturedStones(player) {
    let totalCaptured = 0;
    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === player && !checked.has(GoUtils.posKey(x, y))) {
          const group = this.getGroup(x, y);
          if (group.liberties === 0) {
            group.stones.forEach(([sx, sy]) => {
              this.board[sy][sx] = GoUtils.EMPTY;
              totalCaptured++;
            });
          }
          group.stones.forEach(([sx, sy]) => checked.add(GoUtils.posKey(sx, sy)));
        }
      }
    }

    return totalCaptured;
  }

  /**
   * 检查自杀
   * @returns {number} 自杀棋子数量
   */
  checkSuicide() {
    let suicideCount = 0;
    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === this.currentPlayer && !checked.has(GoUtils.posKey(x, y))) {
          const group = this.getGroup(x, y);
          if (group.liberties === 0) {
            suicideCount += group.stones.length;
          }
          group.stones.forEach(([sx, sy]) => checked.add(GoUtils.posKey(sx, sy)));
        }
      }
    }

    return suicideCount;
  }

  /**
   * 落子
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @returns {boolean} 是否成功
   */
  play(x, y) {
    if (!this.isValidMove(x, y)) {return false;}

    const opponent = GoUtils.getOpponent(this.currentPlayer);
    const tempBoard = GoUtils.cloneBoard(this.board);
    tempBoard[y][x] = this.currentPlayer;

    // 先找到并记录被提的棋子
    const capturedStones = [];
    const checked = new Set();
    for (let cy = 0; cy < this.size; cy++) {
      for (let cx = 0; cx < this.size; cx++) {
        if (tempBoard[cy][cx] === opponent && !checked.has(GoUtils.posKey(cx, cy))) {
          const group = this.getGroupForBoard(tempBoard, cx, cy);
          group.stones.forEach(([sx, sy]) => checked.add(GoUtils.posKey(sx, sy)));
          if (group.liberties === 0) {
            capturedStones.push(...group.stones);
          }
        }
      }
    }

    // 移除被提的棋子
    capturedStones.forEach(([cx, cy]) => {
      tempBoard[cy][cx] = GoUtils.EMPTY;
    });

    this.board = tempBoard;
    const captured = capturedStones.length;
    if (this.currentPlayer === GoUtils.BLACK) {
      this.capturedByBlack += captured;
    } else {
      this.capturedByWhite += captured;
    }

    const suicide = this.checkSuicide();
    if (suicide > 0) {
      if (this.currentPlayer === GoUtils.BLACK) {
        this.capturedByWhite += suicide;
      } else {
        this.capturedByBlack += suicide;
      }
    }

    // 打劫检测
    if (captured === 1) {
      const newGroup = this.getGroup(x, y);
      if (newGroup.stones.length === 1 && newGroup.liberties === 1) {
        const [cx, cy] = capturedStones[0];
        this.koPoint = { x: cx, y: cy };
      } else {
        this.koPoint = null;
      }
    } else {
      this.koPoint = null;
    }

    this.moveHistory.push({ x, y, player: this.currentPlayer, captured });
    this.currentPlayer = opponent;
    return true;
  }

  /**
   * 从指定棋盘获取棋组（辅助方法）
   * @param {Array<Array<number>>} board - 棋盘
   * @param {number} x - 横坐标
   * @param {number} y - 纵坐标
   * @returns {Object} 包含stones和liberties的对象
   */
  getGroupForBoard(board, x, y) {
    const color = board[y][x];
    if (color === GoUtils.EMPTY) {return { stones: [], liberties: 0 };}

    const stones = [];
    const liberties = new Set();
    const visited = new Set();
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const key = GoUtils.posKey(cx, cy);
      if (visited.has(key)) {continue;}
      visited.add(key);

      if (board[cy][cx] === color) {
        stones.push([cx, cy]);
        const neighbors = this.getNeighbors(cx, cy);
        for (const [nx, ny] of neighbors) {
          if (board[ny][nx] === GoUtils.EMPTY) {
            liberties.add(GoUtils.posKey(nx, ny));
          } else if (board[ny][nx] === color && !visited.has(GoUtils.posKey(nx, ny))) {
            stack.push([nx, ny]);
          }
        }
      }
    }

    return { stones, liberties: liberties.size };
  }

  /**
   * 获取当前玩家
   * @returns {number} 当前玩家 (BLACK or WHITE)
   */
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  /**
   * 获取已吃子数
   * @returns {Object} { black, white }
   */
  getCaptured() {
    return {
      black: this.capturedByBlack,
      white: this.capturedByWhite
    };
  }

  /**
   * 获取棋子数量
   * @returns {Object} { black, white }
   */
  countStones() {
    let black = 0;
    let white = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === GoUtils.BLACK) {black++;}
        else if (this.board[y][x] === GoUtils.WHITE) {white++;}
      }
    }
    return { black, white };
  }

  /**
   * 停一手
   * @returns {boolean} 是否成功
   */
  pass() {
    this.moveHistory.push({ pass: true, player: this.currentPlayer });
    this.currentPlayer = GoUtils.getOpponent(this.currentPlayer);
    return true;
  }

  /**
   * 检查是否连续两手都停
   * @returns {boolean} 是否连续两手停
   */
  isTwoPasses() {
    if (this.moveHistory.length < 2) {return false;}
    const last = this.moveHistory[this.moveHistory.length - 1];
    const secondLast = this.moveHistory[this.moveHistory.length - 2];
    return last.pass === true && secondLast.pass === true;
  }

  /**
   * 分析局面
   * @returns {Object} 包含棋组信息的对象
   */
  analyzePosition() {
    const groups = [];
    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] !== GoUtils.EMPTY && !checked.has(GoUtils.posKey(x, y))) {
          const group = this.getGroup(x, y);
          group.stones.forEach(([sx, sy]) => checked.add(GoUtils.posKey(sx, sy)));
          groups.push({
            stones: group.stones,
            color: this.board[y][x],
            liberties: group.liberties
          });
        }
      }
    }

    return {
      groups,
      nextPlayer: this.currentPlayer,
      moveCount: this.moveHistory.length,
      captured: this.getCaptured()
    };
  }
}

// 兼容性导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoEngine;
}
