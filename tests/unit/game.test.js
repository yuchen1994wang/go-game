// GoGame 单元测试
const GoGame = require('../../js/game.js');

describe('GoGame', () => {
  let game;

  beforeEach(() => {
    game = new GoGame(19);
  });

  describe('初始化', () => {
    test('默认创建19路棋盘', () => {
      expect(game.size).toBe(19);
      expect(game.board.length).toBe(19);
    });

    test('创建13路棋盘', () => {
      const g13 = new GoGame(13);
      expect(g13.size).toBe(13);
    });

    test('初始状态', () => {
      expect(game.currentPlayer).toBe(1);
      expect(game.isGameOver).toBe(false);
      expect(game.moveHistory.length).toBe(0);
      expect(game.passCount).toBe(0);
    });
  });

  describe('落子', () => {
    test('合法落子', () => {
      const result = game.makeMove(3, 3);
      expect(result.success).toBe(true);
      expect(game.board[3][3]).toBe(1);
    });

    test('落子后切换玩家', () => {
      game.makeMove(3, 3);
      expect(game.currentPlayer).toBe(2);
    });

    test('重复落子失败', () => {
      game.makeMove(3, 3);
      const result = game.makeMove(3, 3);
      expect(result.success).toBe(false);
      expect(result.message).toContain('已有棋子');
    });

    test('棋盘外落子失败', () => {
      expect(game.makeMove(-1, 0).success).toBe(false);
      expect(game.makeMove(0, 19).success).toBe(false);
    });

    test('禁着点', () => {
      // 使用 2 路棋盘构造自杀点
      game = new GoGame(2);
      game.makeMove(0, 1); // 黑1 (0,1)
      game.makeMove(0, 0); // 白2 (0,0)
      game.makeMove(1, 0); // 黑3 (1,0)
      // 棋盘：
      // y=0: O X
      // y=1: . X
      // 白棋在 (1,1) 落子，被黑棋包围且无法提子，是自杀
      const result = game.makeMove(1, 1);
      expect(result.success).toBe(false);
      expect(result.message).toContain('禁着');
    });

    test('游戏结束后不能落子', () => {
      game.isGameOver = true;
      const result = game.makeMove(3, 3);
      expect(result.success).toBe(false);
    });
  });

  describe('提子', () => {
    test('提子计数', () => {
      // 黑棋包围 (1,1) 白棋
      game.makeMove(1, 0); // (1,0) 黑
      game.makeMove(1, 1); // (1,1) 白
      game.makeMove(0, 1); // (0,1) 黑
      game.makeMove(3, 3); // 白
      game.makeMove(2, 1); // (2,1) 黑
      game.makeMove(4, 4); // 白
      game.makeMove(1, 2); // (1,2) 黑 - 提掉 (1,1)
      
      expect(game.board[1][1]).toBe(0);
    });

    test('打劫规则', () => {
      // 使用 3 路棋盘构造打劫局面
      game = new GoGame(3);

      // 黑1(0,0)
      game.makeMove(0, 0);
      // 白2(0,1)
      game.makeMove(0, 1);
      // 黑3(1,1)
      game.makeMove(1, 1);
      // 白4(1,2)
      game.makeMove(1, 2);
      // 黑5(0,2) - 提掉白2(0,1)，形成打劫
      const captureMove = game.makeMove(0, 2);
      expect(captureMove.captures.length).toBe(1);
      expect(captureMove.captures[0]).toEqual([0, 1]);
      expect(game.koPoint).toEqual({ x: 0, y: 1 });

      // 白棋不能立即在 (0,1) 落子（打劫禁着）
      const result = game.makeMove(0, 1);
      expect(result.success).toBe(false);
      expect(result.message).toContain('打劫');
    });
  });

  describe('停一手', () => {
    test('停一手', () => {
      const result = game.pass();
      expect(result.success).toBe(true);
      expect(game.currentPlayer).toBe(2);
    });

    test('连续停两手结束', () => {
      game.pass();
      const result = game.pass();
      expect(result.gameOver).toBe(true);
      expect(game.isGameOver).toBe(true);
    });
  });

  describe('悔棋', () => {
    test('悔棋恢复棋盘', () => {
      game.makeMove(3, 3);
      game.makeMove(4, 4);
      expect(game.undo()).toBe(true);
      expect(game.board[4][4]).toBe(0);
      expect(game.currentPlayer).toBe(2);
    });

    test('悔棋恢复提子', () => {
      game.makeMove(1, 0);
      game.makeMove(1, 1);
      game.makeMove(0, 1);
      game.makeMove(3, 3);
      game.makeMove(2, 1);
      game.makeMove(4, 4);
      game.makeMove(1, 2); // 提子
      
      expect(game.board[1][1]).toBe(0);
      game.undo();
      expect(game.board[1][1]).toBe(2);
    });

    test('空历史不能悔棋', () => {
      expect(game.undo()).toBe(false);
    });
  });

  describe('数棋', () => {
    test('空棋盘', () => {
      const score = game.calculateScore(6.5);
      expect(score.winner).toBe('white'); // 白有贴目，应该赢
    });

    test('有棋子无领地', () => {
      game.makeMove(3, 3);
      game.makeMove(4, 4);
      const score = game.calculateScore(6.5);
      expect(score.black).toBeGreaterThan(0);
      expect(score.white).toBeGreaterThan(0);
    });
  });

  describe('SGF导出', () => {
    test('基本SGF格式', () => {
      game.setPlayerNames('张三', '李四');
      game.makeMove(3, 3);
      game.makeMove(4, 4);
      const sgf = game.toSGF();
      expect(sgf).toContain('FF[4]');
      expect(sgf).toContain('PB[张三]');
      expect(sgf).toContain('PW[李四]');
      expect(sgf).toContain('B[dd]');
      expect(sgf).toContain('W[ee]');
    });
  });

  describe('复盘模式', () => {
    test('获取指定步数的棋盘', () => {
      game.makeMove(3, 3);
      game.makeMove(4, 4);
      game.makeMove(5, 5);
      const board = game.getBoardForReview(2);
      expect(board[3][3]).toBe(1);
      expect(board[4][4]).toBe(2);
      expect(board[5][5]).toBe(0);
    });
  });
});
