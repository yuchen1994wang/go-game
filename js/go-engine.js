// 围棋规则引擎
class GoEngine {
  constructor(size = 19) {
    this.size = size;
    this.board = this.createEmptyBoard();
    this.currentPlayer = 'black';
    this.moveHistory = [];
    this.capturedBlack = 0;
    this.capturedWhite = 0;
  }

  createEmptyBoard() {
    return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
  }

  clone() {
    const engine = new GoEngine(this.size);
    engine.board = this.board.map(row => [...row]);
    engine.currentPlayer = this.currentPlayer;
    engine.moveHistory = [...this.moveHistory];
    engine.capturedBlack = this.capturedBlack;
    engine.capturedWhite = this.capturedWhite;
    return engine;
  }

  isValidMove(x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
    if (this.board[y][x] !== null) return false;
    
    const testBoard = this.clone();
    testBoard.board[y][x] = this.currentPlayer;
    
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    const captured = testBoard.removeCapturedStones(opponent);
    
    if (captured > 0) return true;
    
    const group = testBoard.getGroup(x, y);
    if (group.liberties === 0) return false;
    
    return true;
  }

  play(x, y) {
    if (!this.isValidMove(x, y)) return false;

    this.board[y][x] = this.currentPlayer;
    this.moveHistory.push({ x, y, player: this.currentPlayer });

    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    const captured = this.removeCapturedStones(opponent);

    if (this.currentPlayer === 'black') {
      this.capturedBlack += captured;
    } else {
      this.capturedWhite += captured;
    }

    const suicide = this.checkSuicide();
    if (suicide > 0) {
      if (this.currentPlayer === 'black') {
        this.capturedWhite += suicide;
      } else {
        this.capturedBlack += suicide;
      }
    }

    this.currentPlayer = opponent === 'black' ? 'white' : 'black';
    return true;
  }

  removeCapturedStones(player) {
    let totalCaptured = 0;
    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === player && !checked.has(`${x},${y}`)) {
          const group = this.getGroup(x, y);
          if (group.liberties === 0) {
            group.stones.forEach(([sx, sy]) => {
              this.board[sy][sx] = null;
              totalCaptured++;
            });
          }
          group.stones.forEach(([sx, sy]) => checked.add(`${sx},${sy}`));
        }
      }
    }

    return totalCaptured;
  }

  checkSuicide() {
    let suicideCount = 0;
    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === this.currentPlayer && !checked.has(`${x},${y}`)) {
          const group = this.getGroup(x, y);
          if (group.liberties === 0) {
            suicideCount += group.stones.length;
          }
          group.stones.forEach(([sx, sy]) => checked.add(`${sx},${sy}`));
        }
      }
    }

    return suicideCount;
  }

  getGroup(x, y) {
    const color = this.board[y][x];
    if (color === null) return { stones: [], liberties: 0 };

    const stones = [];
    const liberties = new Set();
    const visited = new Set();
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (this.board[cy][cx] === color) {
        stones.push([cx, cy]);
        const neighbors = this.getNeighbors(cx, cy);
        for (const [nx, ny] of neighbors) {
          if (this.board[ny][nx] === null) {
            liberties.add(`${nx},${ny}`);
          } else if (this.board[ny][nx] === color && !visited.has(`${nx},${ny}`)) {
            stack.push([nx, ny]);
          }
        }
      }
    }

    return { stones, liberties: liberties.size };
  }

  getNeighbors(x, y) {
    const neighbors = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < this.size - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < this.size - 1) neighbors.push([x, y + 1]);
    return neighbors;
  }

  pass() {
    this.moveHistory.push({ pass: true, player: this.currentPlayer });
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
  }

  isTwoPasses() {
    if (this.moveHistory.length < 2) return false;
    const last = this.moveHistory[this.moveHistory.length - 1];
    const secondLast = this.moveHistory[this.moveHistory.length - 2];
    return last.pass && secondLast.pass;
  }

  countStones() {
    let black = 0, white = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === 'black') black++;
        else if (this.board[y][x] === 'white') white++;
      }
    }
    return { black, white };
  }

  analyzePosition() {
    const analysis = {
      groups: [],
      liberties: [],
      ataris: [],
     atariThreats: []
    };

    const checked = new Set();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] !== null && !checked.has(`${x},${y}`)) {
          const group = this.getGroup(x, y);
          group.stones.forEach(([sx, sy]) => checked.add(`${sx},${sy}`));
          
          const groupInfo = {
            color: this.board[y][x],
            stones: group.stones.length,
            liberties: group.liberties,
            x, y
          };
          
          analysis.groups.push(groupInfo);
          
          if (group.liberties === 1) {
            analysis.ataris.push(groupInfo);
          } else if (group.liberties === 2) {
            analysis.atariThreats.push(groupInfo);
          }
        }
      }
    }

    return analysis;
  }

  findDeadGroups() {
    const deadGroups = [];
    const checked = new Set();
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === opponent && !checked.has(`${x},${y}`)) {
          const group = this.getGroup(x, y);
          group.stones.forEach(([sx, sy]) => checked.add(`${sx},${sy}`));
          
          if (group.liberties <= 2) {
            deadGroups.push(group);
          }
        }
      }
    }

    return deadGroups;
  }

  getEmptyIntersections() {
    const empty = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === null) {
          empty.push({ x, y });
        }
      }
    }
    return empty;
  }
}

// AI 玩家
class GoAI {
  constructor(level = 'medium') {
    this.level = level;
  }

  getMove(engine) {
    const deadGroups = engine.findDeadGroups();
    
    if (deadGroups.length > 0) {
      const target = deadGroups[0];
      const lib = this.findLibertyWithMinimumNeighbor(target, engine);
      if (lib) return lib;
    }

    const analysis = engine.analyzePosition();
    
    for (const threat of analysis.atariThreats) {
      if (threat.color === 'white') {
        const escape = this.findEscapeMove(threat, engine);
        if (escape) return escape;
      }
    }

    const candidates = this.getCandidateMoves(engine);
    if (candidates.length === 0) return null;

    if (this.level === 'easy') {
      return candidates[Math.floor(Math.random() * Math.min(5, candidates.length))];
    }
    
    if (this.level === 'medium') {
      return candidates[Math.floor(Math.random() * Math.min(10, candidates.length))];
    }
    
    return candidates[0];
  }

  findLibertyWithMinimumNeighbor(group, engine) {
    const liberties = new Set();
    for (const [x, y] of group.stones) {
      engine.getNeighbors(x, y).forEach(([nx, ny]) => {
        if (engine.board[ny][nx] === null) {
          liberties.add(`${nx},${ny}`);
        }
      });
    }

    let best = null;
    let minScore = Infinity;

    for (const key of liberties) {
      const [x, y] = key.split(',').map(Number);
      const score = this.evaluatePosition(engine, x, y);
      if (score < minScore) {
        minScore = score;
        best = { x, y };
      }
    }

    return best;
  }

  findEscapeMove(group, engine) {
    const liberties = [];
    for (const [x, y] of group.stones) {
      engine.getNeighbors(x, y).forEach(([nx, ny]) => {
        if (engine.board[ny][nx] === null) {
          const key = `${nx},${ny}`;
          if (!liberties.find(l => `${l.x},${l.y}` === key)) {
            liberties.push({ x: nx, y: ny });
          }
        }
      });
    }

    for (const lib of liberties) {
      if (this.isSafeMove(engine, lib.x, lib.y)) {
        return lib;
      }
    }

    return liberties[0] || null;
  }

  getCandidateMoves(engine) {
    const candidates = [];
    const checked = new Set();

    // 如果棋盘为空，返回天元及附近位置
    const emptyCount = engine.getEmptyIntersections().length;
    const totalSize = engine.size * engine.size;
    if (emptyCount === totalSize) {
      const center = Math.floor(engine.size / 2);
      return [
        { x: center, y: center, score: 100 },
        { x: center - 1, y: center, score: 90 },
        { x: center + 1, y: center, score: 90 },
        { x: center, y: center - 1, score: 90 },
        { x: center, y: center + 1, score: 90 }
      ];
    }

    for (const group of engine.analyzePosition().groups) {
      for (const [x, y] of group.stones) {
        engine.getNeighbors(x, y).forEach(([nx, ny]) => {
          if (engine.board[ny][nx] === null) {
            const key = `${nx},${ny}`;
            if (!checked.has(key)) {
              checked.add(key);
              if (this.isSafeMove(engine, nx, ny)) {
                const score = this.evaluatePosition(engine, nx, ny);
                candidates.push({ x: nx, y: ny, score });
              }
            }
          }
        });
      }
    }

    // 如果没有找到候选（比如棋盘很空），搜索所有空位
    if (candidates.length === 0) {
      for (let y = 0; y < engine.size; y++) {
        for (let x = 0; x < engine.size; x++) {
          if (engine.board[y][x] === null && this.isSafeMove(engine, x, y)) {
            const score = this.evaluatePosition(engine, x, y);
            candidates.push({ x, y, score });
          }
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  }

  isSafeMove(engine, x, y) {
    const testEngine = engine.clone();
    testEngine.currentPlayer = 'white';
    return testEngine.isValidMove(x, y);
  }

  evaluatePosition(engine, x, y) {
    let score = 0;
    
    const neighbors = engine.getNeighbors(x, y);
    for (const [nx, ny] of neighbors) {
      if (engine.board[ny][nx] === 'white') score += 10;
      if (engine.board[ny][nx] === 'black') score -= 5;
      
      const group = engine.getGroup(nx, ny);
      if (engine.board[ny][nx] === 'black' && group.liberties <= 2) {
        score += 20;
      }
    }

    if (x === 0 || x === engine.size - 1 || y === 0 || y === engine.size - 1) {
      score += 3;
    }
    if (x === 3 || x === engine.size - 4 || y === 3 || y === engine.size - 4) {
      score += 2;
    }

    return score;
  }
}
