/*
 * 本地 AI 引擎 v2
 * 基于 Minimax + Alpha-Beta 剪枝的围棋 AI
 * 支持不同搜索深度：简单(2-3)、中等(4-5)、困难(6-7)、职业(8-9)
 */

class LocalAI {
  static DIFFICULTY_EASY = 1;
  static DIFFICULTY_MEDIUM = 2;
  static DIFFICULTY_HARD = 3;
  static DIFFICULTY_PRO = 4;

  constructor(difficulty = LocalAI.DIFFICULTY_MEDIUM) {
    this.difficulty = difficulty;
    this.searchDepth = this.getSearchDepth(difficulty);
    this.maxCandidates = this.getMaxCandidates(difficulty);
    this.evalCache = new Map();
    this.cacheHits = 0;
    this.nodesSearched = 0;
  }

  getSearchDepth(difficulty) {
    switch (difficulty) {
      case LocalAI.DIFFICULTY_EASY: return 2;
      case LocalAI.DIFFICULTY_MEDIUM: return 4;
      case LocalAI.DIFFICULTY_HARD: return 6;
      case LocalAI.DIFFICULTY_PRO: return 8;
      default: return 4;
    }
  }

  getMaxCandidates(difficulty) {
    switch (difficulty) {
      case LocalAI.DIFFICULTY_EASY: return 15;
      case LocalAI.DIFFICULTY_MEDIUM: return 25;
      case LocalAI.DIFFICULTY_HARD: return 40;
      case LocalAI.DIFFICULTY_PRO: return 60;
      default: return 25;
    }
  }

  getMove(board, boardSize, player, gameEngine) {
    this.evalCache.clear();
    this.nodesSearched = 0;
    this.cacheHits = 0;

    const moves = this.getValidMoves(board, boardSize, player, gameEngine);
    if (moves.length === 0) return { pass: true };

    // 开局前4手使用定式/角部优先
    const moveCount = this.countStones(board, boardSize);
    if (moveCount < 8) {
      const openingMove = this.getOpeningMove(board, boardSize, player, gameEngine, moves);
      if (openingMove) return openingMove;
    }

    // 生成候选着法并排序（使用快速评估）
    const candidates = this.generateCandidates(board, boardSize, player, gameEngine, moves);
    if (candidates.length === 0) return { pass: true };

    // Minimax + Alpha-Beta 搜索
    let bestMove = candidates[0];
    let bestScore = -Infinity;
    const opponent = player === 1 ? 2 : 1;

    for (const move of candidates) {
      const testBoard = this.copyBoard(board);
      testBoard[move.y][move.x] = player;
      this.applyCaptures(testBoard, boardSize, move.x, move.y, player, gameEngine);

      const score = -this.minimax(
        testBoard, boardSize, opponent, player,
        this.searchDepth - 1, -Infinity, Infinity,
        gameEngine
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Minimax + Alpha-Beta 剪枝
  minimax(board, boardSize, currentPlayer, originalPlayer, depth, alpha, beta, gameEngine) {
    this.nodesSearched++;

    // 到达搜索深度，进行局面评估
    if (depth <= 0) {
      return this.evaluatePosition(board, boardSize, originalPlayer);
    }

    const moves = this.getValidMoves(board, boardSize, currentPlayer, gameEngine);

    // 无合法着法，评估当前局面
    if (moves.length === 0) {
      return this.evaluatePosition(board, boardSize, originalPlayer);
    }

    const opponent = currentPlayer === 1 ? 2 : 1;

    // 生成并排序候选着法（提高剪枝效率）
    const candidates = this.generateCandidatesForSearch(board, boardSize, currentPlayer, gameEngine, moves, depth);

    for (const move of candidates) {
      const testBoard = this.copyBoard(board);
      testBoard[move.y][move.x] = currentPlayer;
      this.applyCaptures(testBoard, boardSize, move.x, move.y, currentPlayer, gameEngine);

      const score = -this.minimax(
        testBoard, boardSize, opponent, originalPlayer,
        depth - 1, -beta, -alpha,
        gameEngine
      );

      if (score >= beta) {
        return beta; // Beta 剪枝
      }
      if (score > alpha) {
        alpha = score;
      }
    }

    return alpha;
  }

  // 快速生成候选着法（用于根节点）
  generateCandidates(board, boardSize, player, gameEngine, moves) {
    const scored = [];
    const opponent = player === 1 ? 2 : 1;

    for (const move of moves) {
      let score = this.quickEvaluate(board, boardSize, move.x, move.y, player, opponent, gameEngine);
      scored.push({ ...move, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, this.maxCandidates);
  }

  // 搜索中的候选着法生成（更深时减少候选数）
  generateCandidatesForSearch(board, boardSize, player, gameEngine, moves, depth) {
    const maxCand = Math.max(8, Math.floor(this.maxCandidates * (depth / this.searchDepth)));
    const scored = [];
    const opponent = player === 1 ? 2 : 1;

    for (const move of moves) {
      let score = this.quickEvaluate(board, boardSize, move.x, move.y, player, opponent, gameEngine);
      scored.push({ ...move, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxCand);
  }

  // 快速评估（用于着法排序）
  quickEvaluate(board, boardSize, x, y, player, opponent, gameEngine) {
    let score = 0;

    // 1. 提子价值（最高优先级）
    const captures = this.countCaptures(board, boardSize, x, y, player, gameEngine);
    score += captures * 150;

    // 2. 救子（己方棋子被打吃）
    const saves = this.countSaves(board, boardSize, x, y, player, gameEngine);
    score += saves * 120;

    // 3. 位置价值
    score += this.getPositionValue(x, y, boardSize);

    // 4. 连接己方棋子
    if (this.isNearFriendly(board, boardSize, x, y, player)) {
      score += 30;
    }

    // 5. 分断对方
    if (this.isNearEnemy(board, boardSize, x, y, opponent)) {
      score += 25;
    }

    // 6. 眼位相关
    const eyeValue = this.evaluateEyePotential(board, boardSize, x, y, player);
    score += eyeValue;

    // 7. 避免自杀
    const testBoard = this.copyBoard(board);
    testBoard[y][x] = player;
    const libs = this.countLiberties(testBoard, boardSize, x, y);
    if (libs === 1) score -= 80;
    if (libs >= 3) score += 20;

    return score;
  }

  // 完整局面评估（用于叶子节点）
  evaluatePosition(board, boardSize, player) {
    const cacheKey = this.boardHash(board, boardSize);
    if (this.evalCache.has(cacheKey)) {
      this.cacheHits++;
      return this.evalCache.get(cacheKey);
    }

    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    // 1. 领地评估（主要因素）
    const territory = this.evaluateTerritory(board, boardSize, player);
    score += territory * 10;

    // 2. 棋子安全性
    const safety = this.evaluateSafety(board, boardSize, player);
    score += safety * 8;

    // 3. 棋形评估
    const shape = this.evaluateShape(board, boardSize, player);
    score += shape * 5;

    // 4. 势力/厚势
    const influence = this.evaluateInfluence(board, boardSize, player);
    score += influence * 3;

    // 5. 目数差（直接计算）
    const scoreDiff = this.estimateScore(board, boardSize, player);
    score += scoreDiff * 15;

    this.evalCache.set(cacheKey, score);
    return score;
  }

  // 领地评估（使用 flood fill 判断区域归属）
  evaluateTerritory(board, boardSize, player) {
    const opponent = player === 1 ? 2 : 1;
    let playerTerritory = 0;
    let opponentTerritory = 0;
    const visited = new Set();

    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] !== 0 || visited.has(`${x},${y}`)) continue;

        const region = this.floodFillRegion(board, boardSize, x, y, visited);
        const owner = this.determineOwner(board, boardSize, region, player, opponent);

        if (owner === player) playerTerritory += region.length;
        else if (owner === opponent) opponentTerritory += region.length;
      }
    }

    return playerTerritory - opponentTerritory;
  }

  floodFillRegion(board, boardSize, startX, startY, visited) {
    const region = [];
    const queue = [[startX, startY]];
    visited.add(`${startX},${startY}`);

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      region.push({ x, y });

      const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize &&
            board[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
        }
      }
    }

    return region;
  }

  determineOwner(board, boardSize, region, player, opponent) {
    let playerAdjacent = false;
    let opponentAdjacent = false;

    for (const { x, y } of region) {
      const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
          if (board[ny][nx] === player) playerAdjacent = true;
          if (board[ny][nx] === opponent) opponentAdjacent = true;
        }
      }
    }

    if (playerAdjacent && !opponentAdjacent) return player;
    if (opponentAdjacent && !playerAdjacent) return opponent;
    return 0; // 未定
  }

  // 棋子安全性评估
  evaluateSafety(board, boardSize, player) {
    const opponent = player === 1 ? 2 : 1;
    let safety = 0;

    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] === player) {
          const libs = this.countLiberties(board, boardSize, x, y);
          if (libs === 1) safety -= 50; // 被打吃
          else if (libs === 2) safety -= 15;
          else if (libs >= 4) safety += 10;
        } else if (board[y][x] === opponent) {
          const libs = this.countLiberties(board, boardSize, x, y);
          if (libs === 1) safety += 40; // 对方被打吃
          else if (libs === 2) safety += 10;
        }
      }
    }

    return safety;
  }

  // 棋形评估
  evaluateShape(board, boardSize, player) {
    let shape = 0;

    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] === player) {
          // 跳、飞等好形
          shape += this.evaluateLocalShape(board, boardSize, x, y, player);
        }
      }
    }

    return shape;
  }

  evaluateLocalShape(board, boardSize, x, y, player) {
    let score = 0;

    // 检查常见好形
    const patterns = [
      // 跳
      { dx: 2, dy: 0, value: 8 },
      { dx: 0, dy: 2, value: 8 },
      // 飞
      { dx: 2, dy: 1, value: 10 },
      { dx: 1, dy: 2, value: 10 },
      // 大跳
      { dx: 3, dy: 0, value: 5 },
      { dx: 0, dy: 3, value: 5 },
    ];

    for (const p of patterns) {
      const nx = x + p.dx, ny = y + p.dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === player) {
        score += p.value;
      }
    }

    return score;
  }

  // 势力评估
  evaluateInfluence(board, boardSize, player) {
    const opponent = player === 1 ? 2 : 1;
    let influence = 0;

    // 简化：棋子距离边界的远近反映势力
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] === player) {
          const centerDist = Math.abs(x - boardSize / 2) + Math.abs(y - boardSize / 2);
          influence += (boardSize - centerDist) * 0.5;
        } else if (board[y][x] === opponent) {
          const centerDist = Math.abs(x - boardSize / 2) + Math.abs(y - boardSize / 2);
          influence -= (boardSize - centerDist) * 0.5;
        }
      }
    }

    return influence;
  }

  // 目数估算
  estimateScore(board, boardSize, player) {
    const opponent = player === 1 ? 2 : 1;
    let playerScore = 0;
    let opponentScore = 0;

    // 简单目数计算：棋子 + 明显领地
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] === player) playerScore += 1;
        else if (board[y][x] === opponent) opponentScore += 1;
      }
    }

    // 加上领地估算
    const territory = this.evaluateTerritory(board, boardSize, player);
    playerScore += territory > 0 ? territory * 0.7 : 0;
    opponentScore += territory < 0 ? -territory * 0.7 : 0;

    return playerScore - opponentScore;
  }

  // 开局着法
  getOpeningMove(board, boardSize, player, gameEngine, moves) {
    const corners = [
      { x: 3, y: 3 }, { x: boardSize - 4, y: 3 },
      { x: 3, y: boardSize - 4 }, { x: boardSize - 4, y: boardSize - 4 }
    ];

    // 优先占空角
    for (const corner of corners) {
      if (board[corner.y][corner.x] === 0 && gameEngine.isValidMove(corner.x, corner.y, player)) {
        return corner;
      }
    }

    // 次优先：小目、星位
    const starPoints = [
      { x: 3, y: 3 }, { x: boardSize - 4, y: 3 },
      { x: 3, y: boardSize - 4 }, { x: boardSize - 4, y: boardSize - 4 },
      { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) }
    ];

    for (const sp of starPoints) {
      if (board[sp.y][sp.x] === 0 && gameEngine.isValidMove(sp.x, sp.y, player)) {
        return sp;
      }
    }

    return null;
  }

  // 位置价值（棋盘不同位置的价值）
  getPositionValue(x, y, boardSize) {
    const center = (boardSize - 1) / 2;
    const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
    const maxDist = Math.sqrt(2) * center;

    // 角 > 边 > 中腹（开局），但中腹也有价值
    let value = (maxDist - dist) / maxDist * 20;

    // 三线、四线加分
    const isThirdLine = x === 2 || y === 2 || x === boardSize - 3 || y === boardSize - 3;
    const isFourthLine = x === 3 || y === 3 || x === boardSize - 4 || y === boardSize - 4;

    if (isThirdLine) value += 25;
    if (isFourthLine) value += 20;

    // 角部加分
    const isCorner = (x < 5 && y < 5) || (x < 5 && y >= boardSize - 5) ||
                     (x >= boardSize - 5 && y < 5) || (x >= boardSize - 5 && y >= boardSize - 5);
    if (isCorner) value += 15;

    return value;
  }

  // 眼位潜力评估
  evaluateEyePotential(board, boardSize, x, y, player) {
    let score = 0;
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let friendlyNeighbors = 0;
    let emptyNeighbors = 0;

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
        if (board[ny][nx] === player) friendlyNeighbors++;
        else if (board[ny][nx] === 0) emptyNeighbors++;
      }
    }

    // 靠近己方棋子，可能形成眼位
    if (friendlyNeighbors >= 2 && emptyNeighbors >= 2) {
      score += 20;
    }

    return score;
  }

  // 计算提子数
  countCaptures(board, boardSize, x, y, player, gameEngine) {
    const opponent = player === 1 ? 2 : 1;
    const testBoard = this.copyBoard(board);
    testBoard[y][x] = player;

    let captures = 0;
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === opponent) {
        const group = this.getGroup(testBoard, boardSize, nx, ny);
        if (group.liberties === 0) {
          captures += group.stones.length;
        }
      }
    }

    return captures;
  }

  // 计算救子数
  countSaves(board, boardSize, x, y, player, gameEngine) {
    const opponent = player === 1 ? 2 : 1;
    let saves = 0;
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === player) {
        const libs = this.countLiberties(board, boardSize, nx, ny);
        if (libs === 1) {
          // 检查下在这里是否能救
          const testBoard = this.copyBoard(board);
          testBoard[y][x] = player;
          const newLibs = this.countLiberties(testBoard, boardSize, nx, ny);
          if (newLibs > 1) saves++;
        }
      }
    }

    return saves;
  }

  // 应用提子
  applyCaptures(board, boardSize, x, y, player, gameEngine) {
    const opponent = player === 1 ? 2 : 1;
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === opponent) {
        const group = this.getGroup(board, boardSize, nx, ny);
        if (group.liberties === 0) {
          for (const stone of group.stones) {
            board[stone.y][stone.x] = 0;
          }
        }
      }
    }
  }

  // 是否靠近己方棋子
  isNearFriendly(board, boardSize, x, y, player) {
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === player) {
        return true;
      }
    }
    return false;
  }

  // 是否靠近对方棋子
  isNearEnemy(board, boardSize, x, y, opponent) {
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === opponent) {
        return true;
      }
    }
    return false;
  }

  // 获取合法着法
  getValidMoves(board, boardSize, player, gameEngine) {
    const moves = [];
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] === 0 && gameEngine.isValidMove(x, y, player)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }

  // 统计棋盘上的棋子数
  countStones(board, boardSize) {
    let count = 0;
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (board[y][x] !== 0) count++;
      }
    }
    return count;
  }

  // 获取棋组
  getGroup(board, boardSize, x, y) {
    const color = board[y][x];
    if (!color) return { stones: [], liberties: 0 };

    const visited = Array(boardSize).fill(null).map(() => Array(boardSize).fill(false));
    const group = [];
    const liberties = new Set();

    const stack = [[x, y]];
    visited[y][x] = true;

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      group.push({ x: cx, y: cy });

      const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = cx + dx, ny = cy + dy;

        if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
          if (!visited[ny][nx]) {
            if (board[ny][nx] === color) {
              visited[ny][nx] = true;
              stack.push([nx, ny]);
            } else if (board[ny][nx] === 0) {
              liberties.add(`${nx},${ny}`);
            }
          }
        }
      }
    }

    return { stones: group, liberties: liberties.size };
  }

  // 计算气数
  countLiberties(board, boardSize, x, y) {
    const group = this.getGroup(board, boardSize, x, y);
    return group.liberties;
  }

  // 复制棋盘
  copyBoard(board) {
    return board.map(row => [...row]);
  }

  // 棋盘哈希（用于缓存）
  boardHash(board, boardSize) {
    let hash = '';
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        hash += board[y][x];
      }
    }
    return hash;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalAI;
}
