// 数据持久化
const Storage = {
  HISTORY_KEY: 'go_game_history',
  USERNAME_KEY: 'go_username',

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
      savedAt: new Date().toISOString()
    });
    this.saveHistory(history);
    return history;
  },

  deleteGame(id) {
    const history = this.getHistory().filter(g => g.id !== id);
    this.saveHistory(history);
    return history;
  },

  clearHistory() {
    localStorage.removeItem(this.HISTORY_KEY);
  },

  getUsername() {
    return localStorage.getItem(this.USERNAME_KEY);
  },

  saveUsername(name) {
    localStorage.setItem(this.USERNAME_KEY, name);
  }
};
