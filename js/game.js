// 围棋游戏引擎

// 加载公共工具模块（浏览器环境和Node.js环境都兼容）
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

class GoGame {
  constructor(size = 13) {
    this.size = size;
    this.board = [];
    this.currentPlayer = 1;
    this.moveHistory = [];
    this.koPoint = null;
    this.isGameOver = false;
    this.isReviewMode = false;
    this.reviewStep = 0;
    this.passCount = 0;
    this.blackPlayer = '';
    this.whitePlayer = '';
    this.blackTime = 0;
    this.whiteTime = 0;
    this.turnStartTime = null;
    this.init();
  }

  init() {
    this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.currentPlayer = 1;
    this.moveHistory = [];
    this.koPoint = null;
    this.isGameOver = false;
    this.isReviewMode = false;
    this.reviewStep = 0;
    this.passCount = 0;
    this.blackTime = 0;
    this.whiteTime = 0;
    this.turnStartTime = Date.now();
    this.timerInterval = null;
    this.timeLimit = 0;
    this.byoyomiMoves = 0;
    this.byoyomiTime = 0;
    this.isPaused = false;
    this.timerCallback = null;
  }

  reset(size) {
    this.size = size;
    this.init();
  }

  endGame() {
    if (!this.isGameOver) {
      this.saveTurnTime();
      this.isGameOver = true;
    }
    return { success: true };
  }

  saveTurnTime() {
    if (this.turnStartTime) {
      const elapsed = Math.floor((Date.now() - this.turnStartTime) / 1000);
      if (this.currentPlayer === 1) {
        this.blackTime += elapsed;
      } else {
        this.whiteTime += elapsed;
      }
      this.turnStartTime = Date.now();
    }
  }

  getCurrentElapsed() {
    if (!this.turnStartTime) {return 0;}
    return Math.floor((Date.now() - this.turnStartTime) / 1000);
  }

  getFormattedTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  setPlayerNames(black, white) {
    this.blackPlayer = black || '黑方';
    this.whitePlayer = white || '白方';
  }

  getCurrentPlayerName() {
    return this.currentPlayer === 1 ? this.blackPlayer : this.whitePlayer;
  }

  isValidMove(x, y, player = this.currentPlayer, checkBoard = this.board) {
    if (!GoUtils.isValidPosition(x, y, this.size)) {return false;}
    if (checkBoard[y][x] !== 0) {return false;}
    if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) {return false;}

    const tempBoard = checkBoard.map(row => [...row]);
    tempBoard[y][x] = player;

    const opponent = player === 1 ? 2 : 1;
    // isValidMove 需要确保检查所有可能的被吃情况
    const captured = this.findAllCapturedStones(opponent, tempBoard);

    if (captured.length > 0) {return true;}

    const friendlyGroup = this.getGroup(x, y, tempBoard);
    if (this.countLiberties(friendlyGroup, tempBoard) > 0) {return true;}

    return false;
  }

  getGroup(x, y, board = this.board) {
    const color = board[y][x];
    if (color === 0) {return [];}

    const group = [];
    const visited = new Set();
    const queue = [[x, y]];

    while (queue.length > 0) {
      const [cx, cy] = queue.shift();
      const key = `${cx},${cy}`;

      if (visited.has(key)) {continue;}
      if (board[cy][cx] !== color) {continue;}

      visited.add(key);
      group.push([cx, cy]);

      const neighbors = [
        [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          const nkey = `${nx},${ny}`;
          if (!visited.has(nkey)) {
            queue.push([nx, ny]);
          }
        }
      }
    }

    return group;
  }

  countLiberties(group, board = this.board) {
    const liberties = new Set();

    for (const [x, y] of group) {
      const neighbors = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          if (board[ny][nx] === 0) {
            liberties.add(`${nx},${ny}`);
          }
        }
      }
    }

    return liberties.size;
  }

  /**
   * 查找所有被吃的棋子
   * 优化：只检查新落子位置周围的对手棋子，避免遍历整个棋盘
   * @param {number} newX - 新落子的横坐标
   * @param {number} newY - 新落子的纵坐标
   * @param {number} opponent - 对手棋子
   * @param {Array<Array<number>>} board - 棋盘
   * @returns {Array<Array<number>>} 被吃的棋子数组
   */
  findCapturedStones(newX, newY, opponent, board = this.board) {
    const captured = [];
    const checked = new Set();
    const neighborsToCheck = GoUtils.getNeighbors(newX, newY, this.size);
    
    // 只检查新落子周围的对手棋子组
    for (const [nx, ny] of neighborsToCheck) {
      const key = `${nx},${ny}`;
      if (board[ny][nx] === opponent && !checked.has(key)) {
        const group = this.getGroup(nx, ny, board);
        group.forEach(([gx, gy]) => checked.add(`${gx},${gy}`));

        if (this.countLiberties(group, board) === 0) {
          captured.push(...group);
        }
      }
    }
    
    return captured;
  }

  /**
   * 查找整个棋盘上的所有被吃棋子（用于兼容性）
   * @param {number} player - 玩家棋子
   * @param {Array<Array<number>>} board - 棋盘
   * @returns {Array<Array<number>>} 被吃的棋子数组
   */
  findAllCapturedStones(player, board = this.board) {
    const captured = [];
    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (board[y][x] === player) {
          const key = `${x},${y}`;
          if (!checked.has(key)) {
            const group = this.getGroup(x, y, board);
            group.forEach(([gx, gy]) => checked.add(`${gx},${gy}`));

            if (this.countLiberties(group, board) === 0) {
              captured.push(...group);
            }
          }
        }
      }
    }

    return captured;
  }

  makeMove(x, y, comment = '') {
    if (this.isGameOver || this.isReviewMode) {return { success: false, message: '游戏已结束或正在复盘中' };}

    if (!GoUtils.isValidPosition(x, y, this.size)) {
      return { success: false, message: '棋盘外' };
    }

    if (!this.isValidMove(x, y)) {
      if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) {
        return { success: false, message: '打劫禁着' };
      }
      if (this.board[y][x] !== 0) {
        return { success: false, message: '此处已有棋子' };
      }
      return { success: false, message: '禁着点' };
    }

    this.saveTurnTime();

    const tempBoard = this.board.map(row => [...row]);
    tempBoard[y][x] = this.currentPlayer;

    const opponent = this.currentPlayer === 1 ? 2 : 1;
    // 优化：只查找新落子周围的被吃棋子
    const captured = this.findCapturedStones(x, y, opponent, tempBoard);

    captured.forEach(([cx, cy]) => {
      tempBoard[cy][cx] = 0;
    });

    this.board = tempBoard;
    this.moveHistory.push({
      x, y,
      player: this.currentPlayer,
      captures: captured.map(([cx, cy]) => ({ x: cx, y: cy })),
      koPoint: this.koPoint ? { ...this.koPoint } : null,
      comment: comment,
      playerName: this.getCurrentPlayerName()
    });

    if (captured.length === 1) {
      const capturedStone = captured[0];
      const newGroup = this.getGroup(x, y, this.board);
      if (newGroup.length === 1 && this.countLiberties(newGroup, this.board) === 1) {
        this.koPoint = { x: capturedStone[0], y: capturedStone[1] };
      } else {
        this.koPoint = null;
      }
    } else {
      this.koPoint = null;
    }

    this.currentPlayer = opponent;
    this.passCount = 0;

    return { success: true, captures: captured, moveIndex: this.moveHistory.length - 1 };
  }

  addComment(moveIndex, comment) {
    if (moveIndex >= 0 && moveIndex < this.moveHistory.length) {
      this.moveHistory[moveIndex].comment = comment;
      this.moveHistory[moveIndex].playerName = this.getCurrentPlayerName();
    }
  }

  pass() {
    if (this.isGameOver || this.isReviewMode) {return { success: false };}

    this.saveTurnTime();

    this.passCount++;
    if (this.passCount >= 2) {
      this.isGameOver = true;
      return { success: true, gameOver: true };
    }

    this.moveHistory.push({
      pass: true,
      player: this.currentPlayer,
      comment: '',
      playerName: this.getCurrentPlayerName()
    });
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.koPoint = null;

    return { success: true, gameOver: false, moveIndex: this.moveHistory.length - 1 };
  }

  undo() {
    if (this.moveHistory.length === 0 || this.isReviewMode) {return false;}

    const lastMove = this.moveHistory.pop();

    if (lastMove.pass) {
      this.passCount = Math.max(0, this.passCount - 1);
    } else {
      this.board[lastMove.y][lastMove.x] = 0;

      for (const stone of lastMove.captures) {
        this.board[stone.y][stone.x] = lastMove.player === 1 ? 2 : 1;
      }

      this.koPoint = lastMove.koPoint;
    }

    this.currentPlayer = lastMove.player;
    this.isGameOver = false;
    this.turnStartTime = Date.now();

    return true;
  }

  calculateScore(komi = GoUtils.DEFAULT_KOMI) {
    // 简化的数棋算法：计算双方领地
    const visited = new Set();
    let blackTerritory = 0;
    let whiteTerritory = 0;
    let blackStones = 0;
    let whiteStones = 0;

    // 计算棋子数和领地
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === GoUtils.BLACK) {
          blackStones++;
        } else if (this.board[y][x] === GoUtils.WHITE) {
          whiteStones++;
        } else {
          // 空点，判断属于哪方领地
          const key = GoUtils.posKey(x, y);
          if (!visited.has(key)) {
            const area = this.getEmptyArea(x, y);
            area.forEach(([ax, ay]) => visited.add(GoUtils.posKey(ax, ay)));
            
            const surroundedBy = this.getSurroundingColors(area);
            if (surroundedBy.has(GoUtils.BLACK) && !surroundedBy.has(GoUtils.WHITE)) {
              blackTerritory += area.length;
            } else if (surroundedBy.has(GoUtils.WHITE) && !surroundedBy.has(GoUtils.BLACK)) {
              whiteTerritory += area.length;
            }
          }
        }
      }
    }

    const blackScore = blackStones + blackTerritory;
    const whiteScore = whiteStones + whiteTerritory + komi;

    let winner, margin;
    if (blackScore > whiteScore) {
      winner = 'black';
      margin = blackScore - whiteScore;
    } else if (whiteScore > blackScore) {
      winner = 'white';
      margin = whiteScore - blackScore;
    } else {
      winner = 'draw';
      margin = 0;
    }

    return {
      black: blackScore,
      white: whiteScore,
      winner,
      margin
    };
  }

  getEmptyArea(startX, startY) {
    const area = [];
    const visited = new Set();
    const queue = [[startX, startY]];

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const key = `${x},${y}`;

      if (visited.has(key)) {continue;}
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) {continue;}
      if (this.board[y][x] !== 0) {continue;}

      visited.add(key);
      area.push([x, y]);

      queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
    }

    return area;
  }

  getSurroundingColors(area) {
    const colors = new Set();
    for (const [x, y] of area) {
      const neighbors = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          if (this.board[ny][nx] !== 0) {
            colors.add(this.board[ny][nx]);
          }
        }
      }
    }
    return colors;
  }

  toSGF() {
    let sgf = `(;FF[4]GM[1]SZ[${this.size}]`;
    sgf += `PB[${this.blackPlayer}]PW[${this.whitePlayer}]`;

    for (const move of this.moveHistory) {
      if (move.pass) {
        sgf += `;${move.player === 1 ? 'B' : 'W'}[]`;
      } else {
        const x = String.fromCharCode(97 + move.x);
        const y = String.fromCharCode(97 + move.y);
        const player = move.player === 1 ? 'B' : 'W';
        sgf += `;${player}[${x}${y}]`;
      }
      if (move.comment) {
        sgf += `C[${move.comment}]`;
      }
    }

    sgf += ')';
    return sgf;
  }

  getBoardForReview(step) {
    const tempBoard = [];
    for (let i = 0; i < this.size; i++) {
      tempBoard.push(new Array(this.size).fill(0));
    }

    for (let i = 0; i < step && i < this.moveHistory.length; i++) {
      const move = this.moveHistory[i];
      if (!move.pass) {
        tempBoard[move.y][move.x] = move.player;
        if (move.captures && move.captures.length > 0) {
          for (const stone of move.captures) {
            tempBoard[stone.y][stone.x] = 0;
          }
        }
      }
    }

    return tempBoard;
  }

  startTimer(config = {}) {
    const { timeLimit = 0, byoyomiMoves = 0, byoyomiTime = 0, onTick = null } = config;
    
    this.timeLimit = timeLimit;
    this.byoyomiMoves = byoyomiMoves;
    this.byoyomiTime = byoyomiTime;
    this.timerCallback = onTick;
    this.isPaused = false;
    
    if (this.timeLimit > 0) {
      const remainingTime = this.currentPlayer === 1 ? this.timeLimit : this.timeLimit;
      if (this.currentPlayer === 1) {
        this.blackTime = remainingTime;
      } else {
        this.whiteTime = remainingTime;
      }
    }
    
    this.turnStartTime = Date.now();
    this.stopTimer();
    
    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.isGameOver || this.isReviewMode) {return;}
      
      this.updateTimer();
    }, 100);
    
    return true;
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  pauseTimer() {
    this.isPaused = true;
    if (this.turnStartTime) {
      const elapsed = Math.floor((Date.now() - this.turnStartTime) / 1000);
      if (this.currentPlayer === 1) {
        this.blackTime = Math.max(0, this.blackTime - elapsed);
      } else {
        this.whiteTime = Math.max(0, this.whiteTime - elapsed);
      }
    }
  }

  resumeTimer() {
    this.isPaused = false;
    this.turnStartTime = Date.now();
  }

  updateTimer() {
    if (!this.turnStartTime || this.isPaused) {return;}
    
    const elapsed = Math.floor((Date.now() - this.turnStartTime) / 1000);
    const currentTime = this.currentPlayer === 1 ? this.blackTime : this.whiteTime;
    
    if (this.timeLimit > 0) {
      const remainingTime = Math.max(0, currentTime - elapsed);
      
      if (remainingTime === 0 && !this.isInByoyomi()) {
        this.handleTimeout();
        return;
      }
      
      if (this.isInByoyomi() && this.byoyomiTime > 0) {
        const byoyomiElapsed = elapsed % this.byoyomiTime;
        if (byoyomiElapsed === 0 && elapsed > 0) {
          this.handleByoyomiTimeout();
          return;
        }
      }
    }
    
    if (this.timerCallback && typeof this.timerCallback === 'function') {
      this.timerCallback({
        currentPlayer: this.currentPlayer,
        blackTime: this.currentPlayer === 1 ? Math.max(0, currentTime - elapsed) : this.blackTime,
        whiteTime: this.currentPlayer === 2 ? Math.max(0, currentTime - elapsed) : this.whiteTime,
        isByoyomi: this.isInByoyomi(),
        byoyomiMoves: this.byoyomiMoves
      });
    }
  }

  isInByoyomi() {
    const currentTime = this.currentPlayer === 1 ? this.blackTime : this.whiteTime;
    return this.timeLimit > 0 && currentTime === 0 && this.byoyomiMoves > 0;
  }

  handleTimeout() {
    this.stopTimer();
    this.isGameOver = true;
    
    return {
      success: true,
      timeout: true,
      player: this.currentPlayer,
      winner: this.currentPlayer === 1 ? 'white' : 'black',
      message: `${this.currentPlayer === 1 ? '黑方' : '白方'}超时`
    };
  }

  handleByoyomiTimeout() {
    if (this.byoyomiMoves > 0) {
      this.byoyomiMoves--;
      
      if (this.byoyomiMoves === 0) {
        return this.handleTimeout();
      }
      
      return {
        success: true,
        byoyomiWarning: true,
        remainingMoves: this.byoyomiMoves,
        message: `读秒剩余${this.byoyomiMoves}次`
      };
    }
  }

  getTimeSettings() {
    return {
      timeLimit: this.timeLimit,
      byoyomiMoves: this.byoyomiMoves,
      byoyomiTime: this.byoyomiTime,
      blackTime: this.blackTime,
      whiteTime: this.whiteTime,
      isRunning: this.timerInterval !== null && !this.isPaused
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoGame;
}
