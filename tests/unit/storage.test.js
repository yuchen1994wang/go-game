// Storage 单元测试
describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('历史记录', () => {
    test('获取空历史', () => {
      expect(Storage.getHistory()).toEqual([]);
    });

    test('添加对局', () => {
      const game = { size: 19, result: '黑胜' };
      const history = Storage.addGame(game);
      expect(history.length).toBe(1);
      expect(history[0].size).toBe(19);
      expect(history[0].result).toBe('黑胜');
      expect(history[0].id).toBeDefined();
    });

    test('获取历史记录', () => {
      Storage.addGame({ size: 19 });
      Storage.addGame({ size: 13 });
      const history = Storage.getHistory();
      expect(history.length).toBe(2);
    });

    test('删除对局', () => {
      const result = Storage.addGame({ size: 19 });
      const id = result[0].id;
      Storage.deleteGame(id);
      expect(Storage.getHistory().length).toBe(0);
    });

    test('清空历史', () => {
      Storage.addGame({ size: 19 });
      Storage.clearHistory();
      expect(Storage.getHistory()).toEqual([]);
    });
  });

  describe('用户名', () => {
    test('保存和获取用户名', () => {
      Storage.saveUsername('张三');
      expect(Storage.getUsername()).toBe('张三');
    });

    test('未设置用户名返回null', () => {
      expect(Storage.getUsername()).toBeNull();
    });
  });

  describe('死活题进度', () => {
    test('保存和获取进度', () => {
      const progress = { 1: { solved: true, attempts: 3 } };
      Storage.saveTsumegoProgress(progress);
      expect(Storage.getTsumegoProgress()).toEqual(progress);
    });

    test('未设置进度返回空对象', () => {
      expect(Storage.getTsumegoProgress()).toEqual({});
    });
  });

  describe('兼容旧方法', () => {
    test('getSavedGames 别名', () => {
      Storage.addGame({ size: 19 });
      expect(Storage.getSavedGames().length).toBe(1);
    });
  });

  describe('错误处理', () => {
    test('损坏的数据返回默认值', () => {
      localStorage.setItem('go_game_history', 'invalid json');
      expect(Storage.getHistory()).toEqual([]);
    });

    test('损坏的死活题进度返回空对象', () => {
      localStorage.setItem('go_tsumego_progress', 'not json');
      expect(Storage.getTsumegoProgress()).toEqual({});
    });
  });
});
