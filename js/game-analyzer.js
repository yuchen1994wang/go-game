// 棋局分析工具
class GameAnalyzer {
  constructor() {
    this.heatMapData = null;
    this.winRateData = null;
    this.recommendations = [];
  }

  analyzeGame(moves) {
    if (!moves || moves.length === 0) return null;

    return {
      heatMap: this.generateHeatMap(moves),
      winRate: this.calculateWinRate(moves),
      recommendations: this.generateRecommendations(moves),
      statistics: this.calculateStatistics(moves)
    };
  }

  generateHeatMap(moves) {
    const heatMap = {};
    
    moves.forEach((move, index) => {
      const key = `${move.x},${move.y}`;
      heatMap[key] = (heatMap[key] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(heatMap));
    
    return Object.entries(heatMap).map(([key, count]) => {
      const [x, y] = key.split(',').map(Number);
      const intensity = count / maxCount;
      return {
        x,
        y,
        count,
        intensity,
        color: this.getHeatColor(intensity)
      };
    });
  }

  getHeatColor(intensity) {
    if (intensity > 0.8) return 'rgba(255, 0, 0, 0.6)';
    if (intensity > 0.6) return 'rgba(255, 165, 0, 0.6)';
    if (intensity > 0.4) return 'rgba(255, 255, 0, 0.6)';
    if (intensity > 0.2) return 'rgba(0, 255, 0, 0.6)';
    return 'rgba(0, 0, 255, 0.6)';
  }

  calculateWinRate(moves) {
    const dataPoints = [];
    const totalMoves = moves.length;
    
    for (let i = 0; i < totalMoves; i += 10) {
      const blackMoves = moves.slice(0, i + 1).filter(m => m.color === 1).length;
      const whiteMoves = moves.slice(0, i + 1).filter(m => m.color === 2).length;
      const blackRate = i > 0 ? (blackMoves / (blackMoves + whiteMoves)) * 100 : 50;
      
      dataPoints.push({
        moveNumber: i + 1,
        blackWinRate: Math.round(blackRate),
        whiteWinRate: Math.round(100 - blackRate)
      });
    }

    return dataPoints;
  }

  generateRecommendations(moves) {
    const recommendations = [];

    if (moves.length < 20) {
      recommendations.push({
        phase: '开局',
        type: '布局',
        message: '建议关注棋子的配置和方向，保持棋形舒展。',
        icon: '🎯'
      });
    }

    if (moves.length > 50 && moves.length < 150) {
      recommendations.push({
        phase: '中盘',
        type: '战斗',
        message: '中盘战斗要保持冷静，注意棋子的联络和薄弱之处。',
        icon: '⚔️'
      });
    }

    if (moves.length > 150) {
      recommendations.push({
        phase: '官子',
        type: '收官',
        message: '官子阶段要精确计算，目数优先。',
        icon: '📊'
      });
    }

    const cornerMoves = moves.filter(m => 
      (m.x < 3 || m.x > this.size - 4) && 
      (m.y < 3 || m.y > this.size - 4)
    );
    if (cornerMoves.length < moves.length * 0.2) {
      recommendations.push({
        phase: '全局',
        type: '角部',
        message: '建议更多关注角部的攻防，角部是围棋的基础。',
        icon: '📐'
      });
    }

    return recommendations;
  }

  calculateStatistics(moves) {
    const blackMoves = moves.filter(m => m.color === 1);
    const whiteMoves = moves.filter(m => m.color === 2);

    return {
      totalMoves: moves.length,
      blackMoves: blackMoves.length,
      whiteMoves: whiteMoves.length,
      avgMoveTime: this.calculateAverageMoveTime(moves),
      territoryDistribution: this.estimateTerritory(moves)
    };
  }

  calculateAverageMoveTime(moves) {
    if (moves.length < 2) return 0;
    return Math.round(moves.length / 10);
  }

  estimateTerritory(moves) {
    const board = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    
    moves.forEach(move => {
      board[move.y][move.x] = move.color;
    });

    let blackArea = 0;
    let whiteArea = 0;
    let neutral = 0;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (board[y][x] === 1) blackArea++;
        else if (board[y][x] === 2) whiteArea++;
        else neutral++;
      }
    }

    return {
      black: blackArea,
      white: whiteArea,
      neutral,
      total: this.size * this.size
    };
  }

  renderHeatMap(containerId, heatMapData, boardSize) {
    const container = document.getElementById(containerId);
    if (!container || !heatMapData) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = Math.min(400, window.innerWidth - 40) / boardSize;
    const padding = 30;
    
    canvas.width = cellSize * (boardSize - 1) + padding * 2;
    canvas.height = cellSize * (boardSize - 1) + padding * 2;

    ctx.fillStyle = 'rgba(222, 184, 135, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    heatMapData.forEach(point => {
      const px = padding + point.x * cellSize;
      const py = padding + point.y * cellSize;
      
      ctx.beginPath();
      ctx.arc(px, py, cellSize * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
    });

    container.appendChild(canvas);
  }

  renderWinRateChart(containerId, winRateData) {
    const container = document.getElementById(containerId);
    if (!container || !winRateData || winRateData.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 300;

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#666';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${100 - i * 25}%`, padding - 30, y + 4);
    }

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight * 0.5);
    ctx.lineTo(canvas.width - padding, padding + chartHeight * 0.5);
    ctx.stroke();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    winRateData.forEach((point, i) => {
      const x = padding + (i / (winRateData.length - 1)) * chartWidth;
      const y = padding + (1 - point.blackWinRate / 100) * chartHeight;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    container.appendChild(canvas);
  }
}
