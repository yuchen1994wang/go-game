const app = getApp();

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
    this.board = [];
    for (let i = 0; i < this.size; i++) {
      this.board.push(new Array(this.size).fill(0));
    }
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

  getCurrentPlayerName() {
    return this.currentPlayer === 1 ? (this.blackPlayer || '黑方') : (this.whitePlayer || '白方');
  }

  coordToString(x, y) {
    const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
    return letters[x] + (this.size - y);
  }

  isValidMove(x, y, player = this.currentPlayer) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
    if (this.board[y][x] !== 0) return false;
    if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) return false;

    const tempBoard = this.board.map(row => [...row]);
    tempBoard[y][x] = player;

    const opponent = player === 1 ? 2 : 1;
    const captured = this.findCapturedStones(opponent, tempBoard);

    if (captured.length > 0) return true;

    const friendlyGroup = this.getGroup(x, y, tempBoard);
    if (this.countLiberties(friendlyGroup, tempBoard) > 0) return true;

    return false;
  }

  getGroup(x, y, board) {
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

      const neighbors = [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]];
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

  countLiberties(group, board) {
    const liberties = new Set();
    for (const [x, y] of group) {
      const neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
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

  findCapturedStones(player, board) {
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
    if (this.isGameOver || this.isReviewMode) {
      return { success: false, message: '游戏已结束或正在复盘中' };
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
    const captured = this.findCapturedStones(opponent, tempBoard);

    captured.forEach(([cx, cy]) => {
      tempBoard[cy][cx] = 0;
    });

    this.board = tempBoard;
    this.moveHistory.push({
      x, y,
      player: this.currentPlayer,
      coord: this.coordToString(x, y),
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

    return { success: true, captured };
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
      coord: 'Pass',
      comment: '',
      playerName: this.getCurrentPlayerName()
    });
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.koPoint = null;

    return { success: true, gameOver: false };
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

    this.currentPlayer = lastMove.pass ? lastMove.player : (lastMove.player === 1 ? 2 : 1);
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
      }
    }

    return tempBoard;
  }
}

Page({
  data: {
    boardSize: 350,
    cellSize: 0,
    padding: 25,
    size: 13,
    game: null,
    boardData: [],
    blackPlayer: '',
    whitePlayer: '',
    currentPlayer: 1,
    currentTurnText: '黑方',
    mode: 'play',
    moveHistory: [],
    reviewStep: 0,
    currentReviewMove: null,
    currentComment: '',
    showExportModal: false,
    exportSGF: '',
    toast: null,
    touchPos: null,
    blackTimer: '00:00',
    whiteTimer: '00:00',
    blackTotalTime: '00:00',
    whiteTotalTime: '00:00'
  },

  timerInterval: null,

  onLoad(options) {
    const size = parseInt(options.size) || 13;
    this.setData({ size });

    const game = new GoGame(size);
    this.setData({ game });

    this.calculateBoardSize();
    this.initBoard();
    this.startTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  updateTimerDisplay() {
    const { game } = this.data;
    let blackTotal = game.blackTime;
    let whiteTotal = game.whiteTime;

    if (!game.isGameOver && !game.isReviewMode) {
      const elapsed = game.getCurrentElapsed();
      if (game.currentPlayer === 1) {
        blackTotal += elapsed;
      } else {
        whiteTotal += elapsed;
      }
    }

    this.setData({
      blackTimer: game.getFormattedTime(blackTotal),
      whiteTimer: game.getFormattedTime(whiteTotal),
      blackTotalTime: game.getFormattedTime(game.blackTime),
      whiteTotalTime: game.getFormattedTime(game.whiteTime)
    });
  },

  onEndGame() {
    const result = this.data.game.endGame();
    if (result.success) {
      this.updateUI();
      this.showToast('游戏已结束', 'success');
    }
  },

  calculateBoardSize() {
    const screenWidth = wx.getSystemInfoSync().windowWidth;
    const boardWidth = screenWidth - 60;
    this.setData({ boardSize: boardWidth });
  },

  initBoard() {
    const { size } = this.data;
    const boardData = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push(0);
      }
      boardData.push(row);
    }
    this.setData({ boardData, moveHistory: [] });
    this.drawBoard();
  },

  drawBoard(reviewStep = -1) {
    const { size, boardSize, padding } = this.data;
    const cellSize = (boardSize - padding * 2) / (size - 1);

    const ctx = wx.createCanvasContext('goBoard');
    const dpr = wx.getSystemInfoSync().pixelRatio;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, boardSize, boardSize);

    ctx.strokeStyle = '#2C1810';
    ctx.lineWidth = 1;

    for (let i = 0; i < size; i++) {
      const pos = padding + i * cellSize;

      ctx.beginPath();
      ctx.moveTo(padding, pos);
      ctx.lineTo(boardSize - padding, pos);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pos, padding);
      ctx.lineTo(pos, boardSize - padding);
      ctx.stroke();
    }

    const starPoints = this.getStarPoints(size);
    ctx.fillStyle = '#2C1810';
    for (const [x, y] of starPoints) {
      ctx.beginPath();
      ctx.arc(padding + x * cellSize, padding + y * cellSize, size === 9 ? 4 : 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    let displayBoard;
    if (this.data.mode === 'review' && reviewStep >= 0) {
      displayBoard = this.data.game.getBoardForReview(reviewStep);
    } else {
      displayBoard = this.data.boardData;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (displayBoard[y][x] !== 0) {
          const cx = padding + x * cellSize;
          const cy = padding + y * cellSize;
          const radius = cellSize * 0.45;

          if (displayBoard[y][x] === 1) {
            const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
            gradient.addColorStop(0, '#4a4a4a');
            gradient.addColorStop(1, '#1a1a1a');
            ctx.setFillStyle(gradient);
          } else {
            const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#f5f5f5');
            ctx.setFillStyle(gradient);
          }

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
          ctx.fill();

          if (displayBoard[y][x] === 2) {
            ctx.strokeStyle = '#d0d0d0';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    const displayStep = this.data.mode === 'review' ? reviewStep : this.data.moveHistory.length;
    if (displayStep > 0) {
      const lastMove = this.data.moveHistory[displayStep - 1];
      if (lastMove && !lastMove.pass) {
        const lx = padding + lastMove.x * cellSize;
        const ly = padding + lastMove.y * cellSize;
        const radius = cellSize * 0.5;

        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(lx, ly, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    if (this.data.touchPos && this.data.mode === 'play') {
      const tx = padding + this.data.touchPos.x * cellSize;
      const ty = padding + this.data.touchPos.y * cellSize;
      const radius = cellSize * 0.45;

      ctx.globalAlpha = 0.5;
      if (this.data.currentPlayer === 1) {
        ctx.setFillStyle('#1a1a1a');
      } else {
        ctx.setFillStyle('#f5f5f5');
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;
      }
      ctx.beginPath();
      ctx.arc(tx, ty, radius, 0, 2 * Math.PI);
      ctx.fill();
      if (this.data.currentPlayer === 2) {
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    ctx.draw();
  },

  getStarPoints(size) {
    const points = [];
    if (size === 9) {
      points.push([2, 2], [2, 6], [4, 4], [6, 2], [6, 6]);
    } else if (size === 13) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          points.push([3 + i * 3.5, 3 + j * 3.5]);
        }
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          points.push([3 + i * 6, 3 + j * 6]);
        }
      }
    }
    return points;
  },

  onBoardTap(e) {
    if (this.data.mode !== 'play') return;

    const { boardSize, padding, size } = this.data;
    const cellSize = (boardSize - padding * 2) / (size - 1);

    const rect = e.targetBoundingClientRect ? e.targetBoundingClientRect() : { left: 0, top: 0 };
    const x = e.detail.x - rect.left;
    const y = e.detail.y - rect.top;

    const gridX = Math.round((x - padding) / cellSize);
    const gridY = Math.round((y - padding) / cellSize);

    if (gridX >= 0 && gridX < size && gridY >= 0 && gridY < size) {
      this.handleMove(gridX, gridY);
    }
  },

  onTouchStart(e) {
    if (this.data.mode !== 'play') return;

    const touch = e.touches[0];
    const pos = this.getGridPosition(touch);
    if (pos) {
      this.setData({ touchPos: pos });
      this.drawBoard();
    }
  },

  onTouchMove(e) {
    if (this.data.mode !== 'play') return;

    const touch = e.touches[0];
    const pos = this.getGridPosition(touch);
    if (pos) {
      this.setData({ touchPos: pos });
      this.drawBoard();
    }
  },

  onTouchEnd() {
    if (this.data.mode !== 'play') return;

    const { touchPos } = this.data;
    if (touchPos) {
      this.handleMove(touchPos.x, touchPos.y);
      this.setData({ touchPos: null });
      this.drawBoard();
    }
  },

  getGridPosition(touch) {
    const query = wx.createSelectorQuery();
    return new Promise((resolve) => {
      query.select('.board-canvas').boundingClientRect((rect) => {
        if (!rect) {
          resolve(null);
          return;
        }

        const { boardSize, padding, size } = this.data;
        const cellSize = (boardSize - padding * 2) / (size - 1);

        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const gridX = Math.round((x - padding) / cellSize);
        const gridY = Math.round((y - padding) / cellSize);

        if (gridX >= 0 && gridX < size && gridY >= 0 && gridY < size) {
          resolve({ x: gridX, y: gridY });
        } else {
          resolve(null);
        }
      }).exec();
    });
  },

  handleMove(x, y) {
    const { currentComment } = this.data;
    const result = this.data.game.play(x, y, currentComment);

    if (result.success) {
      const boardData = this.data.game.board.map(row => [...row]);
      this.setData({
        boardData,
        currentComment: ''
      });
      this.updateUI();
      this.drawBoard();
      this.showToast('落子成功', 'success');
    } else {
      this.showToast(result.message, 'warning');
    }
  },

  onBlackNameInput(e) {
    this.setData({ blackPlayer: e.detail.value });
    this.data.game.blackPlayer = e.detail.value;
    this.updateTurnText();
  },

  onWhiteNameInput(e) {
    this.setData({ whitePlayer: e.detail.value });
    this.data.game.whitePlayer = e.detail.value;
    this.updateTurnText();
  },

  updateTurnText() {
    const player = this.data.game.currentPlayer;
    const name = player === 1 ? (this.data.blackPlayer || '黑方') : (this.data.whitePlayer || '白方');
    this.setData({
      currentTurnText: name,
      currentPlayer: player
    });
  },

  updateUI() {
    const player = this.data.game.currentPlayer;
    const name = player === 1 ? (this.data.blackPlayer || '黑方') : (this.data.whitePlayer || '白方');

    this.setData({
      currentTurnText: this.data.game.isGameOver ? '对局结束' : name,
      currentPlayer: player,
      moveHistory: [...this.data.game.moveHistory]
    });

    if (this.data.game.isReviewMode) {
      this.setData({
        currentTurnText: `复盘中 (${this.data.game.reviewStep}/${this.data.game.moveHistory.length})`
      });
    }

    this.updateTimerDisplay();
  },

  onUndo() {
    if (this.data.game.undo()) {
      const boardData = this.data.game.board.map(row => [...row]);
      this.setData({
        boardData,
        moveHistory: [...this.data.game.moveHistory]
      });
      this.updateUI();
      this.drawBoard();
    }
  },

  onNewGame() {
    this.data.game.blackPlayer = this.data.blackPlayer;
    this.data.game.whitePlayer = this.data.whitePlayer;
    this.data.game.init();
    this.initBoard();
    this.updateUI();
    this.showToast('新对局开始', 'success');
  },

  onPass() {
    const result = this.data.game.pass();
    if (result.success) {
      this.updateUI();
      if (result.gameOver) {
        this.showToast('对局结束', 'success');
      } else {
        this.showToast('停一手', 'info');
      }
    }
  },

  onAddComment() {
    const { currentComment, moveHistory } = this.data;
    if (!currentComment.trim()) return;

    if (moveHistory.length === 0) {
      this.showToast('请先落子', 'warning');
      return;
    }

    this.data.game.addComment(moveHistory.length - 1, currentComment.trim());
    this.setData({
      moveHistory: [...this.data.game.moveHistory],
      currentComment: ''
    });
    this.showToast('点评已添加', 'success');
  },

  onCommentInput(e) {
    this.setData({ currentComment: e.detail.value });
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ mode });

    if (mode === 'review') {
      this.data.game.isReviewMode = true;
      this.data.game.reviewStep = this.data.moveHistory.length;
      this.updateReviewDisplay();
    } else {
      this.data.game.isReviewMode = false;
      this.drawBoard();
    }
    
    this.updateUI();
  },

  updateReviewDisplay() {
    const step = this.data.game.reviewStep;
    this.setData({ 
      reviewStep: step,
      blackTotalTime: this.data.game.getFormattedTime(this.data.game.blackTime),
      whiteTotalTime: this.data.game.getFormattedTime(this.data.game.whiteTime)
    });

    if (step > 0) {
      const currentMove = this.data.moveHistory[step - 1];
      this.setData({ currentReviewMove: currentMove });
    } else {
      this.setData({ currentReviewMove: null });
    }

    this.drawBoard(step);
  },

  onReviewFirst() {
    this.data.game.reviewStep = 0;
    this.updateReviewDisplay();
  },

  onReviewPrev() {
    if (this.data.game.reviewStep > 0) {
      this.data.game.reviewStep--;
      this.updateReviewDisplay();
    }
  },

  onReviewNext() {
    if (this.data.game.reviewStep < this.data.moveHistory.length) {
      this.data.game.reviewStep++;
      this.updateReviewDisplay();
    }
  },

  onReviewLast() {
    this.data.game.reviewStep = this.data.moveHistory.length;
    this.updateReviewDisplay();
  },

  onMoveItemTap(e) {
    const index = e.currentTarget.dataset.index;
    if (this.data.mode === 'review') {
      this.data.game.reviewStep = index + 1;
      this.updateReviewDisplay();
    }
  },

  onExport() {
    const sgf = this.data.game.toSGF();
    this.setData({
      showExportModal: true,
      exportSGF: sgf
    });
  },

  onCloseExport() {
    this.setData({ showExportModal: false });
  },

  onCopySGF() {
    wx.setClipboardData({
      data: this.data.exportSGF,
      success: () => {
        this.showToast('棋谱已复制', 'success');
      }
    });
  },

  showToast(message, type = 'info') {
    this.setData({ toast: { message, type } });
    setTimeout(() => {
      this.setData({ toast: null });
    }, 2000);
  }
});
