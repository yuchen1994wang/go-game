/**
 * Web Worker 管理器
 * 用于在后台线程执行计算密集型任务
 */

class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.callbacks = new Map();
    this.workerId = 0;
  }

  /**
   * 创建 Web Worker
   * @param {string} name - Worker名称
   * @param {string} workerPath - Worker脚本路径
   * @returns {Worker} Worker实例
   */
  create(name, workerPath) {
    if (this.workers.has(name)) {
      console.warn(`Worker "${name}" already exists, reusing existing worker`);
      return this.workers.get(name);
    }

    const worker = new Worker(workerPath);
    const workerId = this.workerId++;

    worker.onmessage = (event) => {
      const { id, error, data } = event.data;
      const callback = this.callbacks.get(id);

      if (callback) {
        if (error) {
          callback.reject(new Error(error));
        } else {
          callback.resolve(data);
        }
        this.callbacks.delete(id);
      }
    };

    worker.onerror = (error) => {
      console.error(`Worker "${name}" error:`, error);
    };

    this.workers.set(name, worker);
    return worker;
  }

  /**
   * 向 Worker 发送消息并获取响应
   * @param {string} name - Worker名称
   * @param {any} message - 发送给Worker的消息
   * @param {number} [timeout=30000] - 超时时间（毫秒）
   * @returns {Promise<any>} Worker响应
   */
  postMessage(name, message, timeout = 30000) {
    const worker = this.workers.get(name);
    if (!worker) {
      return Promise.reject(new Error(`Worker "${name}" not found`));
    }

    return new Promise((resolve, reject) => {
      const id = Date.now() + Math.random();
      const timeoutId = setTimeout(() => {
        this.callbacks.delete(id);
        reject(new Error(`Worker "${name}" message timeout`));
      }, timeout);

      this.callbacks.set(id, {
        resolve: (data) => {
          clearTimeout(timeoutId);
          resolve(data);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      });

      worker.postMessage({ id, ...message });
    });
  }

  /**
   * 终止 Worker
   * @param {string} name - Worker名称
   */
  terminate(name) {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }

  /**
   * 终止所有 Worker
   */
  terminateAll() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
    this.callbacks.clear();
  }

  /**
   * 获取 Worker 状态
   * @param {string} name - Worker名称
   * @returns {Object} Worker状态信息
   */
  getStatus(name) {
    const worker = this.workers.get(name);
    if (!worker) {
      return { exists: false };
    }

    return {
      exists: true,
      busy: this.getBusyWorkers().includes(name)
    };
  }

  /**
   * 获取所有忙碌的 Worker
   * @returns {string[]} 忙碌的Worker名称数组
   */
  getBusyWorkers() {
    return Array.from(this.callbacks.values()).map((cb, index) => {
      const keys = Array.from(this.callbacks.keys());
      return keys[index];
    });
  }
}

const workerManager = new WorkerManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WorkerManager, workerManager };
}
