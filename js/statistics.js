// 数据统计模块

class TimeFilter {
  static ALL = 'all';
  static WEEK = 'week';
  static MONTH = 'month';
  static QUARTER = 'quarter';
  static YEAR = 'year';

  static getFilteredGames(games, filter) {
    if (filter === this.ALL) return games;
    
    const now = new Date();
    let cutoff = new Date();
    
    switch(filter) {
      case this.WEEK:
        cutoff.setDate(now.getDate() - 7);
        break;
      case this.MONTH:
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case this.QUARTER:
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case this.YEAR:
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return games;
    }
    
    return games.filter(g => new Date(g.date) >= cutoff);
  }
}

class GameStats {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentFilter = TimeFilter.ALL;
  }

  render() {
    if (!this.container) {return;}
    this.renderWithFilter(this.currentFilter);
  }

  renderWithFilter(filter) {
    this.currentFilter = filter;
    const allGames = Storage.getHistory ? Storage.getHistory() : [];
    const games = TimeFilter.getFilteredGames(allGames, filter);
    const wins = games.filter(g => g.result === 'win').length;
    const losses = games.filter(g => g.result === 'loss').length;
    const draws = games.filter(g => g.result === 'draw').length;
    const total = games.length;

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div class="section-title">🎮 对局统计</div>
        <div class="time-tabs">
          <button class="time-tab ${filter === TimeFilter.ALL ? 'active' : ''}" data-filter="all">全部</button>
          <button class="time-tab ${filter === TimeFilter.WEEK ? 'active' : ''}" data-filter="week">近7天</button>
          <button class="time-tab ${filter === TimeFilter.MONTH ? 'active' : ''}" data-filter="month">近30天</button>
          <button class="time-tab ${filter === TimeFilter.QUARTER ? 'active' : ''}" data-filter="quarter">近3个月</button>
          <button class="time-tab ${filter === TimeFilter.YEAR ? 'active' : ''}" data-filter="year">近1年</button>
        </div>
      </div>
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">${total}</div>
          <div class="stat-label">总对局</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${wins}</div>
          <div class="stat-label">胜场</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${losses}</div>
          <div class="stat-label">负场</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${draws}</div>
          <div class="stat-label">和棋</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${total > 0 ? Math.round((wins / total) * 100) : 0}%</div>
          <div class="stat-label">胜率</div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll('.time-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.renderWithFilter(tab.dataset.filter);
      });
    });
  }
}

class PracticeStats {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) {return;}
    const tsumegoStats = JSON.parse(localStorage.getItem('go_tsumego_stats') || '{}');
    const total = tsumegoStats.totalSolved || 0;
    const correct = tsumegoStats.correctCount || 0;

    this.container.innerHTML = `
      <div class="section-title">🎯 练习统计</div>
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">${total}</div>
          <div class="stat-label">总练习</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${correct}</div>
          <div class="stat-label">正确数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${total > 0 ? Math.round((correct / total) * 100) : 0}%</div>
          <div class="stat-label">正确率</div>
        </div>
      </div>
    `;
  }
}

class GrowthChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = null;
    this.ctx = null;
    this.data = [];
    this.currentFilter = TimeFilter.ALL;
    this.width = 400;
    this.height = 300;
  }

  setData(data, filter = TimeFilter.ALL) {
    this.currentFilter = filter;
    const allGames = Storage.getHistory ? Storage.getHistory() : [];
    const filteredGames = TimeFilter.getFilteredGames(allGames, filter);
    this.data = data || filteredGames.map((game, index) => ({
      gameNumber: index + 1,
      winRate: game.result === 'win' ? 1 : (game.result === 'draw' ? 0.5 : 0),
      timestamp: new Date(game.date).getTime(),
      date: game.date
    }));
  }

  render() {
    if (!this.container) {return;}
    
    this.setData(null, this.currentFilter);
    
    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div class="section-title">📈 成长曲线</div>
        <div class="time-tabs">
          <button class="time-tab ${this.currentFilter === TimeFilter.ALL ? 'active' : ''}" data-filter="all">全部</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.WEEK ? 'active' : ''}" data-filter="week">近7天</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.MONTH ? 'active' : ''}" data-filter="month">近30天</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.QUARTER ? 'active' : ''}" data-filter="quarter">近3个月</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.YEAR ? 'active' : ''}" data-filter="year">近1年</button>
        </div>
      </div>
      <div style="position: relative;">
        <canvas id="growthChartCanvas" width="${this.width}" height="${this.height}" 
                style="border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-primary);"></canvas>
        <div id="chartTooltip" style="position: absolute; display: none; background: var(--bg-secondary); 
             padding: 8px 12px; border-radius: 4px; font-size: 12px; pointer-events: none; z-index: 100;"></div>
      </div>
      <div style="margin-top: 16px; font-size: 14px; color: var(--text-secondary); text-align: center;">
        共 ${this.data.length} 场对局 | 胜率: ${this.calculateOverallWinRate()}%
      </div>
    `;

    this.canvas = document.getElementById('growthChartCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.draw();
      this.bindEvents();
    }

    this.bindFilterEvents();
  }

  bindFilterEvents() {
    const tabs = this.container.querySelectorAll('.time-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.setData(null, tab.dataset.filter);
        this.render();
      });
    });
  }

  calculateOverallWinRate() {
    if (this.data.length === 0) {return 0;}
    const totalWins = this.data.reduce((sum, d) => sum + d.winRate, 0);
    return Math.round((totalWins / this.data.length) * 100);
  }

  draw() {
    if (!this.ctx || this.data.length === 0) {return;}

    const ctx = this.ctx;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = this.width - padding.left - padding.right;
    const chartHeight = this.height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#333';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    
    ctx.fillText('对局序号', this.width / 2, this.height - 20);
    
    ctx.save();
    ctx.translate(20, this.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('胜率', 0, 0);
    ctx.restore();

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#666';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'right';
      const label = ((4 - i) * 25).toString();
      ctx.fillText(label + '%', padding.left - 10, y + 4);
    }

    if (this.data.length === 1) {
      const x = padding.left + chartWidth / 2;
      const y = padding.top + chartHeight * (1 - this.data[0].winRate);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');

    ctx.beginPath();
    let prevX, prevY;
    this.data.forEach((d, i) => {
      const x = padding.left + (chartWidth / (this.data.length - 1)) * i;
      const y = padding.top + chartHeight * (1 - d.winRate);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
      prevX = x;
      prevY = y;
    });

    ctx.lineTo(prevX, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    prevX = null;
    prevY = null;
    this.data.forEach((d, i) => {
      const x = padding.left + (chartWidth / (this.data.length - 1)) * i;
      const y = padding.top + chartHeight * (1 - d.winRate);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
      prevX = x;
      prevY = y;
    });

    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.stroke();

    this.data.forEach((d, i) => {
      const x = padding.left + (chartWidth / (this.data.length - 1)) * i;
      const y = padding.top + chartHeight * (1 - d.winRate);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = d.winRate >= 0.5 ? '#4CAF50' : '#f44336';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#666';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((i + 1).toString(), x, this.height - padding.bottom + 20);
    });
  }

  bindEvents() {
    if (!this.canvas) {return;}

    const tooltip = document.getElementById('chartTooltip');
    if (!tooltip) {return;}

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const padding = { left: 60, right: 40 };
      const chartWidth = this.width - padding.left - padding.right;

      if (this.data.length === 0) {return;}

      const nearestIndex = Math.round((x - padding.left) / (chartWidth / (this.data.length - 1)));
      
      if (nearestIndex >= 0 && nearestIndex < this.data.length) {
        const dataX = padding.left + (chartWidth / (this.data.length - 1)) * nearestIndex;
        const distance = Math.abs(x - dataX);

        if (distance < 20) {
          const data = this.data[nearestIndex];
          tooltip.style.display = 'block';
          tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
          tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
          tooltip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">第${nearestIndex + 1}局</div>
            <div>结果: ${data.winRate === 1 ? '胜' : (data.winRate === 0.5 ? '平' : '负')}</div>
          `;
        } else {
          tooltip.style.display = 'none';
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  }
}

class RadarChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = null;
    this.ctx = null;
    this.size = 350;
    this.currentFilter = TimeFilter.ALL;
    this.abilities = this.calculateAbilities(this.currentFilter);
  }

  calculateAbilities(filter = TimeFilter.ALL) {
    const allGames = Storage.getHistory ? Storage.getHistory() : [];
    const games = TimeFilter.getFilteredGames(allGames, filter);
    const tsumegoStats = JSON.parse(localStorage.getItem('go_tsumego_stats') || '{}');
    
    const gamesAnalyzed = Math.min(games.length, 20);
    const recentGames = games.slice(-gamesAnalyzed);
    
    const wins = recentGames.filter(g => g.result === 'win').length;
    const totalMoves = recentGames.reduce((sum, g) => sum + (g.moves || 0), 0);
    const avgMovesPerGame = gamesAnalyzed > 0 ? totalMoves / gamesAnalyzed : 0;
    
    const openingScore = Math.min(100, Math.max(0, 
      (recentGames.filter(g => g.phase === 'opening' || g.phase === 'early').length / Math.max(gamesAnalyzed, 1)) * 100
    ));
    
    const middleScore = Math.min(100, Math.max(0, 
      (recentGames.filter(g => g.phase === 'middle').length / Math.max(gamesAnalyzed, 1)) * 100 * 
      (1 + (totalMoves / Math.max(gamesAnalyzed * 50, 1) - 1) * 0.1)
    ));
    
    const endgameScore = Math.min(100, Math.max(0, 
      (recentGames.filter(g => g.phase === 'endgame').length / Math.max(gamesAnalyzed, 1)) * 100
    ));
    
    const tsumegoScore = tsumegoStats.totalSolved > 0 
      ? Math.min(100, (tsumegoStats.correctCount / tsumegoStats.totalSolved) * 100)
      : 50;
    
    const attackScore = Math.min(100, Math.max(0, 
      (recentGames.filter(g => g.territory && g.territory.black > g.territory.white).length / Math.max(gamesAnalyzed, 1)) * 100
    ));
    
    const defenseScore = Math.min(100, Math.max(0, 
      (recentGames.filter(g => g.territory && g.territory.white > g.territory.black).length / Math.max(gamesAnalyzed, 1)) * 100 * 0.8 + 20
    ));
    
    return [
      { name: '布局', score: Math.round(openingScore), color: '#4CAF50' },
      { name: '中盘', score: Math.round(middleScore), color: '#2196F3' },
      { name: '官子', score: Math.round(endgameScore), color: '#FF9800' },
      { name: '死活', score: Math.round(tsumegoScore), color: '#9C27B0' },
      { name: '攻杀', score: Math.round(attackScore), color: '#F44336' },
      { name: '防守', score: Math.round(defenseScore), color: '#00BCD4' }
    ];
  }

  render() {
    if (!this.container) {return;}

    this.abilities = this.calculateAbilities(this.currentFilter);
    const avgScore = Math.round(
      this.abilities.reduce((sum, a) => sum + a.score, 0) / this.abilities.length
    );

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div class="section-title">🎯 能力雷达图</div>
        <div class="time-tabs">
          <button class="time-tab ${this.currentFilter === TimeFilter.ALL ? 'active' : ''}" data-filter="all">全部</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.WEEK ? 'active' : ''}" data-filter="week">近7天</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.MONTH ? 'active' : ''}" data-filter="month">近30天</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.QUARTER ? 'active' : ''}" data-filter="quarter">近3个月</button>
          <button class="time-tab ${this.currentFilter === TimeFilter.YEAR ? 'active' : ''}" data-filter="year">近1年</button>
        </div>
      </div>
      <div style="position: relative; display: flex; justify-content: center; align-items: center;">
        <canvas id="radarChartCanvas" width="${this.size}" height="${this.size}" 
                style="border-radius: 50%; background: var(--bg-primary);"></canvas>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
             text-align: center; pointer-events: none;">
          <div style="font-size: 32px; font-weight: bold; color: var(--text-primary);">${avgScore}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">综合评分</div>
        </div>
      </div>
      <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        ${this.abilities.map(a => `
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px; 
               background: var(--bg-secondary); border-radius: 6px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${a.color};"></div>
            <span style="flex: 1; font-size: 13px; color: var(--text-secondary);">${a.name}</span>
            <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${a.score}</span>
          </div>
        `).join('')}
      </div>
    `;

    this.canvas = document.getElementById('radarChartCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.draw();
    }

    this.bindFilterEvents();
  }

  bindFilterEvents() {
    const tabs = this.container.querySelectorAll('.time-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentFilter = tab.dataset.filter;
        this.render();
      });
    });
  }

  draw() {
    if (!this.ctx) {return;}

    const ctx = this.ctx;
    const centerX = this.size / 2;
    const centerY = this.size / 2;
    const radius = (this.size / 2) - 60;
    const numAxes = this.abilities.length;
    const angleStep = (2 * Math.PI) / numAxes;

    ctx.clearRect(0, 0, this.size, this.size);

    for (let level = 1; level <= 5; level++) {
      ctx.beginPath();
      for (let i = 0; i <= numAxes; i++) {
        const angle = (i * angleStep) - Math.PI / 2;
        const r = (radius * level) / 5;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = level === 5 ? '#ddd' : '#eee';
      ctx.lineWidth = level === 5 ? 2 : 1;
      ctx.stroke();
    }

    for (let i = 0; i < numAxes; i++) {
      const angle = (i * angleStep) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 1;
      ctx.stroke();

      const labelX = centerX + (radius + 35) * Math.cos(angle);
      const labelY = centerY + (radius + 35) * Math.sin(angle);
      
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#666';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.abilities[i].name, labelX, labelY);
    }

    ctx.beginPath();
    this.abilities.forEach((ability, i) => {
      const angle = (i * angleStep) - Math.PI / 2;
      const r = (ability.score / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.2)');
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.stroke();

    this.abilities.forEach((ability, i) => {
      const angle = (i * angleStep) - Math.PI / 2;
      const r = (ability.score / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = ability.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
}

class StatisticsPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stats = this.loadStats();
  }

  loadStats() {
    const games = Storage.getHistory ? Storage.getHistory() : [];
    const tsumegoStats = JSON.parse(localStorage.getItem('go_tsumego_stats') || '{}');
    
    return {
      totalGames: games.length,
      wins: games.filter(g => g.result === 'win').length,
      losses: games.filter(g => g.result === 'loss').length,
      draws: games.filter(g => g.result === 'draw').length,
      totalTsumego: tsumegoStats.totalSolved || 0,
      correctTsumego: tsumegoStats.correctCount || 0,
      streakDays: this.calculateStreak(),
      winRate: games.length > 0 ? Math.round((games.filter(g => g.result === 'win').length / games.length) * 100) : 0
    };
  }

  calculateStreak() {
    const history = JSON.parse(localStorage.getItem('go_daily_history') || '[]');
    if (history.length === 0) {return 0;}
    
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].date === today || streak > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  render() {
    if (!this.container) {return;}
    
    this.container.innerHTML = `
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">${this.stats.totalGames}</div>
          <div class="stat-label">总对局</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.winRate}%</div>
          <div class="stat-label">胜率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.totalTsumego}</div>
          <div class="stat-label">死活题</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.streakDays}</div>
          <div class="stat-label">连续天数</div>
        </div>
      </div>
      <div class="stats-detail">
        <div class="detail-section">
          <h3>对局统计</h3>
          <div class="detail-row">
            <span>胜场</span><span>${this.stats.wins}</span>
          </div>
          <div class="detail-row">
            <span>负场</span><span>${this.stats.losses}</span>
          </div>
          <div class="detail-row">
            <span>和棋</span><span>${this.stats.draws}</span>
          </div>
        </div>
        <div class="detail-section">
          <h3>练习统计</h3>
          <div class="detail-row">
            <span>已完成</span><span>${this.stats.totalTsumego}</span>
          </div>
          <div class="detail-row">
            <span>正确率</span><span>${this.stats.totalTsumego > 0 ? Math.round((this.stats.correctTsumego / this.stats.totalTsumego) * 100) : 0}%</span>
          </div>
        </div>
      </div>
    `;
  }
}

// CommonJS 模块导出，用于测试
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TimeFilter,
    GameStats,
    PracticeStats,
    GrowthChart,
    RadarChart,
    StatisticsPanel
  };
}
