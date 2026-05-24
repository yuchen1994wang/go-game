import { EMPTY, BLACK, WHITE, StoneColor, Point, GameState, MoveRecord } from './types';

export class GoEngine {
  size: number;
  board: StoneColor[][];
  currentPlayer: StoneColor;
  moveHistory: MoveRecord[];
  capturedByBlack: number;
  capturedByWhite: number;
  koPoint: Point | null;
  lastMove: Point | null;

  constructor(size = 19) {
    this.size = size;
    this.board = this.createEmptyBoard(size);
    this.currentPlayer = BLACK;
    this.moveHistory = [];
    this.capturedByBlack = 0;
    this.capturedByWhite = 0;
    this.koPoint = null;
    this.lastMove = null;
  }

  private createEmptyBoard(size: number): StoneColor[][] {
    return Array.from({ length: size }, () => Array(size).fill(EMPTY as StoneColor));
  }

  reset(): void {
    this.board = this.createEmptyBoard(this.size);
    this.currentPlayer = BLACK;
    this.moveHistory = [];
    this.capturedByBlack = 0;
    this.capturedByWhite = 0;
    this.koPoint = null;
    this.lastMove = null;
  }

  clone(): GoEngine {
    const engine = new GoEngine(this.size);
    engine.board = this.board.map(row => [...row]);
    engine.currentPlayer = this.currentPlayer;
    engine.moveHistory = [...this.moveHistory];
    engine.capturedByBlack = this.capturedByBlack;
    engine.capturedByWhite = this.capturedByWhite;
    engine.koPoint = this.koPoint ? { ...this.koPoint } : null;
    engine.lastMove = this.lastMove ? { ...this.lastMove } : null;
    return engine;
  }

  getOpponent(player: StoneColor): StoneColor {
    return player === BLACK ? WHITE : BLACK;
  }

  private getNeighbors(x: number, y: number): Point[] {
    const neighbors: Point[] = [];
    if (x > 0) neighbors.push({ x: x - 1, y });
    if (x < this.size - 1) neighbors.push({ x: x + 1, y });
    if (y > 0) neighbors.push({ x, y: y - 1 });
    if (y < this.size - 1) neighbors.push({ x, y: y + 1 });
    return neighbors;
  }

  private findGroup(x: number, y: number, board: StoneColor[][] = this.board): { stones: Point[]; liberties: number } {
    const color = board[y][x];
    if (color === EMPTY) return { stones: [], liberties: 0 };

    const visited = new Set<string>();
    const stones: Point[] = [];
    let liberties = 0;
    const queue: Point[] = [{ x, y }];

    while (queue.length > 0) {
      const p = queue.shift()!;
      const key = `${p.x},${p.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      stones.push(p);

      for (const n of this.getNeighbors(p.x, p.y)) {
        if (board[n.y][n.x] === EMPTY) {
          liberties++;
        } else if (board[n.y][n.x] === color) {
          const nKey = `${n.x},${n.y}`;
          if (!visited.has(nKey)) {
            queue.push(n);
          }
        }
      }
    }

    return { stones, liberties };
  }

  private findCaptures(x: number, y: number, player: StoneColor, board: StoneColor[][]): { captures: Point[]; ko: Point | null } {
    const opponent = this.getOpponent(player);
    const captures: Point[] = [];
    let ko: Point | null = null;

    for (const n of this.getNeighbors(x, y)) {
      if (board[n.y][n.x] === opponent) {
        const group = this.findGroup(n.x, n.y, board);
        if (group.liberties === 0) {
          for (const stone of group.stones) {
            captures.push(stone);
          }
        }
      }
    }

    if (captures.length === 1) {
      ko = { ...captures[0] };
    }

    return { captures, ko };
  }

  private wouldHaveLiberties(x: number, y: number, player: StoneColor, board: StoneColor[][]): boolean {
    const testBoard = board.map(row => [...row]);
    testBoard[y][x] = player;

    const group = this.findGroup(x, y, testBoard);
    if (group.liberties > 0) return true;

    const opponent = this.getOpponent(player);
    for (const n of this.getNeighbors(x, y)) {
      if (testBoard[n.y][n.x] === opponent) {
        const oppGroup = this.findGroup(n.x, n.y, testBoard);
        if (oppGroup.liberties === 0) return true;
      }
    }

    return false;
  }

  isValidMove(x: number, y: number, player: StoneColor = this.currentPlayer): boolean {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
    if (this.board[y][x] !== EMPTY) return false;
    if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) return false;
    if (!this.wouldHaveLiberties(x, y, player, this.board)) return false;
    return true;
  }

  getValidMoves(player: StoneColor = this.currentPlayer): Point[] {
    const moves: Point[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isValidMove(x, y, player)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }

  play(x: number, y: number): boolean {
    if (!this.isValidMove(x, y)) return false;

    const player = this.currentPlayer;
    this.board[y][x] = player;

    const { captures, ko } = this.findCaptures(x, y, player, this.board);
    for (const cap of captures) {
      this.board[cap.y][cap.x] = EMPTY;
    }

    if (player === BLACK) {
      this.capturedByBlack += captures.length;
    } else {
      this.capturedByWhite += captures.length;
    }

    this.koPoint = ko;
    this.lastMove = { x, y };

    this.moveHistory.push({
      x,
      y,
      color: player,
      captured: captures.length,
    });

    this.currentPlayer = this.getOpponent(player);
    return true;
  }

  pass(): void {
    this.moveHistory.push({
      x: -1,
      y: -1,
      color: this.currentPlayer,
      captured: 0,
    });
    this.currentPlayer = this.getOpponent(this.currentPlayer);
    this.koPoint = null;
  }

  undo(): boolean {
    if (this.moveHistory.length === 0) return false;

    this.moveHistory.pop();
    this.reset();

    for (const move of this.moveHistory) {
      if (move.x >= 0 && move.y >= 0) {
        this.board[move.y][move.x] = move.color;
        const opponent = this.getOpponent(move.color);
        for (const n of this.getNeighbors(move.x, move.y)) {
          if (this.board[n.y][n.x] === opponent) {
            const group = this.findGroup(n.x, n.y);
            if (group.liberties === 0) {
              for (const stone of group.stones) {
                this.board[stone.y][stone.x] = EMPTY;
              }
            }
          }
        }
        this.currentPlayer = opponent;
      } else {
        this.currentPlayer = this.getOpponent(move.color);
      }
    }

    return true;
  }

  getState(): GameState {
    return {
      board: this.board.map(row => [...row]),
      currentPlayer: this.currentPlayer,
      moveHistory: [...this.moveHistory],
      capturedByBlack: this.capturedByBlack,
      capturedByWhite: this.capturedByWhite,
      koPoint: this.koPoint ? { ...this.koPoint } : null,
      lastMove: this.lastMove ? { ...this.lastMove } : null,
    };
  }
}
