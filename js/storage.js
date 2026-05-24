/**
 * 数据持久化管理器
 * 使用localStorage存储游戏历史、用户信息
 */
const Storage = {
  HISTORY_KEY: 'go_game_history',
  USERNAME_KEY: 'go_username',

  /**
   * 获取游戏历史记录
   * @returns {Array} 游戏历史数组
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory(history) {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  },

  addGame(gameData) {
    const history = this.getHistory();
    history.unshift({
      id: Date.now(),
      ...gameData,
      timestamp: new Date().toISOString()
    });
    this.saveHistory(history);
  },

  getSavedGames() {
    return this.getHistory();
  },

  getGameById(id) {
    return this.getHistory().find(g => g.id === id);
  },

  deleteGame(id) {
    const history = this.getHistory().filter(g => g.id !== id);
    this.saveHistory(history);
  },

  clearHistory() {
    localStorage.removeItem(this.HISTORY_KEY);
  },

  getUsername() {
    return localStorage.getItem(this.USERNAME_KEY) || '';
  },

  setUsername(username) {
    localStorage.setItem(this.USERNAME_KEY, username);
  },

  clearUserData() {
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
