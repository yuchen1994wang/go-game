import React, { useCallback, useMemo } from 'react';
import { StoneColor, EMPTY, BLACK, WHITE, Point, ThemeName, THEMES } from '../types';

interface BoardProps {
  size: number;
  board: StoneColor[][];
  lastMove: Point | null;
  theme: ThemeName;
  onPlaceStone: (x: number, y: number) => void;
  showCoordinates?: boolean;
}

const Board: React.FC<BoardProps> = ({ size, board, lastMove, theme, onPlaceStone, showCoordinates = true }) => {
  const themeConfig = THEMES[theme];

  const containerWidth = Math.min(window.innerWidth - 32, 600);
  const cellSize = Math.floor((containerWidth - 60) / (size - 1));
  const boardSize = cellSize * (size - 1) + 60;
  const padding = 30;

  const starPoints = useMemo(() => {
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
  }, [size]);

  const coordLetters = useMemo(() => {
    const letters = 'ABCDEFGHJKLMNOPQRST';
    return Array.from({ length: size }, (_, i) => letters[i]);
  }, [size]);

  const coordNumbers = useMemo(() => {
    return Array.from({ length: size }, (_, i) => size - i);
  }, [size]);

  const handleClick = useCallback((x: number, y: number) => {
    if (board[y][x] === EMPTY) {
      onPlaceStone(x, y);
    }
  }, [board, onPlaceStone]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {showCoordinates && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: padding,
            right: padding,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: themeConfig.lineColor,
            opacity: 0.7,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {coordLetters.map((l, i) => <span key={i}>{l}</span>)}
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: padding,
            right: padding,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: themeConfig.lineColor,
            opacity: 0.7,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {coordLetters.map((l, i) => <span key={i}>{l}</span>)}
          </div>
          <div style={{
            position: 'absolute',
            top: padding,
            bottom: padding,
            left: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: themeConfig.lineColor,
            opacity: 0.7,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {coordNumbers.map((n, i) => <span key={i}>{n}</span>)}
          </div>
          <div style={{
            position: 'absolute',
            top: padding,
            bottom: padding,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: themeConfig.lineColor,
            opacity: 0.7,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {coordNumbers.map((n, i) => <span key={i}>{n}</span>)}
          </div>
        </>
      )}

      <div style={{
        position: 'relative',
        width: boardSize,
        height: boardSize,
        background: `linear-gradient(145deg, ${themeConfig.boardColorLight} 0%, ${themeConfig.boardColor} 50%, ${themeConfig.boardColorDark} 100%)`,
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        margin: '20px'
      }}>
        <svg width={boardSize} height={boardSize} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          {Array.from({ length: size }).map((_, i) => {
            const pos = padding + i * cellSize;
            return (
              <React.Fragment key={i}>
                <line x1={padding} y1={pos} x2={boardSize - padding} y2={pos} stroke={themeConfig.lineColor} strokeWidth="1" opacity="0.7" />
                <line x1={pos} y1={padding} x2={pos} y2={boardSize - padding} stroke={themeConfig.lineColor} strokeWidth="1" opacity="0.7" />
              </React.Fragment>
            );
          })}
          {starPoints.map((point, i) => (
            <circle
              key={i}
              cx={padding + point.x * cellSize}
              cy={padding + point.y * cellSize}
              r={size === 9 ? 4 : 3}
              fill={themeConfig.lineColor}
            />
          ))}
        </svg>

        {Array.from({ length: size * size }).map((_, i) => {
          const x = i % size;
          const y = Math.floor(i / size);
          const stone = board[y][x];
          const isLastMove = lastMove && lastMove.x === x && lastMove.y === y;

          return (
            <div
              key={`${x}-${y}`}
              onClick={() => handleClick(x, y)}
              style={{
                position: 'absolute',
                top: padding + y * cellSize - cellSize / 2,
                left: padding + x * cellSize - cellSize / 2,
                width: cellSize,
                height: cellSize,
                cursor: stone === EMPTY ? 'pointer' : 'default',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {stone !== EMPTY && (
                <div style={{
                  width: cellSize * 0.9,
                  height: cellSize * 0.9,
                  borderRadius: '50%',
                  background: stone === BLACK
                    ? 'radial-gradient(circle at 30% 30%, #444 0%, #111 100%)'
                    : 'radial-gradient(circle at 30% 30%, #fff 0%, #ddd 100%)',
                  boxShadow: stone === BLACK
                    ? '2px 3px 6px rgba(0,0,0,0.5)'
                    : '2px 3px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8)',
                  position: 'relative'
                }}>
                  {isLastMove && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '30%',
                      height: '30%',
                      borderRadius: '50%',
                      background: '#C41E3A',
                      boxShadow: '0 0 4px rgba(196, 30, 58, 0.6)'
                    }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
