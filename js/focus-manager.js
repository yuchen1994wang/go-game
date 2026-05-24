/**
 * 焦点管理模块
 * 提供键盘导航、焦点陷阱、ESC关闭等功能
 */
class FocusManager {
  constructor() {
    this.trapStack = [];
    this.init();
  }

  init() {
    // 全局键盘监听
    document.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // 添加全局焦点样式
    this.addFocusStyles();
  }

  // 处理键盘事件
  handleKeydown(e) {
    // ESC 关闭弹窗或退出焦点陷阱
    if (e.key === 'Escape') {
      this.handleEscape();
    }

    // Tab 键在焦点陷阱内循环
    if (e.key === 'Tab' && this.trapStack.length > 0) {
      this.handleTab(e);
    }
  }

  // ESC 处理
  handleEscape() {
    // 关闭最上层的焦点陷阱
    if (this.trapStack.length > 0) {
      const trap = this.trapStack[this.trapStack.length - 1];
      if (trap.onEscape) {
        trap.onEscape();
      }
    }

    // 关闭设置弹窗
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal && settingsModal.classList.contains('show')) {
      settingsModal.classList.remove('show');
      // 恢复焦点到设置按钮
      const settingsBtn = document.querySelector('[data-action="settings"]');
      if (settingsBtn) {settingsBtn.focus();}
    }
  }

  // Tab 键处理
  handleTab(e) {
    const trap = this.trapStack[this.trapStack.length - 1];
    if (!trap) {return;}

    const focusableElements = this.getFocusableElements(trap.container);
    if (focusableElements.length === 0) {return;}

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift+Tab：向前
      if (activeElement === firstElement || !trap.container.contains(activeElement)) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab：向后
      if (activeElement === lastElement || !trap.container.contains(activeElement)) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  // 开始焦点陷阱
  startTrap(container, options = {}) {
    // 保存当前焦点
    const previousFocus = document.activeElement;

    const trap = {
      container,
      previousFocus,
      onEscape: options.onEscape || null,
      returnFocus: options.returnFocus !== false
    };

    this.trapStack.push(trap);

    // 将焦点设置到第一个可聚焦元素
    setTimeout(() => {
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 0);
  }

  // 结束焦点陷阱
  endTrap() {
    const trap = this.trapStack.pop();
    if (trap && trap.returnFocus && trap.previousFocus) {
      trap.previousFocus.focus();
    }
  }

  // 获取可聚焦元素
  getFocusableElements(container) {
    const selectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selectors))
      .filter(el => this.isVisible(el));
  }

  // 检查元素是否可见
  isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           element.style.display !== 'none' && 
           element.style.visibility !== 'hidden';
  }

  // 添加全局焦点样式
  addFocusStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 焦点样式 - 仅键盘导航时显示 */
      :focus-visible {
        outline: 2px solid var(--accent-gold);
        outline-offset: 2px;
      }
      
      /* 按钮焦点 */
      button:focus-visible,
      .btn:focus-visible {
        outline: 2px solid var(--accent-gold);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(196, 163, 90, 0.3);
      }
      
      /* 链接焦点 */
      a:focus-visible {
        outline: 2px solid var(--accent-gold);
        outline-offset: 2px;
      }
      
      /* 输入框焦点 */
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 2px solid var(--accent-gold);
        outline-offset: 0;
        border-color: var(--accent-gold);
      }
      
      /* 棋盘交叉点焦点 */
      .intersection:focus-visible {
        outline: 2px solid var(--accent-gold);
        outline-offset: -2px;
        border-radius: 50%;
      }
      
      /* 隐藏鼠标点击时的焦点样式 */
      :focus:not(:focus-visible) {
        outline: none;
      }
      
      /* 跳过链接 - 用于快速导航 */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--accent-gold);
        color: white;
        padding: 8px 16px;
        z-index: 10000;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 0;
        outline: none;
      }
    `;
    document.head.appendChild(style);
  }

  // 添加跳过链接
  addSkipLink(targetId, text = '跳过导航，直接进入主内容') {
    const existingSkipLink = document.querySelector('.skip-link');
    if (existingSkipLink) {return;}

    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = text;
    skipLink.setAttribute('aria-label', text);
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // 使元素可聚焦
  makeFocusable(element, tabindex = 0) {
    element.setAttribute('tabindex', tabindex);
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', element.textContent || '可点击元素');
  }

  // 为棋盘交叉点添加键盘支持
  enableBoardKeyboardNavigation(boardContainer, onMove) {
    const intersections = boardContainer.querySelectorAll('.intersection');
    const currentIndex = 0;

    intersections.forEach((intersection, index) => {
      intersection.setAttribute('tabindex', index === 0 ? '0' : '-1');
      intersection.setAttribute('role', 'gridcell');
      intersection.setAttribute('aria-label', `交叉点 ${intersection.dataset.x}, ${intersection.dataset.y}`);

      intersection.addEventListener('keydown', (e) => {
        const size = Math.sqrt(intersections.length);
        let newIndex = index;

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            newIndex = Math.max(0, index - size);
            break;
          case 'ArrowDown':
            e.preventDefault();
            newIndex = Math.min(intersections.length - 1, index + size);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            newIndex = Math.max(0, index - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            newIndex = Math.min(intersections.length - 1, index + 1);
            break;
          case 'Enter':
          case ' ': {
            e.preventDefault();
            const x = parseInt(intersection.dataset.x);
            const y = parseInt(intersection.dataset.y);
            if (onMove) {onMove(x, y);}
            return;
          }
        }

        if (newIndex !== index) {
          intersection.setAttribute('tabindex', '-1');
          intersections[newIndex].setAttribute('tabindex', '0');
          intersections[newIndex].focus();
        }
      });
    });
  }
}

// 创建全局实例
const focusManager = new FocusManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FocusManager, focusManager };
}
