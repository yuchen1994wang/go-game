/**
 * 加载状态组件
 * 提供统一的加载动画和过渡效果
 */
class LoadingManager {
  constructor() {
    this.loadingElements = new Map();
    this.defaultOptions = {
      type: 'spinner', // spinner, dots, pulse
      text: '加载中...',
      overlay: true,
      timeout: 30000 // 30秒超时
    };
  }

  show(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`容器 #${containerId} 不存在`);
      return;
    }

    const config = { ...this.defaultOptions, ...options };
    
    // 创建加载元素
    const loadingEl = document.createElement('div');
    loadingEl.className = `loading-overlay loading-${config.type}`;
    loadingEl.id = `loading-${containerId}`;
    loadingEl.innerHTML = this.getLoadingHTML(config);
    
    // 样式
    loadingEl.style.cssText = `
      position: ${config.overlay ? 'absolute' : 'relative'};
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: ${config.overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
      z-index: 1000;
      transition: opacity 0.3s ease;
    `;

    if (config.overlay) {
      container.style.position = 'relative';
    }
    
    container.appendChild(loadingEl);
    this.loadingElements.set(containerId, loadingEl);

    // 设置超时
    if (config.timeout > 0) {
      setTimeout(() => {
        this.hide(containerId);
      }, config.timeout);
    }

    return loadingEl;
  }

  hide(containerId) {
    const loadingEl = this.loadingElements.get(containerId);
    if (loadingEl) {
      loadingEl.style.opacity = '0';
      setTimeout(() => {
        loadingEl.remove();
        this.loadingElements.delete(containerId);
      }, 300);
    }
  }

  hideAll() {
    this.loadingElements.forEach((el, id) => {
      this.hide(id);
    });
  }

  getLoadingHTML(config) {
    const spinners = {
      spinner: `
        <div class="loading-spinner" style="
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        "></div>
      `,
      dots: `
        <div class="loading-dots" style="display: flex; gap: 8px;">
          <div style="width: 12px; height: 12px; background: var(--accent-gold); border-radius: 50%; animation: bounce 0.6s ease-in-out infinite;"></div>
          <div style="width: 12px; height: 12px; background: var(--accent-gold); border-radius: 50%; animation: bounce 0.6s ease-in-out 0.1s infinite;"></div>
          <div style="width: 12px; height: 12px; background: var(--accent-gold); border-radius: 50%; animation: bounce 0.6s ease-in-out 0.2s infinite;"></div>
        </div>
      `,
      pulse: `
        <div class="loading-pulse" style="
          width: 40px;
          height: 40px;
          background: var(--accent-gold);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        "></div>
      `
    };

    return `
      ${spinners[config.type] || spinners.spinner}
      <p style="margin-top: 16px; color: var(--text-secondary); font-size: 0.9rem;">${config.text}</p>
    `;
  }

  // 页面过渡动画
  pageTransition(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-primary);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // 淡出
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      
      setTimeout(() => {
        if (callback) {callback();}
        
        // 淡入
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }, 300);
    });
  }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.5; }
    100% { transform: scale(0.8); opacity: 1; }
  }
`;
document.head.appendChild(style);

// 创建全局实例
const loadingManager = new LoadingManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LoadingManager, loadingManager };
}
