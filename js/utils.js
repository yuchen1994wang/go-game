/**
 * 工具函数和基础管理器
 * 提供通用的工具函数和全局错误处理
 */

/**
 * 显示Toast提示消息
 * @param {string} message - 提示消息内容
 * @param {string} [type='info'] - 消息类型：'info' | 'success' | 'error' | 'warning'
 * @returns {void}
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/**
 * 创建Toast容器
 * @returns {HTMLElement} 容器元素
 * @private
 */
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

/**
 * 防抖函数 - 延迟执行函数，减少调用频率
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 * @example
 * const debouncedSearch = debounce(search, 300);
 * input.addEventListener('input', debouncedSearch);
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 显示全屏错误边界
 * 用于捕获未处理的错误并向用户显示友好提示
 * @param {string} message - 错误消息
 * @returns {void}
 */
function showErrorBoundary(message) {
  let boundary = document.getElementById('errorBoundary');
  if (!boundary) {
    boundary = document.createElement('div');
    boundary.id = 'errorBoundary';
    boundary.className = 'error-boundary';
    boundary.innerHTML = `
      <div class="error-boundary-icon">⚠️</div>
      <div class="error-boundary-title">出错了</div>
      <div class="error-boundary-message" id="errorBoundaryMsg"></div>
      <button class="error-boundary-btn" onclick="window.location.reload()">刷新页面</button>
    `;
    document.body.appendChild(boundary);
  }
  document.getElementById('errorBoundaryMsg').textContent = message;
  boundary.classList.add('active');
}

// 全局错误处理
window.addEventListener('error', (e) => {
  console.error('全局错误:', e.error);
  showToast('发生错误，请刷新页面重试', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的Promise错误:', e.reason);
  showToast('操作失败，请重试', 'error');
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showToast, debounce, showErrorBoundary };
}
