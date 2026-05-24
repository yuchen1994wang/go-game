// 残局场景库
const EndgameScenarios = {
  getScenarios() {
    return [
      {
        id: 1,
        name: "劫争",
        description: "经典的劫争场景，练习打劫技巧",
        difficulty: "中级",
        icon: "🔄",
        setup: {
          size: 9,
          black: [[0,0], [0,1], [0,2], [1,0], [2,0], [3,1]],
          white: [[1,1], [1,2], [2,1], [2,2], [3,0]]
        }
      },
      {
        id: 2,
        name: "双活",
        description: "学习双活的原理和做活技巧",
        difficulty: "中级",
        icon: "⚖️",
        setup: {
          size: 7,
          black: [[0,0], [0,1], [0,2], [1,0], [2,0], [2,1]],
          white: [[1,1], [1,2], [2,2]]
        }
      },
      {
        id: 3,
        name: "扑吃",
        description: "练习扑的手筋，紧气吃子",
        difficulty: "高级",
        icon: "💨",
        setup: {
          size: 7,
          black: [[0,0], [0,1], [1,0], [2,0], [3,1]],
          white: [[1,1], [2,1], [2,2], [3,2], [4,1]]
        }
      },
      {
        id: 4,
        name: "接不归",
        description: "让对方接不归的技巧",
        difficulty: "高级",
        icon: "🔗",
        setup: {
          size: 7,
          black: [[0,0], [0,1], [1,0], [2,0], [3,1]],
          white: [[1,1], [2,1], [2,2], [3,2], [4,0]]
        }
      },
      {
        id: 5,
        name: "金鸡独立",
        description: "利用边线的紧气技巧",
        difficulty: "中级",
        icon: "🐓",
        setup: {
          size: 5,
          black: [[0,0], [0,1], [0,2], [1,0], [2,0]],
          white: [[1,1], [1,2], [2,1], [2,2], [3,1]]
        }
      },
      {
        id: 6,
        name: "大头鬼",
        description: "经典的弃子杀棋手筋",
        difficulty: "高级",
        icon: "👻",
        setup: {
          size: 7,
          black: [[0,0], [0,1], [0,2], [1,0]],
          white: [[1,1], [1,2], [1,3], [2,0], [2,1], [2,2], [2,3], [3,1], [3,2]]
        }
      },
      {
        id: 7,
        name: "相思断",
        description: "切断对方联络的手筋",
        difficulty: "高级",
        icon: "✂️",
        setup: {
          size: 7,
          black: [[0,0], [0,1], [0,2], [1,0], [1,1], [2,0]],
          white: [[1,2], [2,1], [2,2], [3,1], [3,2]]
        }
      },
      {
        id: 8,
        name: "倒扑",
        description: "牺牲一子，吃掉更多",
        difficulty: "高级",
        icon: "↩️",
        setup: {
          size: 7,
          black: [[0,0], [0,1], [1,0], [2,0], [2,1]],
          white: [[1,1], [1,2], [2,2], [3,1], [3,2], [4,0]]
        }
      }
    ];
  },

  getById(id) {
    return this.getScenarios().find(s => s.id === id);
  },

  getByDifficulty(difficulty) {
    return this.getScenarios().filter(s => s.difficulty === difficulty);
  }
};

// 残局练习应用
class EndgameApp {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentScenario = null;
    this.init();
  }

  init() {
    this.renderScenarios();
  }

  renderScenarios() {
    const scenarios = EndgameScenarios.getScenarios();
    
    this.container.innerHTML = `
      <div class="scenarios-grid">
        ${scenarios.map(s => `
          <div class="scenario-card" onclick="window.endgameApp && window.endgameApp.loadScenario(${s.id})" role="button" tabindex="0" aria-label="${s.name}">
            <div style="font-size:2rem;margin-bottom:8px;">${s.icon}</div>
            <div style="font-weight:600;font-size:1rem;margin-bottom:4px;">${s.name}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">${s.description}</div>
            <span style="background:${s.difficulty === '高级' ? '#FFEBEE' : '#E3F2FD'};color:${s.difficulty === '高级' ? '#C62828' : '#1565C0'};padding:2px 8px;border-radius:4px;font-size:0.75rem;">${s.difficulty}</span>
          </div>
        `).join('')}
      </div>
      <style>
        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .scenario-card {
          background: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .scenario-card:hover {
          border-color: var(--accent-gold);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      </style>
    `;
  }

  loadScenario(id) {
    this.currentScenario = EndgameScenarios.getById(id);
    if (!this.currentScenario) return;

    const setup = this.currentScenario.setup;
    window.location.href = `game.html?size=${setup.size}&mode=endgame&scenario=${id}`;
  }
}
