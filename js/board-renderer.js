/**
 * 棋盘渲染器 - 可复用的围棋棋盘渲染组件
 * 支持人人对弈和AI对弈页面共享
 */

class BoardRenderer {
  constructor(options = {}) {
    this.gobanId = options.gobanId || 'goban';
    this.cellSize = options.cellSize || 40;
    this.boardPadding = options.boardPadding || 30;
    this.letters = 'ABCDEFGHJKLMNOPQRST';
    this.onIntersectionClick = options.onIntersectionClick || null;
    this.enableGestures = options.enableGestures !== false;
  }

  /**
   * 渲染棋盘（包含网格、星位、交叉点）
   * @param {number} size - 棋盘大小
   * @param {Array<Array<number>>} board - 当前棋盘状态
   * @param {Array} moveHistory - 落子历史
   */
  render(size, board, moveHistory = []) {
    const goban = document.getElementById(this.gobanId);
    if (!goban) return;

    // 移动端自适应
    const isMobile = window.innerWidth <= 900;
    const sectionWidth = isMobile ? window.innerWidth - 40 : Math.min(window.innerWidth - 420, 800);
    const sectionHeight = isMobile ? window.innerHeight - 200 : window.innerHeight - 140;
    const availableSize = Math.min(sectionWidth, sectionHeight);
    const desiredBoardSize = this.cellSize * (size - 1) + this.boardPadding * 2;

    if (isMobile && desiredBoardSize > availableSize) {
      this.cellSize = Math.floor((availableSize - this.boardPadding * 2) / (size - 1));
      this.cellSize = Math.max(this.cellSize, 20);
    }

    const boardSize = this.cellSize * (size - 1) + this.boardPadding * 2;

    // 设置 CSS 变量
    goban.style.setProperty('--cell-size', `${this.cellSize}px`);
    goban.style.width = `${boardSize}px`;
    goban.style.height = `${boardSize}px`;
    goban.innerHTML = '';

    // 渲染网格和星位
    this._renderGrid(goban, size, boardSize);

    // 渲染交叉点
    this._renderIntersections(goban, size);

    // 渲染坐标
    this._renderCoords(goban, size);

    // 绑定手势
    if (this.enableGestures) {
      this._bindGestures(goban);
    }

    // 绑定点击事件
    if (this.onIntersectionClick) {
      goban.addEventListener('click', e => {
        const intersection = e.target.closest('.intersection');
        if (intersection) {
          const x = parseInt(intersection.dataset.x);
          const y = parseInt(intersection.dataset.y);
          this.onIntersectionClick(x, y);
        }
      });
    }

    // 渲染棋子
    this.updateStones(board, moveHistory);
  }

  _renderGrid(goban, size, boardSize) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'board-grid');
    svg.setAttribute('width', boardSize);
    svg.setAttribute('height', boardSize);
    svg.setAttribute('viewBox', `0 0 ${boardSize} ${boardSize}`);

    for (let i = 0; i < size; i++) {
      const pos = this.boardPadding + i * this.cellSize;

      const hLine = document.createElementNS(svgNS, 'line');
      hLine.setAttribute('class', 'grid-line');
      hLine.setAttribute('x1', this.boardPadding);
      hLine.setAttribute('y1', pos);
      hLine.setAttribute('x2', boardSize - this.boardPadding);
      hLine.setAttribute('y2', pos);
      svg.appendChild(hLine);

      const vLine = document.createElementNS(svgNS, 'line');
      vLine.setAttribute('class', 'grid-line');
      vLine.setAttribute('x1', pos);
      vLine.setAttribute('y1', this.boardPadding);
      vLine.setAttribute('x2', pos);
      vLine.setAttribute('y2', boardSize - this.boardPadding);
      svg.appendChild(vLine);
    }

    const starPoints = this._getStarPoints(size);
    starPoints.forEach(([x, y]) => {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('class', 'star-point');
      circle.setAttribute('cx', this.boardPadding + x * this.cellSize);
      circle.setAttribute('cy', this.boardPadding + y * this.cellSize);
      circle.setAttribute('r', Math.max(2, this.cellSize * 0.08));
      svg.appendChild(circle);
    });

    goban.appendChild(svg);
  }

  _renderIntersections(goban, size) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const intersection = document.createElement('div');
        intersection.className = 'intersection';
        intersection.dataset.x = x;
        intersection.dataset.y = y;
        intersection.style.left = `${this.boardPadding + x * this.cellSize}px`;
        intersection.style.top = `${this.boardPadding + y * this.cellSize}px`;
        goban.appendChild(intersection);
      }
    }
  }

  _renderCoords(goban, size) {
    goban.querySelectorAll('.board-coords').forEach(el => el.remove());

    const labelOffset = this.cellSize * 0.25;

    const topCoords = document.createElement('div');
    topCoords.className = 'board-coords coord-top';
    for (let i = 0; i < size; i++) {
      const label = document.createElement('span');
      label.className = 'coord-label';
      label.textContent = this.letters[i] || '';
      label.style.left = `${this.boardPadding + i * this.cellSize - labelOffset}px`;
      label.style.top = '0px';
      topCoords.appendChild(label);
    }
    goban.appendChild(topCoords);

    const bottomCoords = document.createElement('div');
    bottomCoords.className = 'board-coords coord-bottom';
    for (let i = 0; i < size; i++) {
      const label = document.createElement('span');
      label.className = 'coord-label';
      label.textContent = this.letters[i] || '';
      label.style.left = `${this.boardPadding + i * this.cellSize - labelOffset}px`;
      label.style.top = '0px';
      bottomCoords.appendChild(label);
    }
    goban.appendChild(bottomCoords);

    const leftCoords = document.createElement('div');
    leftCoords.className = 'board-coords coord-left';
    for (let i = 0; i < size; i++) {
      const label = document.createElement('span');
      label.className = 'coord-label';
      label.textContent = size - i;
      label.style.top = `${this.boardPadding + i * this.cellSize - labelOffset}px`;
      label.style.left = '0px';
      leftCoords.appendChild(label);
    }
    goban.appendChild(leftCoords);

    const rightCoords = document.createElement('div');
    rightCoords.className = 'board-coords coord-right';
    for (let i = 0; i < size; i++) {
      const label = document.createElement('span');
      label.className = 'coord-label';
      label.textContent = size - i;
      label.style.top = `${this.boardPadding + i * this.cellSize - labelOffset}px`;
      label.style.left = '0px';
      rightCoords.appendChild(label);
    }
    goban.appendChild(rightCoords);
  }

  _getStarPoints(size) {
    const points = [];
    if (size === 9) {
      points.push([2, 2], [2, 6], [4, 4], [6, 2], [6, 6]);
    } else if (size === 13) {
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

  /**
   * 更新棋子显示
   * @param {Array<Array<number>>} board - 棋盘状态
   * @param {Array} moveHistory - 落子历史
   */
  updateStones(board, moveHistory = []) {
    const intersections = document.querySelectorAll(`#${this.gobanId} .intersection`);

    intersections.forEach(intersection => {
      const x = parseInt(intersection.dataset.x);
      const y = parseInt(intersection.dataset.y);
      const stone = intersection.querySelector('.stone');

      if (stone) stone.remove();

      const cellValue = board[y][x];
      if (cellValue !== 0) {
        const stoneColor = cellValue === 1 ? 'black' : 'white';
        const isLastMove =
          moveHistory.length > 0 &&
          moveHistory[moveHistory.length - 1].x === x &&
          moveHistory[moveHistory.length - 1].y === y;

        const newStone = document.createElement('div');
        newStone.className = `stone ${stoneColor}${isLastMove ? ' last-move' : ''}`;
        intersection.appendChild(newStone);
        requestAnimationFrame(() => newStone.classList.add('visible'));
      }
    });
  }

  _bindGestures(goban) {
    const boardWrapper = goban.closest('.board-wrapper');
    if (!boardWrapper) return;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isGesturing = false;
    let isPanning = false;
    let lastTouchDistance = 0;
    let lastTouchCenter = { x: 0, y: 0 };

    boardWrapper.style.overflow = 'hidden';
    boardWrapper.style.touchAction = 'none';
    goban.style.transformOrigin = 'center center';
    goban.style.transition = 'transform 0.1s ease-out';

    const getTouchDistance = touches => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = touches => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const constrainTranslation = () => {
      const gobanRect = goban.getBoundingClientRect();
      const wrapperRect = boardWrapper.getBoundingClientRect();
      const scaledWidth = gobanRect.width;
      const scaledHeight = gobanRect.height;
      const maxTranslateX = Math.max(0, (scaledWidth - wrapperRect.width) / 2 / scale);
      const maxTranslateY = Math.max(0, (scaledHeight - wrapperRect.height) / 2 / scale);
      translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
      translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
    };

    const applyTransform = () => {
      goban.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    boardWrapper.addEventListener(
      'touchstart',
      e => {
        if (e.touches.length === 2) {
          isGesturing = true;
          lastTouchDistance = getTouchDistance(e.touches);
          lastTouchCenter = getTouchCenter(e.touches);
          e.preventDefault();
        } else if (e.touches.length === 1) {
          isPanning = true;
          lastTouchCenter = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      },
      { passive: false }
    );

    boardWrapper.addEventListener(
      'touchmove',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const distance = getTouchDistance(e.touches);
          const scaleDelta = distance / lastTouchDistance;
          scale = Math.max(1, Math.min(3, scale * scaleDelta));
          applyTransform();
          lastTouchDistance = distance;
        } else if (e.touches.length === 1 && isPanning) {
          e.preventDefault();
          const touch = e.touches[0];
          translateX += touch.clientX - lastTouchCenter.x;
          translateY += touch.clientY - lastTouchCenter.y;
          constrainTranslation();
          applyTransform();
          lastTouchCenter = { x: touch.clientX, y: touch.clientY };
        }
      },
      { passive: false }
    );

    boardWrapper.addEventListener('touchend', e => {
      if (e.touches.length < 2) {
        setTimeout(() => {
          isGesturing = false;
        }, 100);
      }
      if (e.touches.length === 0) {
        isPanning = false;
        if (scale <= 1.05) {
          scale = 1;
          translateX = 0;
          translateY = 0;
          applyTransform();
        }
      }
    });

    boardWrapper.addEventListener('dblclick', () => {
      scale = 1;
      translateX = 0;
      translateY = 0;
      applyTransform();
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardRenderer;
}
