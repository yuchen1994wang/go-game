/**
 * 本地围棋AI引擎
 * 基于规则的简单AI，支持多难度级别
 */

class LocalAI {
  /**
   * 创建本地AI实例
   * @param {string} level - 难度级别：'easy', 'medium', 'hard', 'expert'
   */
  constructor(level = 'medium') {
    this.level = level;
    this.name = this.getLevelName();
  }

  /**
   * 获取难度级别名称
   * @returns {string} 难度名称
   */
  getLevelName() {
    const names = {
      'easy': '入门',
      'medium': '业余',
      'hard': '有段',
      'expert': '高手'
    };
    return names[this.level] || '业余';
  }

  /**
   * 设置难度级别
   * @param {string} level - 难度级别
   */
  setLevel(level) {
    this.level = level;
    this.name = this.getLevelName();
  }

  /**
   * 获取AI推荐落子
   * @param {GoGame} game - 游戏实例
   * @returns {Object} 落子位置 {x, y}
   */
  getMove(game) {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) {return null;}

    // 根据难度级别选择策略
    switch (this.level) {
      case 'easy':
        return this.getEasyMove(game, validMoves);
      case 'medium':
        return this.getMediumMove(game, validMoves);
      case 'hard':
        return this.getHardMove(game, validMoves);
      case 'expert':
        return this.getExpertMove(game, validMoves);
      default:
        return this.getMediumMove(game, validMoves);
    }
  }

  /**
   * 入门级AI：随机落子，偶尔选择星位
   */
  getEasyMove(game, validMoves) {
    // 30%概率选择星位
    if (Math.random() < 0.3) {
      const starPoints = this.getStarPoints(game.size);
      const validStars = starPoints.filter(p => 
        validMoves.some(m => m.x === p.x && m.y === p.y)
      );
      if (validStars.length > 0) {
        return validStars[Math.floor(Math.random() * validStars.length)];
      }
    }

    // 随机选择一个合法位置
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  /**
   * 业余级AI：会吃子，会逃跑
   */
  getMediumMove(game, validMoves) {
    // 1. 检查能否吃子
    const captureMoves = this.getCaptureMoves(game, validMoves);
    if (captureMoves.length > 0) {
      return this.randomSelect(captureMoves);
    }

    // 2. 检查是否需要逃跑
    const escapeMoves = this.getEscapeMoves(game, validMoves);
    if (escapeMoves.length > 0) {
      return this.randomSelect(escapeMoves);
    }

    // 3. 检查能否连接己方棋子
    const connectMoves = this.getConnectMoves(game, validMoves);
    if (connectMoves.length > 0 && Math.random() < 0.4) {
      return this.randomSelect(connectMoves);
    }

    // 4. 选择星位或边位
    const strategicMoves = this.getStrategicMoves(game, validMoves);
    if (strategicMoves.length > 0) {
      return this.randomSelect(strategicMoves);
    }

    // 5. 随机
    return this.randomSelect(validMoves);
  }

  /**
   * 有段级AI：会做眼，会攻击
   */
  getHardMove(game, validMoves) {
    // 1. 检查能否吃大龙
    const bigCaptureMoves = this.getBigCaptureMoves(game, validMoves);
    if (bigCaptureMoves.length > 0) {
      return this.randomSelect(bigCaptureMoves);
    }

    // 2. 检查能否做活
    const lifeMoves = this.getLifeMoves(game, validMoves);
    if (lifeMoves.length > 0) {
      return this.randomSelect(lifeMoves);
    }

    // 3. 检查能否攻击对方
    const attackMoves = this.getAttackMoves(game, validMoves);
    if (attackMoves.length > 0) {
      return this.randomSelect(attackMoves);
    }

    // 4. 中级策略
    return this.getMediumMove(game, validMoves);
  }

  /**
   * 高手级AI：会全局思考
   */
  getExpertMove(game, validMoves) {
    // 1. 检查关键点（征子、扑吃等）
    const criticalMoves = this.getCriticalMoves(game, validMoves);
    if (criticalMoves.length > 0) {
      return this.randomSelect(criticalMoves);
    }

    // 2. 评估所有落子
    const scoredMoves = validMoves.map(move => ({
      ...move,
      score: this.evaluateMove(game, move)
    }));

    // 3. 选择最高分（带一点随机性）
    scoredMoves.sort((a, b) => b.score - a.score);
    const topMoves = scoredMoves.filter(m => 
      m.score >= scoredMoves[0].score - 0.5
    );
    return this.randomSelect(topMoves);
  }

  /**
   * 评估落子的分数
   */
  evaluateMove(game, move) {
    let score = 0;
    const tempGame = this.cloneGame(game);
    tempGame.makeMove(move.x, move.y);

    // 1. 提子得分
    const lastMove = tempGame.moveHistory[tempGame.moveHistory.length - 1];
    if (lastMove.captures) {
      score += lastMove.captures.length * 10;
    }

    // 2. 增加己方气数
    const myGroup = tempGame.getGroup(move.x, move.y);
    score += myGroup.length * 2;
    score += myGroup.liberties * 1.5;

    // 3. 减少对方气数
    const opponent = game.currentPlayer === 1 ? 2 : 1;
    const neighbors = this.getNeighbors(move.x, move.y, tempGame.size);
    neighbors.forEach(([nx, ny]) => {
      if (tempGame.board[ny][nx] === opponent) {
        const oppGroup = tempGame.getGroup(nx, ny);
        if (oppGroup.liberties === 1) {
          score += oppGroup.stones.length * 5; // 威胁吃子
        } else if (oppGroup.liberties === 2) {
          score += oppGroup.stones.length * 2;
        }
      }
    });

    // 4. 位置得分
    score += this.getPositionScore(move.x, move.y, tempGame.size);

    return score;
  }

  /**
   * 获取位置得分
   */
  getPositionScore(x, y, size) {
    let score = 0;
    const center = (size - 1) / 2;

    // 距离中心的距离（越近越好）
    const distFromCenter = Math.abs(x - center) + Math.abs(y - center);
    score += (size - distFromCenter) * 0.5;

    // 星位加分
    const starPoints = this.getStarPoints(size);
    if (starPoints.some(p => p.x === x && p.y === y)) {
      score += 5;
    }

    return score;
  }

  /**
   * 获取星位坐标
   */
  getStarPoints(size) {
    const points = [];
    if (size === 9) {
      points.push({x: 2, y: 2}, {x: 6, y: 2}, {x: 4, y: 4}, {x: 2, y: 6}, {x: 6, y: 6});
    } else if (size === 13) {
      points.push({x: 3, y: 3}, {x: 9, y: 3}, {x: 6, y: 6}, {x: 3, y: 9}, {x: 9, y: 9});
    } else if (size === 19) {
      points.push({x: 3, y: 3}, {x: 9, y: 3}, {x: 15, y: 3}, 
                 {x: 3, y: 9}, {x: 9, y: 9}, {x: 15, y: 9},
                 {x: 3, y: 15}, {x: 9, y: 15}, {x: 15, y: 15});
    }
    return points;
  }

  /**
   * 获取能吃子的落子
   */
  getCaptureMoves(game, validMoves) {
    return validMoves.filter(move => {
      const tempGame = this.cloneGame(game);
      const result = tempGame.makeMove(move.x, move.y);
      return result.success && result.captures && result.captures.length >= 1;
    });
  }

  /**
   * 获取能吃大龙的落子
   */
  getBigCaptureMoves(game, validMoves) {
    return validMoves.filter(move => {
      const tempGame = this.cloneGame(game);
      const result = tempGame.makeMove(move.x, move.y);
      return result.success && result.captures && result.captures.length >= 3;
    });
  }

  /**
   * 获取逃跑的落子
   */
  getEscapeMoves(game, validMoves) {
    const myColor = game.currentPlayer;
    const myStones = [];

    // 找到己方需要逃跑的棋子
    for (let y = 0; y < game.size; y++) {
      for (let x = 0; x < game.size; x++) {
        if (game.board[y][x] === myColor) {
          const group = game.getGroup(x, y);
          if (group.liberties === 1) {
            myStones.push({x, y, group});
          }
        }
      }
    }

    if (myStones.length === 0) {return [];}

    // 找到能让己方棋子逃跑的落子
    return validMoves.filter(move => {
      return myStones.some(stone => {
        const neighbors = this.getNeighbors(stone.x, stone.y, game.size);
        return neighbors.some(([nx, ny]) => nx === move.x && ny === move.y);
      });
    });
  }

  /**
   * 获取连接己方棋子的落子
   */
  getConnectMoves(game, validMoves) {
    const myColor = game.currentPlayer;
    return validMoves.filter(move => {
      const neighbors = this.getNeighbors(move.x, move.y, game.size);
      return neighbors.some(([nx, ny]) => game.board[ny][nx] === myColor);
    });
  }

  /**
   * 获取战略性落子
   */
  getStrategicMoves(game, validMoves) {
    // 星位优先
    const starPoints = this.getStarPoints(game.size);
    const validStars = validMoves.filter(m => 
      starPoints.some(p => p.x === m.x && p.y === m.y)
    );
    if (validStars.length > 0) {
      return validStars;
    }

    // 边位优先
    const edgeMoves = validMoves.filter(m => 
      m.x === 0 || m.x === game.size - 1 || m.y === 0 || m.y === game.size - 1
    );
    if (edgeMoves.length > 0) {
      return edgeMoves;
    }

    return [];
  }

  /**
   * 获取做活的落子
   */
  getLifeMoves(game, validMoves) {
    return validMoves.filter(move => {
      const tempGame = this.cloneGame(game);
      tempGame.makeMove(move.x, move.y);
      const group = tempGame.getGroup(move.x, move.y);
      return group.liberties >= 3;
    });
  }

  /**
   * 获取攻击对方的落子
   */
  getAttackMoves(game, validMoves) {
    const opponent = game.currentPlayer === 1 ? 2 : 1;
    const attackMoves = [];

    validMoves.forEach(move => {
      const neighbors = this.getNeighbors(move.x, move.y, game.size);
      neighbors.forEach(([nx, ny]) => {
        if (game.board[ny][nx] === opponent) {
          const group = game.getGroup(nx, ny);
          if (group.liberties <= 2) {
            attackMoves.push(move);
          }
        }
      });
    });

    return attackMoves;
  }

  /**
   * 获取关键点（征子、扑吃等）
   */
  getCriticalMoves(game, validMoves) {
    const criticalMoves = [];

    validMoves.forEach(move => {
      const tempGame = this.cloneGame(game);
      tempGame.makeMove(move.x, move.y);

      // 检查是否提掉了关键棋子
      const lastMove = tempGame.moveHistory[tempGame.moveHistory.length - 1];
      if (lastMove.captures && lastMove.captures.length >= 1) {
        // 检查是否能形成征子或扑吃
        const tempGame2 = this.cloneGame(tempGame);
        const opponent = tempGame.currentPlayer;
        const escaped = tempGame2.simulateEscape();
        if (!escaped) {
          criticalMoves.push(move);
        }
      }
    });

    return criticalMoves;
  }

  /**
   * 获取邻居坐标
   */
  getNeighbors(x, y, size) {
    const neighbors = [];
    if (x > 0) {neighbors.push([x - 1, y]);}
    if (x < size - 1) {neighbors.push([x + 1, y]);}
    if (y > 0) {neighbors.push([x, y - 1]);}
    if (y < size - 1) {neighbors.push([x, y + 1]);}
    return neighbors;
  }

  /**
   * 随机选择
   */
  randomSelect(arr) {
    if (arr.length === 0) {return null;}
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * 克隆游戏（用于模拟落子）
   */
  cloneGame(game) {
    const cloned = new game.constructor(game.size);
    game.moveHistory.forEach(move => {
      if (move.pass) {
        cloned.pass();
      } else {
        cloned.makeMove(move.x, move.y);
      }
    });
    return cloned;
  }
}

// 兼容性导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalAI;
}
