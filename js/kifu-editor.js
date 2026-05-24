// 棋谱编辑器
class KifuEditor {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.size = options.size || 19;
    this.moves = [];
    this.currentMoveIndex = -1;
    this.comments = {};
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="kifu-editor-container">
        <div class="kifu-board-area">
          <div id="kifuBoardContainer"></div>
        </div>
        <div class="kifu-controls">
          <div class="kifu-moves-list" id="movesList"></div>
          <div class="kifu-buttons">
            <button id="btnFirst" class="btn btn-secondary" title="第一步">⏮️</button>
            <button id="btnPrev" class="btn btn-secondary" title="上一步">◀️</button>
            <button id="btnNext" class="btn btn-secondary" title="下一步">▶️</button>
            <button id="btnLast" class="btn btn-secondary" title="最后一步">⏭️</button>
            <button id="btnClear" class="btn btn-secondary" title="清空">🗑️</button>
          </div>
          <div class="kifu-comment" id="moveComment"></div>
        </div>
      </div>
      <style>
        .kifu-editor-container {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          height: calc(100vh - 200px);
          min-height: 500px;
        }
        .kifu-board-area {
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--panel-bg);
          border-radius: 12px;
          padding: 20px;
        }
        .kifu-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .kifu-moves-list {
          flex: 1;
          overflow-y: auto;
          background: var(--panel-bg);
          border-radius: 12px;
          padding: 16px;
        }
        .move-item {
          padding: 8px 12px;
          margin-bottom: 4px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .move-item:hover {
          background: var(--bg-secondary);
        }
        .move-item.current {
          background: var(--accent-gold);
          color: white;
        }
        .kifu-buttons {
          display: flex;
          gap: 8px;
        }
        .kifu-buttons button {
          flex: 1;
          padding: 10px;
        }
        .kifu-comment {
          background: var(--panel-bg);
          border-radius: 12px;
          padding: 16px;
          min-height: 100px;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        @media (max-width: 900px) {
          .kifu-editor-container {
            grid-template-columns: 1fr;
            height: auto;
          }
          .kifu-board-area {
            aspect-ratio: 1;
          }
        }
      </style>
    `;

    this.boardContainer = document.getElementById('kifuBoardContainer');
    this.movesListEl = document.getElementById('movesList');
    this.moveCommentEl = document.getElementById('moveComment');
    this.initBoard();
    this.bindEvents();
  }

  initBoard() {
    this.board = new BoardComponent('kifuBoardContainer', {
      size: this.size,
      autoSize: true,
      showMoveNumbers: true,
      onIntersectionClick: (x, y) => this.addMove(x, y)
    });
  }

  bindEvents() {
    document.getElementById('btnFirst').addEventListener('click', () => this.goToMove(0));
    document.getElementById('btnPrev').addEventListener('click', () => this.prevMove());
    document.getElementById('btnNext').addEventListener('click', () => this.nextMove());
    document.getElementById('btnLast').addEventListener('click', () => this.goToMove(this.moves.length - 1));
    document.getElementById('btnClear').addEventListener('click', () => this.clearKifu());
  }

  addMove(x, y) {
    const color = this.moves.length % 2 === 0 ? 1 : 2;
    const moveNumber = this.moves.length + 1;
    
    this.moves = this.moves.slice(0, this.currentMoveIndex + 1);
    this.moves.push({ x, y, color, moveNumber });
    this.currentMoveIndex = this.moves.length - 1;
    
    this.replayToMove(this.currentMoveIndex);
    this.updateMovesList();
  }

  replayToMove(index) {
    if (index < 0 || index >= this.moves.length) return;

    this.board.clear();
    
    for (let i = 0; i <= index; i++) {
      const move = this.moves[i];
      this.board.placeStone(move.x, move.y, move.color, move.moveNumber);
    }

    this.updateComment(index);
    this.highlightCurrentMove(index);
  }

  updateMovesList() {
    this.movesListEl.innerHTML = this.moves.map((move, i) => `
      <div class="move-item ${i === this.currentMoveIndex ? 'current' : ''}" 
           onclick="window.kifuEditor && window.kifuEditor.goToMove(${i})">
        <span style="font-weight:600;">${move.moveNumber}.</span>
        <span style="color:${move.color === 1 ? '#333' : '#999'}">
          ${move.color === 1 ? '⚫' : '⚪'} ${String.fromCharCode(65 + move.x)}${move.y + 1}
        </span>
      </div>
    `).join('');
  }

  updateComment(index) {
    const comment = this.comments[index + 1] || '暂无注释';
    this.moveCommentEl.innerHTML = `<strong>第${index + 1}手：</strong>${comment}`;
  }

  highlightCurrentMove(index) {
    const items = this.movesListEl.querySelectorAll('.move-item');
    items.forEach((item, i) => {
      item.classList.toggle('current', i === index);
    });
  }

  goToMove(index) {
    this.currentMoveIndex = index;
    this.replayToMove(index);
    this.highlightCurrentMove(index);
  }

  prevMove() {
    if (this.currentMoveIndex > 0) {
      this.goToMove(this.currentMoveIndex - 1);
    }
  }

  nextMove() {
    if (this.currentMoveIndex < this.moves.length - 1) {
      this.goToMove(this.currentMoveIndex + 1);
    }
  }

  clearKifu() {
    if (confirm('确定要清空所有着法吗？')) {
      this.moves = [];
      this.currentMoveIndex = -1;
      this.comments = {};
      this.board.clear();
      this.updateMovesList();
      this.moveCommentEl.innerHTML = '暂无注释';
    }
  }

  exportKifu() {
    return {
      size: this.size,
      moves: this.moves,
      comments: this.comments,
      createdAt: new Date().toISOString()
    };
  }

  importKifu(data) {
    if (data && data.moves) {
      this.moves = data.moves;
      this.comments = data.comments || {};
      this.currentMoveIndex = -1;
      this.updateMovesList();
      this.replayToMove(0);
    }
  }
}
