// 数据统计模块

class GameStats {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;
    const games = Storage.getHistory ? Storage.getHistory() : [];
    const wins = games.filter(g => g.result === 'win').length;
    const losses = games.filter(g => g.result === 'loss').length;
    const draws = games.filter(g => g.result === 'draw').length;
    const total = games.length;

    this.container.innerHTML = `
      <div class="section-title">🎮 对局统计</div>
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
      </div>
    `;
  }
}

class PracticeStats {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;
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
    this.data = [];
  }

  setData(data) {
    this.data = data || [];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="section-title">📈 成长曲线</div>
      <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 16px;">📊</div>
        <div>成长曲线功能开发中...</div>
      </div>
    `;
  }
}

class RadarChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="section-title">🎯 能力雷达</div>
      <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 16px;">🎯</div>
        <div>能力分析功能开发中...</div>
      </div>
    `;
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
    if (history.length === 0) return 0;
    
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
    if (!this.container) return;
    
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
