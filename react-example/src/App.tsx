import React, { useState } from 'react';
import type { Board, StoneColor, Point } from '../js/types';

// 常量
const EMPTY: StoneColor = 0;
const BLACK: StoneColor = 1;
const WHITE: StoneColor = 2;

function createBoard(size: number = 19): Board {
  const board: Board = [];
  for (let y = 0; y < size; y++) {
    board[y] = [];
    for (let x = 0; x < size; x++) {
      board[y][x] = EMPTY;
    }
  }
  return board;
}

// 棋盘组件
const BoardComponent: React.FC<{
  size: number;
  board: Board;
  onPlaceStone?: (x: number, y: number) => void;
}> = ({ size, board, onPlaceStone }) => {
  // 响应式计算
  const containerWidth = Math.min(window.innerWidth - 32, 600);
  const cellSize = Math.floor((containerWidth - 60) / (size - 1));
  const boardSize = cellSize * (size - 1) + 60;

  // 计算天元和星位
  const getStarPoints = (): Point[] => {
    if (size === 9) {
      return [{ x: 2, y: 2 }, { x: 2, y: 6 }, { x: 4, y: 4 }, { x: 6, y: 2 }, { x: 6, y: 6 }];
    } else if (size === 13) {
      return [{ x: 3, y: 3 }, { x: 3, y: 9 }, { x: 6, y: 6 }, { x: 9, y: 3 }, { x: 9, y: 9 }];
    } else {
      return [
        { x: 3, y: 3 }, { x: 3, y: 9 }, { x: 3, y: 15 },
        { x: 9, y: 3 }, { x: 9, y: 9 }, { x: 9, y: 15 },
        { x: 15, y: 3 }, { x: 15, y: 9 }, { x: 15, y: 15 }
      ];
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: boardSize,
      height: boardSize,
      background: 'linear-gradient(135deg, #DEB887 0%, #C4A574 100%)',
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      {/* 网格线 */}
      <svg width={boardSize} height={boardSize} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {Array.from({ length: size }).map((_, i) => {
          const pos = 30 + i * cellSize;
          return (
            <React.Fragment key={i}>
              <line
                x1={30}
                y1={pos}
                x2={boardSize - 30}
                y2={pos}
                stroke="#333"
                strokeWidth="1"
                opacity="0.7"
              />
              <line
                x1={pos}
                y1={30}
                x2={pos}
                y2={boardSize - 30}
                stroke="#333"
                strokeWidth="1"
                opacity="0.7"
              />
            </React.Fragment>
          );
        })}
        {/* 星位 */}
        {getStarPoints().map((point, i) => (
          <circle
            key={i}
            cx={30 + point.x * cellSize}
            cy={30 + point.y * cellSize}
            r={size === 9 ? 4 : 3}
            fill="#333"
          />
        ))}
      </svg>

      {/* 点击区域 */}
      {Array.from({ length: size * size }).map((_, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        const stone = board[y][x];
        return (
          <div
            key={`${x}-${y}`}
            onClick={() => onPlaceStone && stone === EMPTY && onPlaceStone(x, y)}
            style={{
              position: 'absolute',
              top: 30 + y * cellSize - cellSize / 2,
              left: 30 + x * cellSize - cellSize / 2,
              width: cellSize,
              height: cellSize,
              cursor: stone === EMPTY ? 'pointer' : 'default',
              zIndex: 10
            }}
          >
            {/* 棋子 */}
            {stone !== EMPTY && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: cellSize * 0.9,
                  height: cellSize * 0.9,
                  borderRadius: '50%',
                  background: stone === BLACK
                    ? 'radial-gradient(circle at 30% 30%, #444 0%, #111 100%)'
                    : 'radial-gradient(circle at 30% 30%, #fff 0%, #ddd 100%)',
                  boxShadow: stone === BLACK
                    ? '2px 3px 6px rgba(0,0,0,0.5)'
                    : '2px 3px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8)',
                  zIndex: 20
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// 主应用
const App: React.FC = () => {
  const [boardSize, setBoardSize] = useState(9);
  const [board, setBoard] = useState<Board>(createBoard(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(BLACK);

  const handlePlaceStone = (x: number, y: number) => {
    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
  };

  const resetGame = () => {
    setBoard(createBoard(boardSize));
    setCurrentPlayer(BLACK);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f5f0e8 0%, #e8e0d5 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontFamily: "'Noto Serif SC', serif",
        color: '#333',
        marginBottom: '20px'
      }}>
        围棋 (Go) - React 示例
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => { const s = 9; setBoardSize(s); setBoard(createBoard(s)); setCurrentPlayer(BLACK); }}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            background: boardSize === 9 ? '#C4A574' : '#ddd',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: boardSize === 9 ? 'white' : '#333',
            fontSize: '14px'
          }}
        >
          9路
        </button>
        <button
          onClick={() => { const s = 13; setBoardSize(s); setBoard(createBoard(s)); setCurrentPlayer(BLACK); }}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            background: boardSize === 13 ? '#C4A574' : '#ddd',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: boardSize === 13 ? 'white' : '#333',
            fontSize: '14px'
          }}
        >
          13路
        </button>
        <button
          onClick={() => { const s = 19; setBoardSize(s); setBoard(createBoard(s)); setCurrentPlayer(BLACK); }}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            background: boardSize === 19 ? '#C4A574' : '#ddd',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: boardSize === 19 ? 'white' : '#333',
            fontSize: '14px'
          }}
        >
          19路
        </button>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '18px' }}>
        当前：
        <span style={{
          fontWeight: 'bold',
          color: currentPlayer === BLACK ? '#111' : '#999'
        }}>
          {currentPlayer === BLACK ? '⚫ 黑棋' : '⚪ 白棋'}
        </span>
      </div>

      <BoardComponent
        size={boardSize}
        board={board}
        onPlaceStone={handlePlaceStone}
      />

      <button
        onClick={resetGame}
        style={{
          marginTop: '20px',
          padding: '10px 24px',
          fontSize: '16px',
          background: '#C4A574',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        重新开始
      </button>
    </div>
  );
};

export default App;
