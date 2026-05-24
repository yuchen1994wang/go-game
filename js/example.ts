// 示例：使用 TypeScript 类型

/**
 * 简单的围棋游戏示例
 */

import type { Point, StoneColor, Board, TsumegoProblem } from './types';

// 常量定义
const EMPTY: StoneColor = 0;
const BLACK: StoneColor = 1;
const WHITE: StoneColor = 2;

/**
 * 创建一个空棋盘
 */
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

/**
 * 放置棋子
 */
function placeStone(board: Board, x: number, y: number, color: StoneColor): Board {
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = color;
  return newBoard;
}

/**
 * 检查死活题答案
 */
function checkTsumegoAnswer(problem: TsumegoProblem, x: number, y: number): boolean {
  return problem.correctMoves.some(move => move.x === x && move.y === y);
}

// 示例用法
const exampleBoard = createBoard(9);
const boardWithBlack = placeStone(exampleBoard, 4, 4, BLACK);
console.log('示例棋盘:', boardWithBlack);

// 导出
export {
  createBoard,
  placeStone,
  checkTsumegoAnswer,
  EMPTY,
  BLACK,
  WHITE
};
