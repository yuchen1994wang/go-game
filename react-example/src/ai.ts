import { GoEngine } from './engine';
import { Point, StoneColor, BLACK, WHITE } from './types';

export class LocalAI {
  static DIFFICULTY_EASY = 1;
  static DIFFICULTY_MEDIUM = 2;
  static DIFFICULTY_HARD = 3;

  difficulty: number;

  constructor(difficulty = LocalAI.DIFFICULTY_MEDIUM) {
    this.difficulty = difficulty;
  }

  getMove(engine: GoEngine): Point | { pass: true } {
    const moves = engine.getValidMoves();
    if (moves.length === 0) return { pass: true };

    switch (this.difficulty) {
      case LocalAI.DIFFICULTY_EASY:
        return this.getEasyMove(engine, moves);
      case LocalAI.DIFFICULTY_MEDIUM:
        return this.getMediumMove(engine, moves);
      case LocalAI.DIFFICULTY_HARD:
        return this.getHardMove(engine, moves);
      default:
        return this.getEasyMove(engine, moves);
    }
  }

  private getEasyMove(engine: GoEngine, moves: Point[]): Point {
    const center = Math.floor(engine.size / 2);
    const nearCenter = moves.filter(m => Math.abs(m.x - center) + Math.abs(m.y - center) <= Math.floor(engine.size / 2) + 1);
    const candidates = nearCenter.length > 0 ? nearCenter : moves;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  private getMediumMove(engine: GoEngine, moves: Point[]): Point {
    const player = engine.currentPlayer;
    const opponent = player === BLACK ? WHITE : BLACK;
    const scoredMoves = moves.map(move => {
      let score = 0;

      const testEngine = engine.clone();
      testEngine.play(move.x, move.y);

      if (testEngine.capturedByBlack > engine.capturedByBlack || testEngine.capturedByWhite > engine.capturedByWhite) {
        score += 100;
      }

      const center = Math.floor(engine.size / 2);
      const dist = Math.abs(move.x - center) + Math.abs(move.y - center);
      score += Math.max(0, 20 - dist);

      if (this.isOnThirdLine(move.x, move.y, engine.size)) score += 15;
      if (this.isOnFourthLine(move.x, move.y, engine.size)) score += 10;

      if (this.hasNeighbor(engine, move.x, move.y, player)) score += 20;

      return { move, score };
    });

    scoredMoves.sort((a, b) => b.score - a.score);
    const topCandidates = scoredMoves.slice(0, Math.max(3, Math.floor(scoredMoves.length * 0.3)));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)].move;
  }

  private getHardMove(engine: GoEngine, moves: Point[]): Point {
    const player = engine.currentPlayer;
    const scoredMoves = moves.map(move => {
      let score = 0;

      const testEngine = engine.clone();
      testEngine.play(move.x, move.y);

      if (testEngine.capturedByBlack > engine.capturedByBlack || testEngine.capturedByWhite > engine.capturedByWhite) {
        score += 150;
      }

      const center = Math.floor(engine.size / 2);
      const dist = Math.abs(move.x - center) + Math.abs(move.y - center);
      score += Math.max(0, 30 - dist * 2);

      if (this.isOnThirdLine(move.x, move.y, engine.size)) score += 25;
      if (this.isOnFourthLine(move.x, move.y, engine.size)) score += 20;

      if (this.hasNeighbor(engine, move.x, move.y, player)) score += 30;

      const opponentMoves = testEngine.getValidMoves();
      if (opponentMoves.length > 0) {
        const opponentBest = opponentMoves.reduce((best, om) => {
          const oppEngine = testEngine.clone();
          oppEngine.play(om.x, om.y);
          const capture = oppEngine.capturedByBlack > testEngine.capturedByBlack || oppEngine.capturedByWhite > testEngine.capturedByWhite;
          return capture ? om : best;
        }, opponentMoves[0]);

        const oppTest = testEngine.clone();
        oppTest.play(opponentBest.x, opponentBest.y);
        if (oppTest.capturedByBlack > testEngine.capturedByBlack || oppTest.capturedByWhite > testEngine.capturedByWhite) {
          score -= 80;
        }
      }

      return { move, score };
    });

    scoredMoves.sort((a, b) => b.score - a.score);
    const topCandidates = scoredMoves.slice(0, Math.max(2, Math.floor(scoredMoves.length * 0.15)));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)].move;
  }

  private isOnThirdLine(x: number, y: number, size: number): boolean {
    return x === 2 || x === size - 3 || y === 2 || y === size - 3;
  }

  private isOnFourthLine(x: number, y: number, size: number): boolean {
    return x === 3 || x === size - 4 || y === 3 || y === size - 4;
  }

  private hasNeighbor(engine: GoEngine, x: number, y: number, color: StoneColor): boolean {
    const neighbors = [
      { x: x - 1, y }, { x: x + 1, y },
      { x, y: y - 1 }, { x, y: y + 1 }
    ];
    return neighbors.some(n =>
      n.x >= 0 && n.x < engine.size && n.y >= 0 && n.y < engine.size &&
      engine.board[n.y][n.x] === color
    );
  }
}
