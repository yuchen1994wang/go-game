// game.js 基础功能测试
const GoGame = require('../../js/game.js');

describe('GoGame 基础功能', () => {
  let game;

  beforeEach(() => {
    game = new GoGame(9);
  });

  describe('getEmptyArea', () => {
    test('返回连续的空区域', () => {
      game.makeMove(2, 2);
      const area = game.getEmptyArea(4, 4);
      expect(area.length).toBeGreaterThan(1);
    });

    test('处理边界情况', () => {
      const area = game.getEmptyArea(0, 0);
      expect(area).toBeDefined();
      expect(Array.isArray(area)).toBe(true);
    });
  });

  describe('游戏状态', () => {
    test('isGameOver 检测游戏结束', () => {
      expect(game.isGameOver).toBe(false);
    });

    test('pass 增加连续停手次数', () => {
      game.pass();
      expect(game.passCount).toBe(1);
    });
  });

  describe('边界情况', () => {
    test('在角落落子', () => {
      const result = game.makeMove(8, 8);
      expect(result.success).toBe(true);
      expect(game.board[8][8]).toBe(1);
    });
  });
});
