/*
 * 本地 AI 引擎
 * 基于简单策略的围棋 AI，支持不同难度等级
 */

class LocalAI {
  static DIFFICULTY_EASY = 1;
  static DIFFICULTY_MEDIUM = 2;
  static DIFFICULTY_HARD = 3;

  constructor(difficulty = LocalAI.DIFFICULTY_MEDIUM) {
    this.difficulty = difficulty;
    this.patterns = this.loadPatterns();
  }

  loadPatterns() {
    return {
      eyeSpace: [
        { pattern: ['_x_', 'xxx', '_x_'], type: 'eye' },
      ],
      capture: [
        { pattern: ['xo', 'xx'], type: 'capture' },
      ]
    };
  }

  getMove(board, boardSize, player, gameEngine) {
    switch (this.difficulty) {
      case LocalAI.DIFFICULTY_EASY:
        return this.getEasyMove(board, boardSize, player, gameEngine);
      case LocalAI.DIFFICULTY_MEDIUM:
        return this.getMediumMove(board, boardSize, player, gameEngine);
      case LocalAI.DIFFICULTY_HARD:
        return this.getHardMove(board, boardSize, player, gameEngine);
      default:
        return this.getEasyMove(board, boardSize, player, gameEngine);
    }
  }

  getEasyMove(board, boardSize, player, gameEngine) {
    const moves = this.getValidMoves(board, boardSize, player, gameEngine);
    if (moves.length === 0) return { pass: true };

    const randomMoves = [];
    const center = Math.floor(boardSize / 2);

    for (const move of moves) {
      const dist = Math.abs(move.x - center) + Math.abs(move.y - center);
      if (dist <= Math.floor(boardSize / 2) + 1) {
        randomMoves.push(move);
      }
    }

    const candidates = randomMoves.length > 0 ? randomMoves : moves;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  getMediumMove(board, boardSize, player, gameEngine) {
    const moves = this.getValidMoves(board, boardSize, player, gameEngine);
    if (moves.length === 0) return { pass: true };

    const scoredMoves = [];
    const opponent = player === 1 ? 2 : 1;

    for (const move of moves) {
      let score = 0;

      if (this.wouldCapture(board, boardSize, move.x, move.y, opponent, gameEngine)) {
        score += 100;
      }

      if (this.isAtari(board, boardSize, player, move.x, move.y, gameEngine)) {
        score += 80;
      }

      score += this.getTerritoryScore(move.x, move.y, boardSize, player);

      if (this.isOnThirdLine(move.x, move.y, boardSize)) {
        score += 15;
      }
      if (this.isOnFourthLine(move.x, move.y, boardSize)) {
        score += 10;
      }

      if (this.isNearGroup(board, boardSize, move.x, move.y, player)) {
        score += 20;
      }

      scoredMoves.push({ move, score });
    }

    scoredMoves.sort((a, b) => b.score - a.score);
    const topCandidates = scoredMoves.slice(0, Math.max(3, Math.floor(scoredMoves.length * 0.3)));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)].move;
  }

  getHardMove(board, boardSize, player, gameEngine) {
    const moves = this.getValidMoves(board, boardSize, player, gameEngine);
    if (moves.length === 0) return { pass: true };

    const scoredMoves = [];
    const opponent = player === 1 ? 2 : 1;

    for (const move of moves) {
      let score = 0;

      if (this.wouldCapture(board, boardSize, move.x, move.y, opponent, gameEngine)) {
        score += 200;
      }

      if (this.isAtari(board, boardSize, player, move.x, move.y, gameEngine)) {
        score += 150;
      }

      const copyBoard = this.copyBoard(board);
      copyBoard[move.y][move.x] = player;
      const libertiesAfter = this.countLiberties(copyBoard, boardSize, move.x, move.y);
      if (libertiesAfter === 1) score -= 50;
      if (libertiesAfter >= 3) score += 40;

      score += this.getTerritoryScore(move.x, move.y, boardSize, player) * 1.5;

      if (this.isCorner(move.x, move.y, boardSize)) score += 30;
      if (this.isOnThirdLine(move.x, move.y, boardSize)) score += 25;
      if (this.isOnFourthLine(move.x, move.y, boardSize)) score += 20;

      if (this.isNearGroup(board, boardSize, move.x, move.y, player)) {
        score += 30;
      }

      if (this.preventsEyeShape(board, boardSize, move.x, move.y, opponent)) {
        score += 60;
      }

      scoredMoves.push({ move, score });
    }

    scoredMoves.sort((a, b) => b.score - a.score);
    const topCandidates = scoredMoves.slice(0, Math.max(2, Math.floor(scoredMoves.length * 0.15)));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)].move;
  }

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

  wouldCapture(board, boardSize, x, y, opponent, gameEngine) {
    const testBoard = this.copyBoard(board);
    testBoard[y][x] = opponent === 1 ? 2 : 1;

    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === opponent) {
        const group = this.getGroup(testBoard, boardSize, nx, ny);
        if (group.liberties === 0) {
          return true;
        }
      }
    }
    return false;
  }

  isAtari(board, boardSize, player, x, y, gameEngine) {
    const testBoard = this.copyBoard(board);
    testBoard[y][x] = player;
    const group = this.getGroup(testBoard, boardSize, x, y);
    return group.liberties === 1;
  }

  countLiberties(board, boardSize, x, y) {
    const group = this.getGroup(board, boardSize, x, y);
    return group.liberties;
  }

  getTerritoryScore(x, y, boardSize, player) {
    const center = Math.floor(boardSize / 2);
    const maxDist = center;
    const dist = Math.abs(x - center) + Math.abs(y - center);
    const centerBonus = Math.max(0, (maxDist - dist) / maxDist * 20);
    return centerBonus;
  }

  isCorner(x, y, boardSize) {
    return (x < 4 && y < 4) ||
           (x < 4 && y >= boardSize - 4) ||
           (x >= boardSize - 4 && y < 4) ||
           (x >= boardSize - 4 && y >= boardSize - 4);
  }

  isOnThirdLine(x, y, boardSize) {
    return x === 2 || y === 2 || x === boardSize - 3 || y === boardSize - 3;
  }

  isOnFourthLine(x, y, boardSize) {
    return x === 3 || y === 3 || x === boardSize - 4 || y === boardSize - 4;
  }

  isNearGroup(board, boardSize, x, y, player) {
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === player) {
        return true;
      }
    }
    return false;
  }

  preventsEyeShape(board, boardSize, x, y, opponent) {
    return false;
  }

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

      const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const nx = cx + dx;
        const ny = cy + dy;

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

  copyBoard(board) {
    return board.map(row => [...row]);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalAI;
}
