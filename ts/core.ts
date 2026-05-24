/*
 * 围棋引擎 - TypeScript 版本
 */

export type Player = 1 | 2;
export type Board = (0 | 1 | 2)[][];
export type Position = { x: number; y: number };
export type Move = Position | { pass: true };
export type Group = {
  stones: Position[];
  liberties: number;
};

export class GoEngineTS {
  boardSize: number;
  board: Board;
  history: Board[];

  constructor(size: number = 19) {
    this.boardSize = size;
    this.board = this.createEmptyBoard();
    this.history = [];
  }

  createEmptyBoard(): Board {
    return Array(this.boardSize).fill(null).map(() => 
      Array(this.boardSize).fill(0)
    );
  }

  isValidMove(x: number, y: number, player: Player): boolean {
    if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) return false;
    if (this.board[y][x] !== 0) return false;

    const boardCopy = this.copyBoard(this.board);
    boardCopy[y][x] = player;

    const opponent = player === 1 ? 2 : 1;
    let captured = false;
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize && 
          boardCopy[ny][nx] === opponent) {
        const group = this.getGroup(boardCopy, nx, ny);
        if (group.liberties === 0) {
          captured = true;
          for (const stone of group.stones) {
            boardCopy[stone.y][stone.x] = 0;
          }
        }
      }
    }

    if (!captured) {
      const group = this.getGroup(boardCopy, x, y);
      if (group.liberties === 0) return false;
    }

    for (const historyBoard of this.history.slice(-2)) {
      if (this.boardsEqual(boardCopy, historyBoard)) {
        return false;
      }
    }

    return true;
  }

  placeStone(x: number, y: number, player: Player): boolean {
    if (!this.isValidMove(x, y, player)) return false;

    this.history.push(this.copyBoard(this.board));
    if (this.history.length > 10) {
      this.history.shift();
    }

    this.board[y][x] = player;
    const opponent = player === 1 ? 2 : 1;
    let capturedStones = 0;
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize && 
          this.board[ny][nx] === opponent) {
        const group = this.getGroup(this.board, nx, ny);
        if (group.liberties === 0) {
          capturedStones += group.stones.length;
          for (const stone of group.stones) {
            this.board[stone.y][stone.x] = 0;
          }
        }
      }
    }

    return true;
  }

  getGroup(board: Board, x: number, y: number): Group {
    const color = board[y][x];
    if (!color) return { stones: [], liberties: 0 };

    const visited = Array(this.boardSize).fill(null).map(() => 
      Array(this.boardSize).fill(false)
    );
    const group: Position[] = [];
    const liberties = new Set<string>();

    const stack: Position[] = [{ x, y }];
    visited[y][x] = true;

    while (stack.length > 0) {
      const pos = stack.pop()!;
      group.push(pos);

      const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize) {
          if (!visited[ny][nx]) {
            if (board[ny][nx] === color) {
              visited[ny][nx] = true;
              stack.push({ x: nx, y: ny });
            } else if (board[ny][nx] === 0) {
              liberties.add(`${nx},${ny}`);
            }
          }
        }
      }
    }

    return { stones: group, liberties: liberties.size };
  }

  copyBoard(board: Board): Board {
    return board.map(row => [...row]);
  }

  boardsEqual(board1: Board, board2: Board): boolean {
    if (board1.length !== board2.length) return false;
    for (let y = 0; y < board1.length; y++) {
      for (let x = 0; x < board1[y].length; x++) {
        if (board1[y][x] !== board2[y][x]) {
          return false;
        }
      }
    }
    return true;
  }

  reset(): void {
    this.board = this.createEmptyBoard();
    this.history = [];
  }
}

export default GoEngineTS;
