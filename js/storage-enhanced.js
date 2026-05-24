/**
 * 增强版数据持久化管理器
 * 支持 IndexedDB 和 localStorage 双后端存储
 */

const StorageEnhanced = {
  HISTORY_KEY: 'go_game_history',
  USERNAME_KEY: 'go_username',
  TSUMEGO_KEY: 'go_tsumego_progress',
  SETTINGS_KEY: 'go_settings',
  
  _dbReady: false,
  _dbPromise: null,
  
  /**
   * 初始化存储系统
   * 优先使用 IndexedDB，降级到 localStorage
   */
  async init() {
    if (this._dbReady) return true;
    
    // 如果已经有初始化中的 Promise，等待它完成
    if (this._dbPromise) {
      return this._dbPromise;
    }
    
    // 尝试初始化 IndexedDB
    this._dbPromise = this._initIndexedDB();
    
    try {
      await this._dbPromise;
      this._dbReady = true;
      console.log('✅ Storage: IndexedDB 初始化成功');
      
      // 迁移旧数据（如果有）
      await this._migrateFromLocalStorage();
      
      return true;
    } catch (error) {
      console.warn('⚠️ Storage: IndexedDB 不可用，降级到 localStorage', error);
      this._dbReady = false;
      return false;
    }
  },
  
  /**
   * 初始化 IndexedDB
   */
  async _initIndexedDB() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB 不可用'));
        return;
      }
      
      const request = indexedDB.open('GoGameDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = (event) => {
        this._db = event.target.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 创建游戏历史存储
        if (!db.objectStoreNames.contains('games')) {
          const gamesStore = db.createObjectStore('games', { keyPath: 'id', autoIncrement: true });
          gamesStore.createIndex('date', 'date', { unique: false });
          gamesStore.createIndex('result', 'result', { unique: false });
        }
        
        // 创建死活题进度存储
        if (!db.objectStoreNames.contains('tsumego')) {
          const tsumegoStore = db.createObjectStore('tsumego', { keyPath: 'id' });
          tsumegoStore.createIndex('difficulty', 'difficulty', { unique: false });
        }
        
        // 创建设置存储
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  },
  
  /**
   * 从 localStorage 迁移旧数据到 IndexedDB
   */
  async _migrateFromLocalStorage() {
    try {
      const oldHistory = localStorage.getItem(this.HISTORY_KEY);
      if (oldHistory) {
        const history = JSON.parse(oldHistory);
        if (Array.isArray(history) && history.length > 0) {
          console.log('🔄 Storage: 正在迁移历史数据...');
          for (const game of history) {
            await this._dbAddGame(game);
          }
          console.log('✅ Storage: 历史数据迁移完成');
        }
      }
      
      const oldTsumego = localStorage.getItem(this.TSUMEGO_KEY);
      if (oldTsumego) {
        const progress = JSON.parse(oldTsumego);
        await this._dbSetTsumegoProgress(progress);
      }
    } catch (error) {
      console.error('⚠️ Storage: 数据迁移失败', error);
    }
  },
  
  // ==================== IndexedDB 操作 ====================
  
  async _dbGetGames() {
    const db = this._db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['games'], 'readonly');
      const store = transaction.objectStore('games');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  async _dbAddGame(gameData) {
    const db = this._db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['games'], 'readwrite');
      const store = transaction.objectStore('games');
      
      const dataToStore = {
        ...gameData,
        id: gameData.id || Date.now(),
        savedAt: gameData.savedAt || new Date().toISOString()
      };
      
      const request = store.put(dataToStore);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  async _dbDeleteGame(id) {
    const db = this._db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['games'], 'readwrite');
      const store = transaction.objectStore('games');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  async _dbGetTsumegoProgress() {
    const db = this._db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tsumego'], 'readonly');
      const store = transaction.objectStore('tsumego');
      const request = store.getAll();
      
      request.onsuccess = () => {
        // 把结果转换回对象格式
        const progress = {};
        request.result.forEach(item => {
          progress[item.id] = item;
        });
        resolve(progress);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async _dbSetTsumegoProgress(progress) {
    const db = this._db;
    const transaction = db.transaction(['tsumego'], 'readwrite');
    const store = transaction.objectStore('tsumego');
    
    // 清空现有数据
    store.clear();
    
    // 写入新数据
    for (const [id, item] of Object.entries(progress)) {
      store.put({ id, ...item });
    }
    
    return Promise.resolve();
  },
  
  // ==================== 公共 API ====================
  
  /**
   * 获取游戏历史记录
   * @returns {Promise<Array>} 游戏历史数组
   */
  async getHistory() {
    if (this._dbReady) {
      try {
        const games = await this._dbGetGames();
        // 按时间倒序排列
        return games.sort((a, b) => new Date(b.savedAt || b.date) - new Date(a.savedAt || a.date));
      } catch (error) {
        console.error('Storage: IndexedDB 读取失败，回退到 localStorage', error);
      }
    }
    
    // 降级方案：localStorage
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  
  /**
   * 保存游戏历史
   * @param {Array} history 游戏历史数组
   */
  async saveHistory(history) {
    if (this._dbReady) {
      try {
        // 完全重写数据库
        await this._dbClearGames();
        for (const game of history) {
          await this._dbAddGame(game);
        }
        return;
      } catch (error) {
        console.error('Storage: IndexedDB 写入失败，回退到 localStorage', error);
      }
    }
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  },
  
  /**
   * 添加一局游戏
   * @param {Object} gameData 游戏数据
   * @returns {Promise<Array>} 更新后的游戏历史
   */
  async addGame(gameData) {
    const newGame = {
      id: Date.now(),
      ...gameData,
      savedAt: new Date().toISOString()
    };
    
    if (this._dbReady) {
      try {
        await this._dbAddGame(newGame);
        return await this.getHistory();
      } catch (error) {
        console.error('Storage: IndexedDB 添加失败，回退到 localStorage', error);
      }
    }
    
    const history = await this.getHistory();
    history.unshift(newGame);
    await this.saveHistory(history);
    return history;
  },
  
  /**
   * 删除一局游戏
   * @param {number|string} id 游戏ID
   * @returns {Promise<Array>} 更新后的游戏历史
   */
  async deleteGame(id) {
    if (this._dbReady) {
      try {
        await this._dbDeleteGame(id);
        return await this.getHistory();
      } catch (error) {
        console.error('Storage: IndexedDB 删除失败，回退到 localStorage', error);
      }
    }
    
    const history = await this.getHistory().filter(g => g.id !== id);
    await this.saveHistory(history);
    return history;
  },
  
  /**
   * 清空游戏历史
   */
  async clearHistory() {
    if (this._dbReady) {
      try {
        await this._dbClearGames();
        return;
      } catch (error) {
        console.error('Storage: IndexedDB 清空失败', error);
      }
    }
    
    localStorage.removeItem(this.HISTORY_KEY);
  },
  
  /**
   * 兼容旧方法名
   */
  async getSavedGames() {
    return await this.getHistory();
  },
  
  /**
   * 获取用户名
   * @returns {string|null} 用户名
   */
  getUsername() {
    return localStorage.getItem(this.USERNAME_KEY);
  },
  
  /**
   * 保存用户名
   * @param {string} name 用户名
   */
  saveUsername(name) {
    localStorage.setItem(this.USERNAME_KEY, name);
  },
  
  /**
   * 获取死活题进度
   * @returns {Promise<Object>} 死活题进度
   */
  async getTsumegoProgress() {
    if (this._dbReady) {
      try {
        return await this._dbGetTsumegoProgress();
      } catch (error) {
        console.error('Storage: IndexedDB 读取死活题失败', error);
      }
    }
    
    try {
      const data = localStorage.getItem(this.TSUMEGO_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  
  /**
   * 保存死活题进度
   * @param {Object} progress 进度对象
   */
  async saveTsumegoProgress(progress) {
    if (this._dbReady) {
      try {
        await this._dbSetTsumegoProgress(progress);
        return;
      } catch (error) {
        console.error('Storage: IndexedDB 保存死活题失败', error);
      }
    }
    
    localStorage.setItem(this.TSUMEGO_KEY, JSON.stringify(progress));
  },
  
  /**
   * 清空用户数据
   */
  async clearUserData() {
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
    localStorage.removeItem(this.TSUMEGO_KEY);
    
    if (this._dbReady) {
      try {
        await this._dbClearGames();
        await this._dbClearTsumego();
      } catch (error) {
        console.error('Storage: IndexedDB 清空用户数据失败', error);
      }
    }
  },
  
  // ==================== 辅助方法 ====================
  
  async _dbClearGames() {
    const db = this._db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['games'], 'readwrite');
      const store = transaction.objectStore('games');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  async _dbClearTsumego() {
    const db = this._db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tsumego'], 'readwrite');
      const store = transaction.objectStore('tsumego');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  /**
   * 获取存储状态
   */
  getStatus() {
    return {
      usingIndexedDB: this._dbReady,
      usingLocalStorage: !this._dbReady,
      backend: this._dbReady ? 'IndexedDB' : 'localStorage'
    };
  },
  
  /**
   * 导出所有数据
   */
  async exportData() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      history: await this.getHistory(),
      username: this.getUsername(),
      tsumego: await this.getTsumegoProgress(),
      status: this.getStatus()
    };
  },
  
  /**
   * 导入数据
   */
  async importData(data) {
    if (data.username) {
      this.saveUsername(data.username);
    }
    if (data.history) {
      await this.saveHistory(data.history);
    }
    if (data.tsumego) {
      await this.saveTsumegoProgress(data.tsumego);
    }
  }
};

// 为了向后兼容，保持原有同步 API
const LegacyStorage = {
  HISTORY_KEY: 'go_game_history',
  USERNAME_KEY: 'go_username',
  TSUMEGO_KEY: 'go_tsumego_progress',
  
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
  
  getSavedGames() {
    return this.getHistory();
  },
  
  getUsername() {
    return localStorage.getItem(this.USERNAME_KEY);
  },
  
  saveUsername(name) {
    localStorage.setItem(this.USERNAME_KEY, name);
  },
  
  clearUserData() {
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
    localStorage.removeItem(this.TSUMEGO_KEY);
  },
  
  getTsumegoProgress() {
    try {
      const data = localStorage.getItem(this.TSUMEGO_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  
  saveTsumegoProgress(progress) {
    localStorage.setItem(this.TSUMEGO_KEY, JSON.stringify(progress));
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageEnhanced, LegacyStorage };
}
