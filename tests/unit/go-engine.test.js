// GoEngine 单元测试
const BLACK = 1;
const WHITE = 2;

describe('GoEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new GoEngine(19);
  });

  describe('初始化', () => {
    test('默认创建19路棋盘', () => {
      expect(engine.size).toBe(19);
      expect(engine.board.length).toBe(19);
      expect(engine.board[0].length).toBe(19);
    });

    test('创建9路棋盘', () => {
      const small = new GoEngine(9);
      expect(small.size).toBe(9);
    });

    test('初始棋盘为空', () => {
      for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
          expect(engine.board[y][x]).toBe(0);
        }
      }
    });

    test('黑棋先行', () => {
      expect(engine.currentPlayer).toBe(BLACK);
    });
  });

  describe('落子规则', () => {
    test('合法落子', () => {
      expect(engine.play(3, 3)).toBe(true);
      expect(engine.board[3][3]).toBe(BLACK);
    });

    test('落子后切换玩家', () => {
      engine.play(3, 3);
      expect(engine.currentPlayer).toBe(WHITE);
    });

    test('不能落在已有棋子的位置', () => {
      engine.play(3, 3);
      expect(engine.play(3, 3)).toBe(false);
    });

    test('不能落在棋盘外', () => {
      expect(engine.play(-1, 3)).toBe(false);
      expect(engine.play(3, 19)).toBe(false);
      expect(engine.play(19, 3)).toBe(false);
    });

    test('禁着点 - 自杀', () => {
      // 使用 2 路棋盘构造自杀点
      engine = new GoEngine(2);
      engine.play(0, 1); // 黑
      engine.play(0, 0); // 白
      engine.play(1, 0); // 黑
      // 白棋在 (1,1) 落子，被黑棋包围且无法提子，是自杀
      expect(engine.play(1, 1)).toBe(false);
    });
  });

  describe('提子', () => {
    test('提子基本功能', () => {
      // 使用 3 路棋盘，黑棋包围并提掉白棋
      engine = new GoEngine(3);
      engine.play(0, 0); // 黑
      engine.play(0, 1); // 白
      engine.play(1, 1); // 黑
      engine.play(0, 2); // 白
      engine.play(1, 2); // 黑 - 提掉 (0,1) 和 (0,2) 的白棋
      expect(engine.board[0][1]).toBe(0);
      expect(engine.board[0][2]).toBe(0);
      expect(engine.capturedByBlack).toBe(2);
    });

    test('多子提吃', () => {
      // 使用 4 路棋盘，创建一个白棋块并提掉
      engine = new GoEngine(4);
      engine.play(0, 0); engine.play(0, 1); engine.play(0, 2);
      engine.play(0, 3); engine.play(1, 0); engine.play(1, 1);
      engine.play(1, 2); engine.play(1, 3); engine.play(2, 1);
      // 黑9(2,1) 提掉 (0,1) 和 (1,1) 的白棋
      expect(engine.capturedByBlack).toBe(2);
    });
  });

  describe('打劫', () => {
    test('打劫检测', () => {
      // 创建打劫局面
      engine.play(0, 0); // 黑
      engine.play(0, 1); // 白
      engine.play(1, 1); // 黑
      engine.play(1, 2); // 白
      engine.play(0, 2); // 黑 - 提掉 (0,1) 的白棋
      expect(engine.board[0][1]).toBe(0);
      expect(engine.capturedByBlack).toBe(1);
      // 白棋不能立即提回
      expect(engine.isValidMove(0, 1)).toBe(false);
    });
  });

  describe('停一手', () => {
    test('停一手功能', () => {
      engine.pass();
      expect(engine.moveHistory.length).toBe(1);
      expect(engine.moveHistory[0].pass).toBe(true);
      expect(engine.currentPlayer).toBe(WHITE);
    });

    test('连续停两手结束对局', () => {
      engine.pass();
      engine.pass();
      expect(engine.isTwoPasses()).toBe(true);
    });
  });

  describe('形势判断', () => {
    test('棋子计数', () => {
      engine.play(3, 3);
      engine.play(4, 4);
      const count = engine.countStones();
      expect(count.black).toBe(1);
      expect(count.white).toBe(1);
    });

    test('分析局面', () => {
      engine.play(3, 3);
      engine.play(4, 4);
      const analysis = engine.analyzePosition();
      expect(analysis.groups.length).toBe(2);
    });
  });

  describe('克隆', () => {
    test('深拷贝棋盘', () => {
      engine.play(3, 3);
      const clone = engine.clone();
      clone.play(4, 4);
      expect(engine.board[4][4]).toBe(0);
      expect(clone.board[4][4]).toBe(WHITE);
    });
  });
});
