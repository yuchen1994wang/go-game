/**
 * IndexedDB 数据库管理器
 * 提供比localStorage更强大的数据存储能力，包括：
 * - 更大的存储空间
 * - 支持索引查询
 * - 支持事务
 * - 支持二进制数据
 * @example
 * const db = new IndexedDBManager('MyDB', 1);
 * await db.open();
 * await db.add('games', { result: 'win', moves: 100 });
 */
class IndexedDBManager {
  /**
   * 创建数据库管理器实例
   * @param {string} [dbName='GoGameDB'] - 数据库名称
   * @param {number} [version=1] - 数据库版本号
   */
  constructor(dbName = 'GoGameDB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  /**
   * 打开数据库连接
   * @returns {Promise<IDBDatabase>} 数据库实例
   */
  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('games')) {
          const gameStore = db.createObjectStore('games', { keyPath: 'id', autoIncrement: true });
          gameStore.createIndex('date', 'date', { unique: false });
          gameStore.createIndex('result', 'result', { unique: false });
          gameStore.createIndex('player', 'player', { unique: false });
        }

        if (!db.objectStoreNames.contains('tsumego')) {
          const tsumegoStore = db.createObjectStore('tsumego', { keyPath: 'id', autoIncrement: true });
          tsumegoStore.createIndex('category', 'category', { unique: false });
          tsumegoStore.createIndex('difficulty', 'difficulty', { unique: false });
          tsumegoStore.createIndex('solved', 'solved', { unique: false });
        }

        if (!db.objectStoreNames.contains('patterns')) {
          const patternStore = db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
          patternStore.createIndex('type', 'type', { unique: false });
          patternStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('kifu')) {
          const kifuStore = db.createObjectStore('kifu', { keyPath: 'id', autoIncrement: true });
          kifuStore.createIndex('date', 'date', { unique: false });
          kifuStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * 添加数据到指定存储区
   * @param {string} storeName - 存储区名称
   * @param {Object} data - 要添加的数据
   * @returns {Promise<number>} 新记录的ID
   */
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const dataWithTimestamp = {
        ...data,
        createdAt: new Date().toISOString()
      };
      const request = store.add(dataWithTimestamp);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新或插入数据
   * @param {string} storeName - 存储区名称
   * @param {Object} data - 要更新的数据
   * @returns {Promise<any>} 记录的键
   */
  async put(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 根据ID获取单条记录
   * @param {string} storeName - 存储区名称
   * @param {number} id - 记录ID
   * @returns {Promise<Object>} 记录数据
   */
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取存储区所有记录
   * @param {string} storeName - 存储区名称
   * @returns {Promise<Array>} 所有记录的数组
   */
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 通过索引查询记录
   * @param {string} storeName - 存储区名称
   * @param {string} indexName - 索引名称
   * @param {any} value - 索引值
   * @returns {Promise<Array>} 匹配的记录数组
   */
  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除指定ID的记录
   * @param {string} storeName - 存储区名称
   * @param {number} id - 记录ID
   * @returns {Promise<void>}
   */
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清空存储区所有记录
   * @param {string} storeName - 存储区名称
   * @returns {Promise<void>}
   */
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 统计存储区记录数量
   * @param {string} storeName - 存储区名称
   * @returns {Promise<number>} 记录数量
   */
  async count(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 使用自定义函数查询记录
   * @param {string} storeName - 存储区名称
   * @param {Function} filterFn - 过滤函数
   * @returns {Promise<Array>} 过滤后的记录数组
   */
  async query(storeName, filterFn) {
    const allData = await this.getAll(storeName);
    return allData.filter(filterFn);
  }

  /**
   * 导出所有数据为JSON对象
   * @returns {Promise<Object>} 包含所有存储区数据的对象
   */
  async exportData() {
    const data = {};
    const storeNames = ['games', 'tsumego', 'patterns', 'kifu', 'stats'];

    for (const storeName of storeNames) {
      if (this.db.objectStoreNames.contains(storeName)) {
        data[storeName] = await this.getAll(storeName);
      }
    }

    return data;
  }

  /**
   * 从JSON对象导入数据
   * @param {Object} data - 要导入的数据对象
   * @returns {Promise<void>}
   */
  async importData(data) {
    const storeNames = Object.keys(data);

    for (const storeName of storeNames) {
      await this.clear(storeName);
      for (const item of data[storeName]) {
        await this.put(storeName, item);
      }
    }
  }
}

const db = new IndexedDBManager();

/**
 * 初始化数据库连接
 * @returns {Promise<boolean>} 是否初始化成功
 */
async function initDB() {
  try {
    await db.open();
    console.log('IndexedDB initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IndexedDBManager,
    db,
    initDB
  };
}
