/**
 * 全局错误处理模块
 * 提供统一的错误捕获、日志记录和用户反馈
 */
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
    this.init();
  }

  init() {
    // 捕获全局未处理错误
    window.addEventListener('error', (e) => {
      this.handleError(e.error, 'global');
      return false;
    });

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (e) => {
      this.handleError(e.reason, 'promise');
      return false;
    });
  }

  handleError(error, type = 'unknown') {
    const errorInfo = {
      message: error?.message || String(error),
      stack: error?.stack || '',
      type,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // 存储错误日志
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // 保存到localStorage
    this.saveErrors();

    // 显示用户友好的错误提示
    this.showUserFeedback(errorInfo);

    // 控制台输出
    console.error(`[${type}]`, error);
  }

  saveErrors() {
    try {
      localStorage.setItem('go_game_errors', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('无法保存错误日志:', e);
    }
  }

  loadErrors() {
    try {
      const stored = localStorage.getItem('go_game_errors');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('无法加载错误日志:', e);
    }
  }

  showUserFeedback(errorInfo) {
    // 根据错误类型显示不同的提示
    let message = '操作失败，请重试';
    const type = 'error';

    if (errorInfo.type === 'network') {
      message = '网络连接失败，请检查网络后重试';
    } else if (errorInfo.type === 'storage') {
      message = '存储空间不足，请清理后重试';
    } else if (errorInfo.type === 'ai') {
      message = 'AI思考出错，请重新开始对局';
    }

    if (typeof showToast === 'function') {
      showToast(message, type);
    } else {
      alert(message);
    }
  }

  // 包装异步函数，自动捕获错误
  async wrapAsync(fn, context = '') {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, context);
      throw error;
    }
  }

  // 包装同步函数，自动捕获错误
  wrapSync(fn, context = '') {
    try {
      return fn();
    } catch (error) {
      this.handleError(error, context);
      throw error;
    }
  }

  // 获取错误统计
  getStats() {
    const stats = {
      total: this.errors.length,
      byType: {},
      recent: this.errors.slice(-10)
    };

    this.errors.forEach(err => {
      stats.byType[err.type] = (stats.byType[err.type] || 0) + 1;
    });

    return stats;
  }

  // 清除错误日志
  clear() {
    this.errors = [];
    localStorage.removeItem('go_game_errors');
  }
}

// 创建全局实例
const errorHandler = new ErrorHandler();

// 便捷函数
function safeAsync(fn, context = '') {
  return errorHandler.wrapAsync(fn, context);
}

function safeSync(fn, context = '') {
  return errorHandler.wrapSync(fn, context);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ErrorHandler, errorHandler, safeAsync, safeSync };
}
