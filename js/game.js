// 围棋游戏引擎
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
    if (!this.turnStartTime) return 0;
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
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
    if (checkBoard[y][x] !== 0) return false;
    if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) return false;

    const tempBoard = checkBoard.map(row => [...row]);
    tempBoard[y][x] = player;

    const opponent = player === 1 ? 2 : 1;
    const captured = this.findCapturedStones(opponent, tempBoard);

    if (captured.length > 0) return true;

    const friendlyGroup = this.getGroup(x, y, tempBoard);
    if (this.countLiberties(friendlyGroup, tempBoard) > 0) return true;

    return false;
  }

  getGroup(x, y, board = this.board) {
    const color = board[y][x];
    if (color === 0) return [];

    const group = [];
    const visited = new Set();
    const queue = [[x, y]];

    while (queue.length > 0) {
      const [cx, cy] = queue.shift();
      const key = `${cx},${cy}`;

      if (visited.has(key)) continue;
      if (board[cy][cx] !== color) continue;

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

  findCapturedStones(player, board = this.board) {
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

  play(x, y, comment = '') {
    if (this.isGameOver || this.isReviewMode) return { success: false, message: '游戏已结束或正在复盘中' };

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
    const captured = this.findCapturedStones(opponent, tempBoard);

    captured.forEach(([cx, cy]) => {
      tempBoard[cy][cx] = 0;
    });

    this.board = tempBoard;
    this.moveHistory.push({
      x, y,
      player: this.currentPlayer,
      captured: captured.map(([cx, cy]) => ({ x: cx, y: cy })),
      koPoint: this.koPoint ? { ...this.koPoint } : null,
      comment: comment,
      playerName: this.getCurrentPlayerName()
    });

    if (captured.length === 1) {
      const capturedStone = captured[0];
      const capturedGroup = this.getGroup(capturedStone[0], capturedStone[1], this.board);
      if (capturedGroup.length === 1 && this.countLiberties([capturedStone], this.board) === 0) {
        const newGroup = this.getGroup(x, y, this.board);
        if (newGroup.length === 1 && this.countLiberties(newGroup, this.board) === 1) {
          this.koPoint = { x: capturedStone[0], y: capturedStone[1] };
        } else {
          this.koPoint = null;
        }
      } else {
        this.koPoint = null;
      }
    } else {
      this.koPoint = null;
    }

    this.currentPlayer = opponent;
    this.passCount = 0;

    return { success: true, captured, moveIndex: this.moveHistory.length - 1 };
  }

  addComment(moveIndex, comment) {
    if (moveIndex >= 0 && moveIndex < this.moveHistory.length) {
      this.moveHistory[moveIndex].comment = comment;
      this.moveHistory[moveIndex].playerName = this.getCurrentPlayerName();
    }
  }

  pass() {
    if (this.isGameOver || this.isReviewMode) return { success: false };

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
    if (this.moveHistory.length === 0 || this.isReviewMode) return false;

    const lastMove = this.moveHistory.pop();

    if (lastMove.pass) {
      this.passCount = Math.max(0, this.passCount - 1);
    } else {
      this.board[lastMove.y][lastMove.x] = 0;

      for (const stone of lastMove.captured) {
        this.board[stone.y][stone.x] = lastMove.player === 1 ? 2 : 1;
      }

      this.koPoint = lastMove.koPoint;
    }

    this.currentPlayer = lastMove.player;
    this.isGameOver = false;
    this.turnStartTime = Date.now();

    return true;
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
        // 吃子处理：移除被吃掉的棋子
        if (move.captured && move.captured.length > 0) {
          for (const stone of move.captured) {
            tempBoard[stone.y][stone.x] = 0;
          }
        }
      }
    }

    return tempBoard;
  }
}
