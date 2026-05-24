// go-engine.js 高级功能测试
const GoEngine = require('../../js/go-engine.js');

const BLACK = 1;
const WHITE = 2;

describe('GoEngine 高级功能', () => {
  let engine;

  beforeEach(() => {
    engine = new GoEngine(9);
  });

  describe('reset', () => {
    test('重置游戏状态', () => {
      engine.play(3, 3);
      engine.play(4, 4);
      engine.reset();
      expect(engine.board[3][3]).toBe(0);
      expect(engine.board[4][4]).toBe(0);
      expect(engine.currentPlayer).toBe(BLACK);
      expect(engine.moveHistory.length).toBe(0);
    });
  });

  describe('analyzePosition', () => {
    test('分析空棋盘', () => {
      const analysis = engine.analyzePosition();
      expect(analysis.groups.length).toBe(0);
      expect(analysis.moveCount).toBe(0);
    });

    test('分析有棋子的局面', () => {
      engine.play(3, 3);
      engine.play(4, 4);
      const analysis = engine.analyzePosition();
      expect(analysis.groups.length).toBe(2);
      expect(analysis.moveCount).toBe(2);
    });

    test('分析返回正确的下一手', () => {
      engine.play(3, 3);
      const analysis = engine.analyzePosition();
      expect(analysis.nextPlayer).toBe(WHITE);
    });
  });

  describe('pass 和 isTwoPasses', () => {
    test('停一手', () => {
      engine.pass();
      expect(engine.moveHistory.length).toBe(1);
      expect(engine.moveHistory[0].pass).toBe(true);
      expect(engine.currentPlayer).toBe(WHITE);
    });

    test('连续停两手', () => {
      engine.pass();
      engine.pass();
      expect(engine.isTwoPasses()).toBe(true);
    });

    test('停一后落子不触发两停', () => {
      engine.pass();
      engine.play(3, 3);
      expect(engine.isTwoPasses()).toBe(false);
    });
  });

  describe('countStones', () => {
    test('空棋盘没有棋子', () => {
      const count = engine.countStones();
      expect(count.black).toBe(0);
      expect(count.white).toBe(0);
    });

    test('统计棋子数量', () => {
      engine.play(3, 3);
      engine.play(4, 4);
      const count = engine.countStones();
      expect(count.black).toBe(1);
      expect(count.white).toBe(1);
    });
  });

  describe('禁着点规则', () => {
    test('自杀点不允许落子', () => {
      const small = new GoEngine(2);
      small.play(0, 1);
      small.play(0, 0);
      small.play(1, 0);
      
      expect(small.isValidMove(1, 1)).toBe(false);
    });

    test('能提子的点允许落子', () => {
      engine.play(1, 0);
      engine.play(0, 1);
      engine.play(0, 0);
      
      expect(engine.isValidMove(1, 1)).toBe(true);
    });
  });

  describe('边界情况', () => {
    test('角落点邻居', () => {
      expect(engine.isValidMove(0, 0)).toBe(true);
    });

    test('越界检查', () => {
      expect(engine.isValidMove(-1, 0)).toBe(false);
      expect(engine.isValidMove(0, -1)).toBe(false);
      expect(engine.isValidMove(9, 0)).toBe(false);
      expect(engine.isValidMove(0, 9)).toBe(false);
    });
  });

  describe('clone', () => {
    test('克隆完全独立', () => {
      engine.play(3, 3);
      const clone = engine.clone();
      clone.play(4, 4);
      
      expect(engine.board[4][4]).toBe(0);
      expect(clone.board[4][4]).toBe(WHITE);
    });

    test('克隆保留状态', () => {
      engine.play(3, 3);
      engine.play(4, 4);
      const clone = engine.clone();
      
      expect(clone.currentPlayer).toBe(BLACK);
      expect(clone.moveHistory.length).toBe(2);
    });
  });
});
