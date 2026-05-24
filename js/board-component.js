/**
 * 公共棋盘组件
 * 提供统一的棋盘渲染、落子、坐标转换等功能
 */
class BoardComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`容器 #${containerId} 不存在`);
    }

    this.size = options.size || 19;
    this.autoSize = options.autoSize !== false;
    this.cellSize = options.cellSize || 40;
    this.padding = options.padding || 30;
    this.showCoordinates = options.showCoordinates !== false;
    this.showMoveNumbers = options.showMoveNumbers || false;
    this.onIntersectionClick = options.onIntersectionClick || null;
    this.onIntersectionHover = options.onIntersectionHover || null;
    this.enableCache = options.enableCache !== false;

    this.letters = 'ABCDEFGHJKLMNOPQRST';
    this.stones = new Map();
    this.lastMove = null;
    this.cacheCanvas = null;
    this.isDirty = true;

    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isGesturing = false;
    this.lastTouchDistance = 0;
    this.lastTouchCenter = { x: 0, y: 0 };

    if (this.autoSize) {
      this.calculateResponsiveSize();
    }

    this.init();
  }

  init() {
    this.renderBoard();
    if (this.enableCache) {
      this.renderCacheCanvas();
    }
    this.renderGrid();
    this.renderStarPoints();
    if (this.showCoordinates) {
      this.renderCoordinates();
    }
    this.renderIntersections();
    this.bindEvents();
    
    if (this.autoSize) {
      this.setupResizeListener();
    }
  }

  setupResizeListener() {
    let resizeTimeout;
    this.resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 200);
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  handleResize() {
    const oldCellSize = this.cellSize;
    this.calculateResponsiveSize();
    
    if (Math.abs(this.cellSize - oldCellSize) > 2) {
      const savedStones = new Map(this.stones);
      const savedLastMove = this.lastMove ? {...this.lastMove} : null;
      
      this.container.innerHTML = '';
      this.stones.clear();
      this.lastMove = null;
      this.cacheCanvas = null;
      this.isDirty = true;
      
      this.renderBoard();
      if (this.enableCache) {
        this.renderCacheCanvas();
      }
      this.renderGrid();
      this.renderStarPoints();
      if (this.showCoordinates) {
        this.renderCoordinates();
      }
      this.renderIntersections();
      
      savedStones.forEach((stone, key) => {
        const [x, y] = key.split(',').map(Number);
        this.placeStone(x, y, stone.player, stone.moveNumber);
      });
      
      if (savedLastMove) {
        this.updateLastMove(savedLastMove.x, savedLastMove.y);
      }
    }
  }

  renderCacheCanvas() {
    this.cacheCanvas = document.createElement('canvas');
    const boardSize = this.cellSize * (this.size - 1) + this.padding * 2;
    this.cacheCanvas.width = boardSize;
    this.cacheCanvas.height = boardSize;
    this.cacheCanvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1;';
    
    const ctx = this.cacheCanvas.getContext('2d');
    this.drawBoardCache(ctx, boardSize);
    
    this.container.insertBefore(this.cacheCanvas, this.container.firstChild);
  }

  drawBoardCache(ctx, boardSize) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--board-color') || '#DEB887';
    ctx.fillRect(0, 0, boardSize, boardSize);

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-color') || '#333';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7;

    for (let i = 0; i < this.size; i++) {
      const pos = this.padding + i * this.cellSize;
      
      ctx.beginPath();
      ctx.moveTo(this.padding, pos);
      ctx.lineTo(boardSize - this.padding, pos);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pos, this.padding);
      ctx.lineTo(pos, boardSize - this.padding);
      ctx.stroke();
    }

    const starPoints = this.getStarPoints();
    ctx.globalAlpha = 1.0;
    starPoints.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(
        this.padding + x * this.cellSize,
        this.padding + y * this.cellSize,
        this.size === 9 ? 4 : 3,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-color') || '#333';
      ctx.fill();
    });
  }

  renderBoard() {
    const boardSize = this.cellSize * (this.size - 1) + this.padding * 2;
    this.container.style.width = `${boardSize}px`;
    this.container.style.height = `${boardSize}px`;
    this.container.style.position = 'relative';
    this.container.innerHTML = '';
    this.isDirty = true;
  }

  renderGrid() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const boardSize = this.cellSize * (this.size - 1) + this.padding * 2;
    
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'board-grid');
    svg.setAttribute('width', boardSize);
    svg.setAttribute('height', boardSize);
    svg.setAttribute('viewBox', `0 0 ${boardSize} ${boardSize}`);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';

    for (let i = 0; i < this.size; i++) {
      const pos = this.padding + i * this.cellSize;

      const hLine = document.createElementNS(svgNS, 'line');
      hLine.setAttribute('class', 'grid-line');
      hLine.setAttribute('x1', this.padding);
      hLine.setAttribute('y1', pos);
      hLine.setAttribute('x2', boardSize - this.padding);
      hLine.setAttribute('y2', pos);
      hLine.setAttribute('stroke', 'var(--line-color)');
      hLine.setAttribute('stroke-width', '1');
      hLine.setAttribute('opacity', '0.7');
      svg.appendChild(hLine);

      const vLine = document.createElementNS(svgNS, 'line');
      vLine.setAttribute('class', 'grid-line');
      vLine.setAttribute('x1', pos);
      vLine.setAttribute('y1', this.padding);
      vLine.setAttribute('x2', pos);
      vLine.setAttribute('y2', boardSize - this.padding);
      vLine.setAttribute('stroke', 'var(--line-color)');
      vLine.setAttribute('stroke-width', '1');
      vLine.setAttribute('opacity', '0.7');
      svg.appendChild(vLine);
    }

    this.container.appendChild(svg);
  }

  renderStarPoints() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const starPoints = this.getStarPoints();
    
    starPoints.forEach(([x, y]) => {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('class', 'star-point');
      circle.setAttribute('cx', this.padding + x * this.cellSize);
      circle.setAttribute('cy', this.padding + y * this.cellSize);
      circle.setAttribute('r', this.size === 9 ? 4 : 3);
      circle.setAttribute('fill', 'var(--line-color)');
      circle.style.pointerEvents = 'none';
      this.container.appendChild(circle);
    });
  }

  renderCoordinates() {
    const coords = ['top', 'bottom', 'left', 'right'];
    coords.forEach(position => this.renderCoordinateLabels(position));
  }

  renderCoordinateLabels(position) {
    const container = document.createElement('div');
    container.className = `board-coords coord-${position}`;

    for (let i = 0; i < this.size; i++) {
      const label = document.createElement('span');
      label.className = 'coord-label';

      if (position === 'top' || position === 'bottom') {
        label.textContent = this.letters[i] || '';
        label.style.left = `${this.padding + i * this.cellSize - 10}px`;
      } else {
        label.textContent = this.size - i;
        label.style.top = `${this.padding + i * this.cellSize - 10}px`;
      }

      container.appendChild(label);
    }

    this.container.appendChild(container);
  }

  renderIntersections() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const intersection = document.createElement('div');
        intersection.className = 'intersection';
        intersection.dataset.x = x;
        intersection.dataset.y = y;
        intersection.style.cssText = `
          position: absolute;
          width: ${this.cellSize}px;
          height: ${this.cellSize}px;
          left: ${this.padding + x * this.cellSize - this.cellSize / 2}px;
          top: ${this.padding + y * this.cellSize - this.cellSize / 2}px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        `;
        
        this.container.appendChild(intersection);
      }
    }
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      if (this.isGesturing) return;
      const intersection = e.target.closest('.intersection');
      if (intersection && this.onIntersectionClick) {
        const x = parseInt(intersection.dataset.x);
        const y = parseInt(intersection.dataset.y);
        this.onIntersectionClick(x, y);
      }
    });

    this.container.addEventListener('mouseover', (e) => {
      const intersection = e.target.closest('.intersection');
      if (intersection && this.onIntersectionHover) {
        const x = parseInt(intersection.dataset.x);
        const y = parseInt(intersection.dataset.y);
        this.onIntersectionHover(x, y);
      }
    });

    this.bindTouchEvents();
  }

  bindTouchEvents() {
    const boardWrapper = this.container.closest('.board-wrapper') || this.container.parentElement;
    if (!boardWrapper) return;

    boardWrapper.style.overflow = 'hidden';
    boardWrapper.style.touchAction = 'none';
    this.container.style.transformOrigin = 'center center';
    this.container.style.transition = 'transform 0.1s ease-out';

    boardWrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.isGesturing = true;
        this.lastTouchDistance = this.getTouchDistance(e.touches);
        this.lastTouchCenter = this.getTouchCenter(e.touches);
        e.preventDefault();
      } else if (e.touches.length === 1 && this.scale > 1) {
        this.lastTouchCenter = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: false });

    boardWrapper.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = this.getTouchDistance(e.touches);
        const center = this.getTouchCenter(e.touches);

        const scaleDelta = distance / this.lastTouchDistance;
        const newScale = Math.max(1, Math.min(3, this.scale * scaleDelta));

        if (newScale !== this.scale) {
          this.scale = newScale;
          this.applyTransform();
        }

        this.lastTouchDistance = distance;
        this.lastTouchCenter = center;
      } else if (e.touches.length === 1 && this.scale > 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.lastTouchCenter.x;
        const deltaY = touch.clientY - this.lastTouchCenter.y;

        this.translateX += deltaX;
        this.translateY += deltaY;
        this.constrainTranslation(boardWrapper);
        this.applyTransform();

        this.lastTouchCenter = { x: touch.clientX, y: touch.clientY };
      }
    }, { passive: false });

    boardWrapper.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        setTimeout(() => { this.isGesturing = false; }, 100);
      }
      if (e.touches.length === 0 && this.scale <= 1.05) {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.applyTransform();
      }
    });

    boardWrapper.addEventListener('touchcancel', () => {
      this.isGesturing = false;
    });

    boardWrapper.addEventListener('dblclick', () => {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.applyTransform();
    });
  }

  getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getTouchCenter(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  constrainTranslation(boardWrapper) {
    const rect = boardWrapper.getBoundingClientRect();
    const scaledWidth = rect.width * this.scale;
    const scaledHeight = rect.height * this.scale;
    const maxTranslateX = Math.max(0, (scaledWidth - rect.width) / 2);
    const maxTranslateY = Math.max(0, (scaledHeight - rect.height) / 2);

    this.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translateX));
    this.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translateY));
  }

  applyTransform() {
    this.container.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  getStarPoints() {
    const points = [];
    if (this.size === 9) {
      points.push([2, 2], [2, 6], [4, 4], [6, 2], [6, 6]);
    } else if (this.size === 13) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          points.push([3 + i * 3, 3 + j * 3]);
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
  }

  placeStone(x, y, player, moveNumber = null) {
    const key = `${x},${y}`;
    this.stones.set(key, { player, moveNumber });
    
    const intersection = this.container.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
    if (!intersection) {return;}

    const existingStone = intersection.querySelector('.stone');
    if (existingStone) {
      existingStone.remove();
    }

    const stone = document.createElement('div');
    stone.className = `stone ${player === 1 ? 'black' : 'white'}`;
    const stoneSize = this.cellSize * 0.9;
    stone.style.cssText = `
      width: ${stoneSize}px;
      height: ${stoneSize}px;
      border-radius: 50%;
      position: absolute;
      transform: scale(0);
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 20;
      ${player === 1 
        ? 'background: radial-gradient(circle at 30% 30%, var(--stone-black-highlight), var(--stone-black) 60%); box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.4);'
        : 'background: radial-gradient(circle at 30% 30%, #ffffff, var(--stone-white) 50%, var(--stone-white-shadow) 100%); box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1);'
      }
    `;

    if (this.showMoveNumbers && moveNumber) {
      const num = document.createElement('span');
      num.className = 'move-number';
      num.textContent = moveNumber;
      num.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
        z-index: 25;
        pointer-events: none;
        color: ${player === 1 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'};
      `;
      stone.appendChild(num);
    }

    intersection.appendChild(stone);
    
    requestAnimationFrame(() => {
      stone.style.transform = 'scale(1)';
    });

    this.updateLastMove(x, y);
    this.isDirty = false;
  }

  removeStone(x, y) {
    const key = `${x},${y}`;
    this.stones.delete(key);
    
    const intersection = this.container.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
    if (intersection) {
      const stone = intersection.querySelector('.stone');
      if (stone) {
        stone.style.transform = 'scale(0)';
        setTimeout(() => stone.remove(), 200);
      }
    }
  }

  updateLastMove(x, y) {
    // 清除之前的最后落子标记
    if (this.lastMove) {
      const prevIntersection = this.container.querySelector(
        `.intersection[data-x="${this.lastMove.x}"][data-y="${this.lastMove.y}"]`
      );
      if (prevIntersection) {
        const prevStone = prevIntersection.querySelector('.stone');
        if (prevStone) {
          prevStone.classList.remove('last-move');
          const marker = prevStone.querySelector('.last-move-marker');
          if (marker) {marker.remove();}
        }
      }
    }

    // 添加新的最后落子标记
    const intersection = this.container.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
    if (intersection) {
      const stone = intersection.querySelector('.stone');
      if (stone) {
        stone.classList.add('last-move');
        
        const marker = document.createElement('div');
        marker.className = 'last-move-marker';
        marker.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent-red);
          box-shadow: 0 0 4px rgba(196, 30, 58, 0.6);
          z-index: 30;
        `;
        stone.appendChild(marker);
      }
    }

    this.lastMove = { x, y };
  }

  clearBoard() {
    this.stones.clear();
    this.lastMove = null;
    this.container.querySelectorAll('.stone').forEach(stone => {
      stone.style.transform = 'scale(0)';
      setTimeout(() => stone.remove(), 200);
    });
    this.isDirty = true;
  }

  getStone(x, y) {
    return this.stones.get(`${x},${y}`) || null;
  }

  hasStone(x, y) {
    return this.stones.has(`${x},${y}`);
  }

  destroy() {
    this.stopTimer();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    this.container.innerHTML = '';
    this.stones.clear();
    this.lastMove = null;
  }

  calculateResponsiveSize() {
    const maxWidth = Math.min(window.innerWidth - 32, 800);
    const maxHeight = Math.min(window.innerHeight - 200, 800);
    const maxSize = Math.min(maxWidth, maxHeight);
    
    const minCellSize = 15;
    const maxCellSize = 40;
    
    let calculatedCellSize = (maxSize - this.padding * 2) / (this.size - 1);
    calculatedCellSize = Math.max(minCellSize, Math.min(maxCellSize, calculatedCellSize));
    
    this.cellSize = Math.floor(calculatedCellSize);
    
    if (this.cellSize < 25) {
      this.padding = 15;
    } else if (this.cellSize < 30) {
      this.padding = 20;
    } else {
      this.padding = 30;
    }
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardComponent;
}
