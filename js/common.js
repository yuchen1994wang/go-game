// 公共工具函数

// 音效管理器
const SoundManager = {
  SOUND_KEY: 'go_sound_enabled',
  sounds: {},
  enabled: true,

  init() {
    this.enabled = localStorage.getItem(this.SOUND_KEY) !== 'false';
    this.loadSounds();
  },

  loadSounds() {
    // 使用 Web Audio API 生成音效
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  },

  isEnabled() {
    return this.enabled;
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(this.SOUND_KEY, this.enabled);
    return this.enabled;
  },

  // 落子音效 - 清脆的咔嗒声
  playPlaceStone() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(800, 0.05, 'square', 0.1);
  },

  // 提子音效 - 连续的咔咔声
  playCapture(count = 1) {
    if (!this.enabled || !this.audioContext) return;
    for (let i = 0; i < Math.min(count, 5); i++) {
      setTimeout(() => {
        this.playTone(600 + i * 100, 0.03, 'sawtooth', 0.08);
      }, i * 50);
    }
  },

  // 胜利音效
  playVictory() {
    if (!this.enabled || !this.audioContext) return;
    const notes = [523, 659, 784, 1047]; // C E G C
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.15), i * 120);
    });
  },

  // 错误音效
  playError() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(200, 0.1, 'sawtooth', 0.1);
  },

  // 通用音调播放
  playTone(frequency, duration, type = 'sine', volume = 0.1) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // 音频上下文可能被浏览器阻止
    }
  }
};

// 主题管理
const ThemeManager = {
  THEME_KEY: 'go_theme',

  init() {
    const savedTheme = this.getTheme();
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  getTheme() {
    return localStorage.getItem(this.THEME_KEY);
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    // 更新所有主题切换按钮的图标
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  },

  toggle() {
    const current = this.getTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
};

// Toast 提示
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// 数据持久化
const Storage = {
  HISTORY_KEY: 'go_game_history',
  USERNAME_KEY: 'go_username',

  getHistory() {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory(history) {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  },

  addGame(gameData) {
    const history = this.getHistory();
    history.unshift({
      id: Date.now(),
      ...gameData,
      savedAt: new Date().toISOString()
    });
    this.saveHistory(history);
    return history;
  },

  deleteGame(id) {
    const history = this.getHistory().filter(g => g.id !== id);
    this.saveHistory(history);
    return history;
  },

  getUsername() {
    return localStorage.getItem(this.USERNAME_KEY);
  },

  saveUsername(name) {
    localStorage.setItem(this.USERNAME_KEY, name);
  }
};

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

// AI 分析服务
class AIAnalyzer {
  static API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  static getApiKey() {
    return localStorage.getItem('go_ai_api_key') || '';
  }

  static setApiKey(key) {
    localStorage.setItem('go_ai_api_key', key);
  }

  static async analyze(game) {
    const sgf = game.toSGF();
    const moveCount = game.moveHistory.length;
    const blackMoves = game.moveHistory.filter(m => m.player === 1).length;
    const whiteMoves = game.moveHistory.filter(m => m.player === 2).length;
    const captures = game.moveHistory.reduce((sum, m) => sum + (m.captured ? m.captured.length : 0), 0);

    const prompt = `你是一位专业的围棋教练。请对以下围棋对局进行简要分析：

对局信息：
- 棋盘大小：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}
- 总手数：${moveCount}手
- 黑方手数：${blackMoves}
- 白方手数：${whiteMoves}
- 总提子数：${captures}

SGF棋谱：${sgf}

请从以下几个方面进行分析（用中文回答，控制在300字以内）：
1. 开局评价（布局是否合理）
2. 中盘要点（关键战斗和转换）
3. 双方优劣判断
4. 改进建议

请给出专业但易懂的分析。`;

    try {
      console.log('AI分析开始，请求OpenRouter API...');
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('请先配置 OpenRouter API Key');
      }
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Go Game Analysis'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b:free',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的围棋教练，擅长分析棋局并给出建设性的意见。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500
        })
      });

      console.log('API响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API错误详情:', errorData || `HTTP ${response.status}`);
        throw new Error(`API请求失败: ${response.status} - ${errorData?.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('AI分析成功，返回数据:', data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI分析失败:', error.message || error);
      return this.localAnalysis(game);
    }
  }

  static localAnalysis(game) {
    const moveCount = game.moveHistory.length;
    const captures = game.moveHistory.reduce((sum, m) => sum + (m.captured ? m.captured.length : 0), 0);

    let analysis = `## 本地分析\n\n本局共进行了${moveCount}手，总提子数为${captures}。\n\n`;
    if (moveCount < 20) {
      analysis += `对局尚在布局阶段，双方正在争夺角部和边部的要点。建议注意棋子的效率和配合。\n`;
    } else if (moveCount < 80) {
      analysis += `对局进入中盘阶段，战斗逐渐激烈。建议关注厚薄判断和攻防转换的时机。\n`;
    } else {
      analysis += `对局已进入后半盘，官子阶段需要精确计算。建议注意大小官子的价值判断。\n`;
    }
    if (captures > 5) {
      analysis += `\n本局战斗激烈，共有${captures}个子被提掉。建议在攻击对方时注意自身棋子的安全。\n`;
    }
    analysis += `\n当前为离线分析模式，联网后可获得AI深度分析。`;
    return analysis;
  }

  static async rateMove(game, moveIndex) {
    if (moveIndex < 0 || moveIndex >= game.moveHistory.length) {
      return { score: 0, analysis: '无效的步数' };
    }

    const currentMove = game.moveHistory[moveIndex];
    if (currentMove.pass) {
      return { score: 0, analysis: 'Pass停一手，无法评价' };
    }

    const prompt = `你是一位专业的围棋教练。请评价以下围棋对局中的特定一步棋，使用正负分数系统：

棋局信息：
- 棋盘大小：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}

需要评价的第${moveIndex + 1}手棋：
- 棋手：${currentMove.playerName}
- 落子位置：${String.fromCharCode(65 + currentMove.x)}${game.size - currentMove.y}

评分标准（-100到+100）：
- +80到+100：妙手！神之一手，非常精彩
- +50到+79：好棋，正确且高效的选择
- +20到+49：可以，合理的应对
- +1到+19：略有不足，但可以接受
- -1到-19：有问题，需要改进
- -20到-49：不好，有明显失误
- -50到-79：很差，明显的错误
- -80到-100：败着，严重失误

请从以下几个角度进行评价（用中文回答）：
1. 这一手棋的分数（-100到+100）
2. 详细分析：为什么给出这个分数？这手棋好在哪/不好在哪？具体分析了哪些方面（如厚薄、效率、方向、时机等）？
3. 如果不是最佳选择，提出更好的建议

请用以下JSON格式返回：
{
  "score": 分数(-100到+100),
  "analysis": "详细评价理由",
  "suggestion": "如有更好的建议则提供，否则为空"
}`;

    try {
      console.log('AI评分开始，请求OpenRouter API...');
      console.log('评价手数:', moveIndex + 1, '位置:', String.fromCharCode(65 + currentMove.x) + (game.size - currentMove.y));
      
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('请先配置 OpenRouter API Key');
      }
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Go Move Rating'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b:free',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的围棋教练，擅长评价棋步质量，使用正负分数系统。请严格按照指定的JSON格式返回评价结果。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 600
        })
      });

      console.log('API响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API错误详情:', errorData || `HTTP ${response.status}`);
        throw new Error(`API请求失败: ${response.status} - ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('AI评分成功，返回数据:', data);
      
      const content = data.choices[0].message.content;
      console.log('AI返回内容:', content);

      try {
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          console.log('解析到JSON:', jsonMatch[0]);
          const result = JSON.parse(jsonMatch[0]);
          return {
            score: Math.max(-100, Math.min(100, result.score || 0)),
            analysis: result.analysis || content,
            suggestion: result.suggestion || ''
          };
        }
      } catch (parseError) {
        console.error('JSON解析失败:', parseError);
        return { score: 0, analysis: content, suggestion: '' };
      }

      return { score: 0, analysis: content, suggestion: '' };
    } catch (error) {
      console.error('AI评分失败:', error.message || error);
      return this.localRateMove(game, moveIndex);
    }
  }

  static localRateMove(game, moveIndex) {
    const currentMove = game.moveHistory[moveIndex];
    const captures = currentMove.captured ? currentMove.captured.length : 0;

    let score = 20;
    let analysis = '';

    if (captures > 0) {
      score += captures * 15;
      analysis = `本手吃掉了${captures}个子，表现不错！`;
    } else if (moveIndex < game.size * 2) {
      score = 35;
      analysis = '布局阶段的常规应对，位置选择合理。';
    } else {
      score = 15;
      analysis = '本手为中盘阶段的普通应对。';
    }

    score = Math.min(100, Math.max(-100, score));

    return {
      score,
      analysis: `## 本地评分\n\n**分数：${score}/100**\n\n${analysis}\n\n当前为离线评分，联网后可获得AI精确评分。`,
      suggestion: ''
    };
  }
}
