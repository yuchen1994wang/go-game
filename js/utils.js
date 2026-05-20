// 工具函数和基础管理器

// Toast 提示
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

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// 防抖函数
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

// 错误边界 - 显示全屏错误遮罩
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
