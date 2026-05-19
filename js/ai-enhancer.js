import { AIAnalyzer } from './ai.js';
import { GoGame } from './game.js';

class AIEnhancer {
  constructor(game) {
    this.game = game;
    this.analysisCache = new Map();
  }

  analyzePosition() {
    const analysis = {
      black: { stones: 0, territory: 0, liberties: 0, groups: [] },
      white: { stones: 0, territory: 0, liberties: 0, groups: [] },
      neutral: { empty: 0, dame: [] },
      urgency: [],
      deadStones: [],
      lifeStatus: {}
    };

    const checked = new Set();

    for (let y = 0; y < this.game.size; y++) {
      for (let x = 0; x < this.game.size; x++) {
        const color = this.game.board[y][x];
        const key = `${x},${y}`;

        if (color === 0) {
          analysis.neutral.empty++;
          continue;
        }

        if (checked.has(key)) continue;

        const group = this.game.getGroup(x, y, this.game.board);
        const liberties = this.game.countLiberties(group, this.game.board);
        const player = color === 1 ? 'black' : 'white';

        group.forEach(([gx, gy]) => {
          checked.add(`${gx},${gy}`);
        });

        analysis[player].stones += group.length;
        analysis[player].liberties += liberties;

        const groupInfo = {
          stones: group.length,
          liberties: liberties,
          positions: group,
          isInAtari: liberties === 1,
          isDead: false,
          isSeki: false
        };

        if (liberties === 0) {
          groupInfo.isDead = true;
          analysis.deadStones.push(...group);
        } else if (liberties <= 2) {
          groupInfo.isUrgent = true;
          analysis.urgency.push({
            positions: group,
            liberties: liberties,
            player: player
          });
        }

        analysis[player].groups.push(groupInfo);
      }
    }

    analysis.black.territory = this.estimateTerritory(1);
    analysis.white.territory = this.estimateTerritory(2);

    return analysis;
  }

  estimateTerritory(player) {
    const territory = new Set();
    const checked = new Set();
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let y = 0; y < this.game.size; y++) {
      for (let x = 0; x < this.game.size; x++) {
        if (this.game.board[y][x] !== 0) continue;
        const key = `${x},${y}`;
        if (checked.has(key)) continue;

        const region = [];
        const queue = [[x, y]];
        let owner = 0;
        let isBorder = false;

        while (queue.length > 0) {
          const [cx, cy] = queue.shift();
          const ckey = `${cx},${cy}`;

          if (checked.has(ckey)) continue;
          if (cx < 0 || cx >= this.game.size || cy < 0 || cy >= this.game.size) continue;

          if (this.game.board[cy][cx] !== 0) {
            owner = owner === 0 ? this.game.board[cy][cx] : (owner === this.game.board[cy][cx] ? owner : -1);
            isBorder = true;
            continue;
          }

          checked.add(ckey);
          region.push([cx, cy]);

          for (const [dx, dy] of directions) {
            queue.push([cx + dx, cy + dy]);
          }
        }

        if (region.length > 0 && !isBorder) {
          region.forEach(([rx, ry]) => territory.add(`${rx},${ry}`));
        }
      }
    }

    return territory.size;
  }

  getSuggestion() {
    const analysis = this.analyzePosition();
    const suggestions = [];
    const checked = new Set();

    if (analysis.urgency.length > 0) {
      for (const urgent of analysis.urgency) {
        const group = urgent.positions;
        for (const [x, y] of group) {
          const neighbors = [
            [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx < 0 || nx >= this.game.size || ny < 0 || ny >= this.game.size) continue;
            if (this.game.board[ny][nx] !== 0) continue;
            if (this.game.isValidMove(nx, ny)) {
              const key = `${nx},${ny}`;
              if (!checked.has(key)) {
                checked.add(key);
                suggestions.push({
                  type: urgent.liberties === 1 ? '紧急逃跑' : '紧气',
                  x: nx,
                  y: ny,
                  priority: 1,
                  description: urgent.liberties === 1
                    ? `救活气紧棋子 (${this.posToCoord(nx, ny)})`
                    : `紧气攻击敌方 (${this.posToCoord(nx, ny)})`,
                  captures: this.countPotentialCaptures(nx, ny)
                });
              }
            }
          }
        }
      }
    }

    const captures = this.findCaptureMoves();
    for (const cap of captures) {
      const key = `${cap.x},${cap.y}`;
      if (!checked.has(key)) {
        checked.add(key);
        suggestions.push({
          type: '吃子',
          x: cap.x,
          y: cap.y,
          priority: suggestions.length === 0 ? 1 : 2,
          description: `吃掉敌方棋子 (${this.posToCoord(cap.x, cap.y)})`,
          captures: cap.captured
        });
      }
    }

    const defense = this.findDefenseMoves();
    for (const def of defense) {
      const key = `${def.x},${def.y}`;
      if (!checked.has(key)) {
        checked.add(key);
        suggestions.push({
          type: '防守',
          x: def.x,
          y: def.y,
          priority: 3,
          description: `防守己方气紧棋 (${this.posToCoord(def.x, def.y)})`,
          captures: 0
        });
      }
    }

    if (suggestions.length < 3) {
      const generalMoves = this.findGeneralMoves(3 - suggestions.length);
      for (const move of generalMoves) {
        const key = `${move.x},${move.y}`;
        if (!checked.has(key)) {
          checked.add(key);
          suggestions.push({
            type: '常规',
            x: move.x,
            y: move.y,
            priority: suggestions.length + 1,
            description: move.description,
            captures: 0
          });
        }
      }
    }

    return suggestions.slice(0, 3);
  }

  findCaptureMoves() {
    const captures = [];
    const opponent = this.game.currentPlayer === 1 ? 2 : 1;
    const checked = new Set();

    for (let y = 0; y < this.game.size; y++) {
      for (let x = 0; x < this.game.size; x++) {
        if (this.game.board[y][x] !== opponent) continue;
        const key = `${x},${y}`;
        if (checked.has(key)) continue;

        const group = this.game.getGroup(x, y, this.game.board);
        const liberties = this.game.countLiberties(group, this.game.board);

        group.forEach(([gx, gy]) => checked.add(`${gx},${gy}`));

        if (liberties <= 2) {
          for (const [gx, gy] of group) {
            const neighbors = [[gx - 1, gy], [gx + 1, gy], [gx, gy - 1], [gx, gy + 1]];
            for (const [nx, ny] of neighbors) {
              if (nx < 0 || nx >= this.game.size || ny < 0 || ny >= this.game.size) continue;
              if (this.game.board[ny][nx] !== 0) continue;
              if (this.game.isValidMove(nx, ny)) {
                const tempBoard = this.game.board.map(row => [...row]);
                tempBoard[ny][nx] = this.game.currentPlayer;
                const captured = this.game.findCapturedStones(opponent, tempBoard);

                if (captured.length > 0) {
                  captures.push({
                    x: nx,
                    y: ny,
                    captured: captured.length,
                    target: group
                  });
                }
              }
            }
          }
        }
      }
    }

    return captures.sort((a, b) => b.captured - a.captured);
  }

  findDefenseMoves() {
    const defenses = [];
    const player = this.game.currentPlayer;
    const checked = new Set();

    for (let y = 0; y < this.game.size; y++) {
      for (let x = 0; x < this.game.size; x++) {
        if (this.game.board[y][x] !== player) continue;
        const key = `${x},${y}`;
        if (checked.has(key)) continue;

        const group = this.game.getGroup(x, y, this.game.board);
        const liberties = this.game.countLiberties(group, this.game.board);

        group.forEach(([gx, gy]) => checked.add(`${gx},${gy}`));

        if (liberties <= 2) {
          for (const [gx, gy] of group) {
            const neighbors = [[gx - 1, gy], [gx + 1, gy], [gx, gy - 1], [gx, gy + 1]];
            for (const [nx, ny] of neighbors) {
              if (nx < 0 || nx >= this.game.size || ny < 0 || ny >= this.game.size) continue;
              if (this.game.board[ny][nx] !== 0) continue;
              if (this.game.isValidMove(nx, ny)) {
                defenses.push({
                  x: nx,
                  y: ny,
                  liberties: liberties,
                  target: group
                });
              }
            }
          }
        }
      }
    }

    return defenses.sort((a, b) => a.liberties - b.liberties);
  }

  findGeneralMoves(count) {
    const moves = [];
    const center = Math.floor(this.game.size / 2);
    const checked = new Set();

    const priorityOrder = [];
    for (let d = 0; d < this.game.size / 2; d++) {
      for (let y = center - d; y <= center + d; y++) {
        for (let x = center - d; x <= center + d; x++) {
          if (Math.abs(x - center) === d || Math.abs(y - center) === d) {
            priorityOrder.push([x, y]);
          }
        }
      }
    }

    for (const [x, y] of priorityOrder) {
      if (moves.length >= count) break;
      if (y < 0 || y >= this.game.size || x < 0 || x >= this.game.size) continue;
      if (this.game.board[y][x] !== 0) continue;

      const key = `${x},${y}`;
      if (checked.has(key)) continue;
      if (!this.game.isValidMove(x, y)) continue;

      checked.add(key);
      moves.push({
        x, y,
        description: `常规位置 (${this.posToCoord(x, y)})`
      });
    }

    return moves;
  }

  countPotentialCaptures(x, y) {
    const tempBoard = this.game.board.map(row => [...row]);
    tempBoard[y][x] = this.game.currentPlayer;
    const opponent = this.game.currentPlayer === 1 ? 2 : 1;
    const captured = this.game.findCapturedStones(opponent, tempBoard);
    return captured.length;
  }

  posToCoord(x, y) {
    const letters = 'ABCDEFGHJKLMNOPQRST';
    return `${letters[x]}${this.game.size - y}`;
  }

  formatPosition(analysis) {
    const total = analysis.black.stones + analysis.white.stones + analysis.neutral.empty;
    const blackPercent = total > 0 ? (analysis.black.stones / total * 100).toFixed(1) : 0;
    const whitePercent = total > 0 ? (analysis.white.stones / total * 100).toFixed(1) : 0;

    const blackTerritory = analysis.black.territory;
    const whiteTerritory = analysis.white.territory;

    let advantage = '均势';
    const diff = (analysis.black.stones + analysis.black.territory) -
                 (analysis.white.stones + analysis.white.territory);

    if (diff > 5) {
      advantage = '黑优';
    } else if (diff < -5) {
      advantage = '白优';
    }

    const urgentCount = analysis.urgency.length;
    const deadCount = analysis.deadStones.length;

    return {
      stones: {
        black: analysis.black.stones,
        white: analysis.white.stones,
        blackPercent,
        whitePercent
      },
      territory: {
        black: blackTerritory,
        white: whiteTerritory
      },
      advantage,
      urgency: {
        count: urgentCount,
        hasUrgent: urgentCount > 0
      },
      deadStones: {
        count: deadCount,
        hasDead: deadCount > 0
      }
    };
  }

  async analyzeGameWithAI() {
    try {
      const result = await AIAnalyzer.analyze(this.game);
      return { success: true, analysis: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async rateMoveWithAI(moveIndex) {
    try {
      const result = await AIAnalyzer.rateMove(this.game, moveIndex);
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

class PositionAnalysisUI {
  constructor(containerId, enhancer) {
    this.container = document.getElementById(containerId);
    this.enhancer = enhancer;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="position-analysis" style="
        background: var(--bg-secondary, #f8f9fa);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 14px;
          color: var(--text-primary, #333);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>📊</span> 形势判断
        </h3>

        <div class="stones-comparison" style="margin-bottom: 12px;">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            font-size: 12px;
          ">
            <span style="color: #333;">⚫ 黑方</span>
            <span id="black-stones-count" style="color: #333; font-weight: bold;">0</span>
          </div>
          <div class="progress-bar" style="
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
          ">
            <div id="black-progress" style="
              height: 100%;
              background: linear-gradient(90deg, #1a1a1a 0%, #4a4a4a 100%);
              width: 50%;
              transition: width 0.3s ease;
            "></div>
            <div id="white-progress" style="
              height: 100%;
              background: linear-gradient(90deg, #f5f5f5 0%, #ffffff 100%);
              width: 50%;
              position: absolute;
              top: 0;
              right: 0;
              border: 1px solid #ccc;
              transition: width 0.3s ease;
            "></div>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
          ">
            <span id="white-stones-count" style="color: #666; font-weight: bold;">0</span>
            <span style="color: #666;">⚪ 白方</span>
          </div>
        </div>

        <div class="territory-info" style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        ">
          <div style="
            padding: 8px;
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">黑方领地</div>
            <div id="black-territory" style="font-size: 16px; font-weight: bold; color: #333;">0</div>
          </div>
          <div style="
            padding: 8px;
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">白方领地</div>
            <div id="white-territory" style="font-size: 16px; font-weight: bold; color: #666;">0</div>
          </div>
        </div>

        <div id="advantage-display" style="
          text-align: center;
          padding: 8px;
          background: linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05), rgba(0,0,0,0.02));
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
          color: var(--text-primary, #333);
        ">
          ⚖️ 均势
        </div>

        <div id="urgency-alert" style="
          display: none;
          margin-top: 12px;
          padding: 8px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          font-size: 12px;
          color: #856404;
        ">
          ⚠️ <span id="urgency-text">有棋子气紧！</span>
        </div>

        <div id="dead-stones-alert" style="
          display: none;
          margin-top: 8px;
          padding: 8px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          font-size: 12px;
          color: #721c24;
        ">
          ☠️ <span id="dead-stones-text">有死棋！</span>
        </div>
      </div>

      <style>
        .position-analysis {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .position-analysis:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
      </style>
    `;

    this.update();
  }

  update() {
    if (!this.enhancer || !this.enhancer.game) return;

    const analysis = this.enhancer.analyzePosition();
    const formatted = this.enhancer.formatPosition(analysis);

    const blackCount = document.getElementById('black-stones-count');
    const whiteCount = document.getElementById('white-stones-count');
    const blackProgress = document.getElementById('black-progress');
    const whiteProgress = document.getElementById('white-progress');
    const blackTerritory = document.getElementById('black-territory');
    const whiteTerritory = document.getElementById('white-territory');
    const advantageDisplay = document.getElementById('advantage-display');
    const urgencyAlert = document.getElementById('urgency-alert');
    const deadStonesAlert = document.getElementById('dead-stones-alert');

    if (blackCount) blackCount.textContent = formatted.stones.black;
    if (whiteCount) whiteCount.textContent = formatted.stones.white;
    if (blackProgress) blackProgress.style.width = \`\${formatted.stones.blackPercent}%\`;
    if (whiteProgress) whiteProgress.style.width = \`\${formatted.stones.whitePercent}%\`;
    if (blackTerritory) blackTerritory.textContent = formatted.territory.black;
    if (whiteTerritory) whiteTerritory.textContent = formatted.territory.white;

    if (advantageDisplay) {
      advantageDisplay.textContent = \`⚖️ \${formatted.advantage}\`;
    }

    if (urgencyAlert) {
      urgencyAlert.style.display = formatted.urgency.hasUrgent ? 'block' : 'none';
      if (formatted.urgency.hasUrgent) {
        document.getElementById('urgency-text').textContent =
          \`有 \${formatted.urgency.count} 组棋子气紧！\`;
      }
    }

    if (deadStonesAlert) {
      deadStonesAlert.style.display = formatted.deadStones.hasDead ? 'block' : 'none';
      if (formatted.deadStones.hasDead) {
        document.getElementById('dead-stones-text').textContent =
          \`有 \${formatted.deadStones.count} 颗死棋！\`;
      }
    }
  }
}

class SuggestionUI {
  constructor(containerId, enhancer, onSuggestionClick) {
    this.container = document.getElementById(containerId);
    this.enhancer = enhancer;
    this.onSuggestionClick = onSuggestionClick;
    this.init();
  }

  init() {
    this.container.innerHTML = \`
      <div class="suggestion-panel" style="
        background: var(--bg-secondary, #f8f9fa);
        border-radius: 8px;
        padding: 16px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 14px;
          color: var(--text-primary, #333);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>💡</span> AI建议
        </h3>

        <div id="suggestions-list" style="display: flex; flex-direction: column; gap: 8px;">
          <div style="
            padding: 12px;
            text-align: center;
            color: #999;
            font-size: 12px;
          ">
            正在分析...
          </div>
        </div>
      </div>

      <style>
        .suggestion-item {
          padding: 12px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .suggestion-item:hover {
          border-color: #666;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .suggestion-item.priority-1 {
          border-color: #ffd700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
        }
        .suggestion-item.priority-1:hover {
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }
        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .suggestion-priority {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          color: white;
        }
        .priority-1 .suggestion-priority {
          background: linear-gradient(135deg, #ffd700, #ffb700);
        }
        .priority-2 .suggestion-priority {
          background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
        }
        .priority-3 .suggestion-priority {
          background: linear-gradient(135deg, #cd7f32, #b06020);
        }
        .suggestion-type {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: bold;
        }
        .type-capture {
          background: #ff6b6b;
          color: white;
        }
        .type-atari {
          background: #ffa500;
          color: white;
        }
        .type-escape {
          background: #4ecdc4;
          color: white;
        }
        .type-general {
          background: #95a5a6;
          color: white;
        }
        .type-defense {
          background: #3498db;
          color: white;
        }
        .suggestion-coord {
          font-size: 16px;
          font-weight: bold;
          color: var(--text-primary, #333);
          margin-bottom: 4px;
        }
        .suggestion-desc {
          font-size: 11px;
          color: #666;
        }
      </style>
    \`;

    this.update();
  }

  update() {
    if (!this.enhancer || !this.enhancer.game) return;

    const suggestions = this.enhancer.getSuggestion();
    const listContainer = document.getElementById('suggestions-list');

    if (!listContainer) return;

    if (suggestions.length === 0) {
      listContainer.innerHTML = \`
        <div style="
          padding: 12px;
          text-align: center;
          color: #999;
          font-size: 12px;
        ">
          暂无建议
        </div>
      \`;
      return;
    }

    listContainer.innerHTML = suggestions.map((sug, index) => {
      const typeClass = this.getTypeClass(sug.type);
      const priorityClass = \`priority-\${Math.min(sug.priority, 3)}\`;

      return \`
        <div class="suggestion-item \${priorityClass}" data-x="\${sug.x}" data-y="\${sug.y}" style="cursor: pointer;">
          <div class="suggestion-header">
            <div class="suggestion-priority">\${index + 1}</div>
            <div class="suggestion-type \${typeClass}">\${sug.type}</div>
          </div>
          <div class="suggestion-coord">\${this.enhancer.posToCoord(sug.x, sug.y)}</div>
          <div class="suggestion-desc">\${sug.description}</div>
        </div>
      \`;
    }).join('');

    listContainer.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const x = parseInt(item.dataset.x);
        const y = parseInt(item.dataset.y);
        if (this.onSuggestionClick) {
          this.onSuggestionClick(x, y);
        }
      });
    });
  }

  getTypeClass(type) {
    if (type.includes('吃')) return 'type-capture';
    if (type.includes('紧气')) return 'type-atari';
    if (type.includes('逃跑')) return 'type-escape';
    if (type.includes('防守')) return 'type-defense';
    return 'type-general';
  }
}

class ReviewAnalysisUI {
  constructor(containerId, enhancer) {
    this.container = document.getElementById(containerId);
    this.enhancer = enhancer;
    this.currentAnalysis = null;
    this.currentRatings = new Map();
  }

  async analyzeGame() {
    if (!this.container) return;

    this.container.innerHTML = \`
      <div style="
        padding: 20px;
        text-align: center;
        color: #666;
      ">
        <div style="font-size: 24px; margin-bottom: 10px;">🤖</div>
        <div>AI正在分析中...</div>
        <div style="font-size: 11px; margin-top: 8px;">请稍候，这可能需要几秒钟</div>
      </div>
    \`;

    try {
      const result = await this.enhancer.analyzeGameWithAI();

      if (result.success) {
        this.currentAnalysis = result.analysis;
        this.displayAnalysis(result.analysis);
      } else {
        this.displayError(result.error);
      }
    } catch (error) {
      this.displayError(error.message);
    }
  }

  displayAnalysis(analysis) {
    if (!this.container) return;

    this.container.innerHTML = \`
      <div class="review-analysis" style="
        background: var(--bg-secondary, #f8f9fa);
        border-radius: 8px;
        padding: 16px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-height: 600px;
        overflow-y: auto;
      ">
        <h3 style="
          margin: 0 0 16px 0;
          font-size: 16px;
          color: var(--text-primary, #333);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>📝</span> AI复盘分析
        </h3>

        <div id="analysis-content" style="
          font-size: 13px;
          line-height: 1.6;
          color: #444;
          white-space: pre-wrap;
          word-wrap: break-word;
        ">
          \${this.formatMarkdown(analysis)}
        </div>
      </div>

      <style>
        .review-analysis {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        #analysis-content h4 {
          color: #2c3e50;
          margin: 16px 0 8px 0;
          font-size: 14px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 4px;
        }
        #analysis-content ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        #analysis-content li {
          margin: 4px 0;
        }
        #analysis-content strong {
          color: #e74c3c;
        }
      </style>
    \`;
  }

  displayError(error) {
    if (!this.container) return;

    this.container.innerHTML = \`
      <div style="
        padding: 20px;
        text-align: center;
        color: #721c24;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
      ">
        <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
        <div style="font-weight: bold;">分析失败</div>
        <div style="font-size: 12px; margin-top: 8px; color: #721c24;">
          \${error}
        </div>
      </div>
    \`;
  }

  formatMarkdown(text) {
    if (!text) return '';

    return text
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 style="color: #2c3e50; margin-top: 20px;">$1</h3>')
      .replace(/^\*\*([^*]+)\*\*/gm, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\\n\\n/g, '</p><p>')
      .replace(/^(?!<[hpu])/gm, '<p>')
      .replace(/(?<![>])$/gm, '</p>')
      .replace(/<p><\\/p>/g, '')
      .replace(/<p>(<[hup])/g, '$1')
      .replace(/(<\\/[hup][^>]*>)<\\/p>/g, '$1');
  }

  async rateMove(moveIndex) {
    if (!this.enhancer) return null;

    try {
      const result = await this.enhancer.rateMoveWithAI(moveIndex);

      if (result.success) {
        this.currentRatings.set(moveIndex, result);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('评分失败:', error);
      return {
        score: 0,
        analysis: \`评分失败: \${error.message}\`,
        suggestion: ''
      };
    }
  }

  getMoveRating(moveIndex) {
    return this.currentRatings.get(moveIndex);
  }

  displayMoveRating(rating, moveIndex) {
    if (!rating) return '';

    const scoreColor = this.getScoreColor(rating.score);
    const emoji = this.getScoreEmoji(rating.score);

    return \`
      <div style="
        padding: 12px;
        background: white;
        border-left: 4px solid \${scoreColor};
        border-radius: 4px;
        margin: 8px 0;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">\${emoji}</span>
          <span style="font-size: 16px; font-weight: bold; color: \${scoreColor};">
            \${rating.score > 0 ? '+' : ''}\${rating.score}
          </span>
          <span style="font-size: 11px; color: #666;">(\${moveIndex + 1}手)</span>
        </div>
        <div style="font-size: 12px; color: #555; line-height: 1.5;">
          \${rating.analysis}
        </div>
        \${rating.suggestion ? \`
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
            💡 建议: \${rating.suggestion}
          </div>
        \` : ''}
      </div>
    \`;
  }

  getScoreColor(score) {
    if (score >= 80) return '#27ae60';
    if (score >= 50) return '#2ecc71';
    if (score >= 20) return '#f39c12';
    if (score >= -19) return '#95a5a6';
    if (score >= -49) return '#e67e22';
    return '#e74c3c';
  }

  getScoreEmoji(score) {
    if (score >= 80) return '🌟';
    if (score >= 50) return '✨';
    if (score >= 20) return '👍';
    if (score >= -19) return '🤔';
    if (score >= -49) return '👎';
    return '❌';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AIEnhancer,
    PositionAnalysisUI,
    SuggestionUI,
    ReviewAnalysisUI
  };
}
