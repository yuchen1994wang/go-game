// go-utils.js 工具函数测试
const GoUtils = require('../../js/go-utils.js');

describe('GoUtils 工具函数', () => {
  describe('常量', () => {
    test('BLACK 为 1', () => {
      expect(GoUtils.BLACK).toBe(1);
    });

    test('WHITE 为 2', () => {
      expect(GoUtils.WHITE).toBe(2);
    });

    test('EMPTY 为 0', () => {
      expect(GoUtils.EMPTY).toBe(0);
    });

    test('DEFAULT_KOMI 为 6.5', () => {
      expect(GoUtils.DEFAULT_KOMI).toBe(6.5);
    });

    test('AI_LEVELS 包含所有级别', () => {
      expect(GoUtils.AI_LEVELS).toEqual({
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard',
        EXPERT: 'expert'
      });
    });
  });

  describe('getNeighbors', () => {
    test('中心点有4个邻居', () => {
      const neighbors = GoUtils.getNeighbors(5, 5, 9);
      expect(neighbors.length).toBe(4);
      expect(neighbors).toContainEqual([4, 5]);
      expect(neighbors).toContainEqual([6, 5]);
      expect(neighbors).toContainEqual([5, 4]);
      expect(neighbors).toContainEqual([5, 6]);
    });

    test('角落点只有2个邻居', () => {
      const neighbors = GoUtils.getNeighbors(0, 0, 9);
      expect(neighbors.length).toBe(2);
      expect(neighbors).toContainEqual([1, 0]);
      expect(neighbors).toContainEqual([0, 1]);
    });

    test('边缘点有3个邻居', () => {
      const neighbors = GoUtils.getNeighbors(0, 5, 9);
      expect(neighbors.length).toBe(3);
    });

    test('9路棋盘边缘', () => {
      const neighbors = GoUtils.getNeighbors(8, 5, 9);
      expect(neighbors.length).toBe(3);
    });
  });

  describe('isValidPosition', () => {
    test('有效位置', () => {
      expect(GoUtils.isValidPosition(0, 0, 9)).toBe(true);
      expect(GoUtils.isValidPosition(8, 8, 9)).toBe(true);
      expect(GoUtils.isValidPosition(4, 4, 9)).toBe(true);
    });

    test('超出边界', () => {
      expect(GoUtils.isValidPosition(-1, 0, 9)).toBe(false);
      expect(GoUtils.isValidPosition(0, -1, 9)).toBe(false);
      expect(GoUtils.isValidPosition(9, 0, 9)).toBe(false);
      expect(GoUtils.isValidPosition(0, 9, 9)).toBe(false);
    });
  });

  describe('posKey', () => {
    test('生成正确的键', () => {
      expect(GoUtils.posKey(0, 0)).toBe('0,0');
      expect(GoUtils.posKey(5, 10)).toBe('5,10');
    });
  });

  describe('getOpponent', () => {
    test('BLACK 的对手是 WHITE', () => {
      expect(GoUtils.getOpponent(GoUtils.BLACK)).toBe(GoUtils.WHITE);
    });

    test('WHITE 的对手是 BLACK', () => {
      expect(GoUtils.getOpponent(GoUtils.WHITE)).toBe(GoUtils.BLACK);
    });
  });

  describe('isBlack 和 isWhite', () => {
    test('isBlack', () => {
      expect(GoUtils.isBlack(GoUtils.BLACK)).toBe(true);
      expect(GoUtils.isBlack(GoUtils.WHITE)).toBe(false);
      expect(GoUtils.isBlack(0)).toBe(false);
    });

    test('isWhite', () => {
      expect(GoUtils.isWhite(GoUtils.WHITE)).toBe(true);
      expect(GoUtils.isWhite(GoUtils.BLACK)).toBe(false);
      expect(GoUtils.isWhite(0)).toBe(false);
    });
  });

  describe('getPlayerName', () => {
    test('返回正确的名称', () => {
      expect(GoUtils.getPlayerName(GoUtils.BLACK)).toBe('黑棋');
      expect(GoUtils.getPlayerName(GoUtils.WHITE)).toBe('白棋');
    });
  });

  describe('createEmptyBoard', () => {
    test('创建正确大小的棋盘', () => {
      const board9 = GoUtils.createEmptyBoard(9);
      expect(board9.length).toBe(9);
      expect(board9[0].length).toBe(9);

      const board13 = GoUtils.createEmptyBoard(13);
      expect(board13.length).toBe(13);
      expect(board13[0].length).toBe(13);

      const board19 = GoUtils.createEmptyBoard(19);
      expect(board19.length).toBe(19);
      expect(board19[0].length).toBe(19);
    });

    test('所有位置都是 EMPTY', () => {
      const board = GoUtils.createEmptyBoard(5);
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          expect(board[y][x]).toBe(GoUtils.EMPTY);
        }
      }
    });
  });

  describe('cloneBoard', () => {
    test('深拷贝棋盘', () => {
      const original = [
        [0, 1, 2],
        [1, 0, 1],
        [2, 1, 0]
      ];
      const clone = GoUtils.cloneBoard(original);
      
      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
      expect(clone[0]).not.toBe(original[0]);
    });

    test('修改克隆不影响原棋盘', () => {
      const original = GoUtils.createEmptyBoard(3);
      const clone = GoUtils.cloneBoard(original);
      clone[0][0] = GoUtils.BLACK;
      
      expect(original[0][0]).toBe(GoUtils.EMPTY);
      expect(clone[0][0]).toBe(GoUtils.BLACK);
    });
  });

  describe('generateBoardHash', () => {
    test('生成唯一哈希', () => {
      const board1 = [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      const board2 = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 0, 0]
      ];

      const hash1 = GoUtils.generateBoardHash(board1);
      const hash2 = GoUtils.generateBoardHash(board2);

      expect(hash1).not.toBe(hash2);
    });

    test('相同棋盘生成相同哈希', () => {
      const board = [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];

      const hash1 = GoUtils.generateBoardHash(board);
      const hash2 = GoUtils.generateBoardHash(board);

      expect(hash1).toBe(hash2);
    });
  });
});
