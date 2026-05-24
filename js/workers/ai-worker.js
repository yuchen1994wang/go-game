/**
 * AI 计算 Worker
 * 用于在后台线程执行AI棋步计算，避免阻塞主线程
 */

self.onmessage = function(event) {
  const { id, type, data } = event.data;

  try {
    let result;

    switch (type) {
      case 'calculateMove':
        result = calculateBestMove(data);
        break;
      case 'evaluatePosition':
        result = evaluatePosition(data);
        break;
      case 'analyzePatterns':
        result = analyzePatterns(data);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    self.postMessage({ id, data: result });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
};

/**
 * 计算最佳落子位置
 * @param {Object} data - 包含棋盘和玩家信息
 * @returns {Object} 最佳落子位置和评分
 */
function calculateBestMove(data) {
  const { board, size, player, depth = 3 } = data;

  let bestMove = null;
  let bestScore = -Infinity;

  const candidates = getCandidateMoves(board, size, player);

  for (const move of candidates) {
    const newBoard = makeMove(board, size, move.x, move.y, player);
    const score = minimax(newBoard, size, depth - 1, false, player);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return {
    move: bestMove,
    score: bestScore,
    candidates: candidates.length
  };
}

/**
 * 评估当前局面
 * @param {Object} data - 包含棋盘信息
 * @returns {Object} 评估结果
 */
function evaluatePosition(data) {
  const { board, size, player } = data;

  let blackStones = 0;
  let whiteStones = 0;
  let blackTerritory = 0;
  let whiteTerritory = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === 1) blackStones++;
      if (board[y][x] === 2) whiteStones++;
    }
  }

  const score = calculateScore(board, size, blackStones, whiteStones);

  return {
    stones: { black: blackStones, white: whiteStones },
    territory: { black: score.blackTerritory, white: score.whiteTerritory },
    total: { black: score.blackTotal, white: score.whiteTotal },
    advantage: score.blackTotal - score.whiteTotal
  };
}

/**
 * 分析棋型
 * @param {Object} data - 包含棋盘和位置信息
 * @returns {Object} 棋型分析结果
 */
function analyzePatterns(data) {
  const { board, size, x, y } = data;
  const color = board[y][x];

  if (color === 0) {
    return { error: 'Position is empty' };
  }

  const neighbors = getNeighbors(x, y, size);
  const group = getGroup(board, size, x, y);
  const liberties = countLiberties(board, size, group);

  return {
    color,
    neighbors: neighbors.length,
    groupSize: group.length,
    liberties,
    isInAtari: liberties === 1,
    isDead: liberties === 0,
    isEye: checkEye(board, size, x, y, color)
  };
}

// 辅助函数
function getCandidateMoves(board, size, player) {
  const candidates = [];
  const checked = new Set();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      const nearby = getNeighbors(x, y, size).filter(n => board[n[1]][n[0]] !== 0);
      if (nearby.length > 0 && !checked.has(`${x},${y}`)) {
        candidates.push({ x, y });
        nearby.forEach(n => checked.add(`${n[0]},${n[1]}`));
      }
    }
  }

  return candidates.slice(0, 20);
}

function getNeighbors(x, y, size) {
  const neighbors = [];
  if (x > 0) neighbors.push([x - 1, y]);
  if (x < size - 1) neighbors.push([x + 1, y]);
  if (y > 0) neighbors.push([x, y - 1]);
  if (y < size - 1) neighbors.push([x, y + 1]);
  return neighbors;
}

function makeMove(board, size, x, y, player) {
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = player;

  const opponent = player === 1 ? 2 : 1;
  const neighbors = getNeighbors(x, y, size);

  for (const [nx, ny] of neighbors) {
    if (newBoard[ny][nx] === opponent) {
      const group = getGroup(newBoard, size, nx, ny);
      if (countLiberties(newBoard, size, group) === 0) {
        for (const [gx, gy] of group) {
          newBoard[gy][gx] = 0;
        }
      }
    }
  }

  return newBoard;
}

function getGroup(board, size, x, y) {
  const color = board[y][x];
  const group = [];
  const visited = new Set();
  const stack = [[x, y]];

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const key = `${cx},${cy}`;

    if (visited.has(key)) continue;
    if (cx < 0 || cx >= size || cy < 0 || cy >= size) continue;
    if (board[cy][cx] !== color) continue;

    visited.add(key);
    group.push([cx, cy]);

    stack.push(...getNeighbors(cx, cy, size));
  }

  return group;
}

function countLiberties(board, size, group) {
  const liberties = new Set();

  for (const [x, y] of group) {
    for (const [nx, ny] of getNeighbors(x, y, size)) {
      if (board[ny][nx] === 0) {
        liberties.add(`${nx},${ny}`);
      }
    }
  }

  return liberties.size;
}

function minimax(board, size, depth, isMaximizing, originalPlayer) {
  if (depth === 0) {
    return evaluateSimple(board, size, originalPlayer);
  }

  const player = isMaximizing ? originalPlayer : (originalPlayer === 1 ? 2 : 1);
  const candidates = getCandidateMoves(board, size, player);

  if (candidates.length === 0) return evaluateSimple(board, size, originalPlayer);

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of candidates.slice(0, 10)) {
    const newBoard = makeMove(board, size, move.x, move.y, player);
    const score = minimax(newBoard, size, depth - 1, !isMaximizing, originalPlayer);

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
    } else {
      bestScore = Math.min(bestScore, score);
    }
  }

  return bestScore;
}

function evaluateSimple(board, size, player) {
  let score = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const color = board[y][x];
      if (color === player) {
        score += 1;
        score += countLiberties(board, size, [[x, y]]) * 0.5;
      } else if (color !== 0) {
        score -= 1;
        score -= countLiberties(board, size, [[x, y]]) * 0.5;
      }
    }
  }

  return score;
}

function calculateScore(board, size, blackStones, whiteStones) {
  let blackTerritory = 0;
  let whiteTerritory = 0;

  const visited = new Set();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0 || visited.has(`${x},${y}`)) continue;

      const result = floodFill(board, size, x, y, visited);
      if (result.touchesBlack && !result.touchesWhite) {
        blackTerritory += result.size;
      } else if (result.touchesWhite && !result.touchesBlack) {
        whiteTerritory += result.size;
      }
    }
  }

  return {
    blackTerritory,
    whiteTerritory,
    blackTotal: blackStones + blackTerritory,
    whiteTotal: whiteStones + whiteTerritory + 6.5
  };
}

function floodFill(board, size, startX, startY, visited) {
  const stack = [[startX, startY]];
  const territory = [];
  let touchesBlack = false;
  let touchesWhite = false;

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    if (x < 0 || x >= size || y < 0 || y >= size) continue;

    if (board[y][x] === 1) {
      touchesBlack = true;
      continue;
    }
    if (board[y][x] === 2) {
      touchesWhite = true;
      continue;
    }

    visited.add(key);
    territory.push([x, y]);
    stack.push(...getNeighbors(x, y, size));
  }

  return {
    size: territory.length,
    touchesBlack,
    touchesWhite
  };
}

function checkEye(board, size, x, y, color) {
  const neighbors = getNeighbors(x, y, size);
  const innerNeighbors = neighbors.filter(n => board[n[1]][n[0]] === color);

  if (innerNeighbors.length < 2) return false;

  let allSameColor = true;
  for (const [nx, ny] of innerNeighbors) {
    if (board[ny][nx] !== color) {
      allSameColor = false;
      break;
    }
  }

  return allSameColor;
}
