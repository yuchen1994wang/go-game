// 通用顶栏组件
class Header {
  static render(options = {}) {
    const {
      showLogo = false,
      backUrl = null,
      backText = '← 返回',
      showSettings = true,
      showUser = true
    } = options;

    let leftHtml = '';
    if (showLogo) {
      leftHtml = `
        <a href="home.html" class="logo">
          <div class="logo-icon"></div>
          <h1>围棋对练</h1>
        </a>
      `;
    } else if (backUrl) {
      leftHtml = `<a href="${backUrl}" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">${backText}</a>`;
    }

    let rightHtml = '';
    if (showSettings || showUser) {
      rightHtml = '<div style="display: flex; align-items: center; gap: 12px;">';
      if (showSettings) {
        rightHtml += `<button class="btn btn-secondary" id="settingsBtn" title="设置" aria-label="设置" style="padding: 8px 14px; font-size: 0.85rem;">⚙️</button>`;
      }
      if (showUser) {
        rightHtml += `
          <div class="user-menu" id="userMenu" title="点击退出登录">
            <span>👤</span>
            <span class="user-name" id="userName">棋手</span>
            <span class="logout-icon">🚪</span>
          </div>
        `;
      }
      rightHtml += '</div>';
    }

    const headerClass = showLogo ? 'header' : 'header';
    const headerTag = showLogo ? 'header' : 'div';

    return `
      <${headerTag} class="${headerClass}">
        <div class="header-left">
          ${leftHtml}
        </div>
        ${rightHtml}
      </${headerTag}>
    `;
  }

  static mount(container, options = {}) {
    container.innerHTML = this.render(options);
    this.init(options);
  }

  static init(options = {}) {
    // 初始化主题
    ThemeManager.init();

    // 加载用户信息
    this.loadUserInfo();

    // 初始化设置模态框（如果有）
    if (options.showSettings) {
      this.initSettingsModal();
    }
  }

  static loadUserInfo() {
    const username = Storage.getUsername();
    if (username) {
      const userNameEl = document.getElementById('userName');
      const userAvatarEl = document.getElementById('userAvatar');
      if (userNameEl) {userNameEl.textContent = username;}
      if (userAvatarEl) {userAvatarEl.textContent = username.charAt(0).toUpperCase();}
    }
  }

  static initSettingsModal() {
    // 如果页面已有设置模态框，不重复创建
    if (document.getElementById('settingsModal')) {
      this.bindSettingsEvents();
      return;
    }

    // 创建设置模态框 HTML
    const modalHtml = `
      <div class="modal-overlay" id="settingsModal" style="display: none;">
        <div class="modal" style="max-width: 500px;">
          <div class="modal-header">
            <h2 class="modal-title">⚙️ 设置</h2>
            <button class="modal-close" id="closeSettings">&times;</button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <h3>🎨 外观与声音</h3>
              
              <!-- 棋盘主题选择 -->
              <div class="theme-selector">
                <label class="settings-label">棋盘主题</label>
                <div class="theme-options" id="boardThemeOptions">
                  <button class="theme-option" data-theme="classic" title="经典木纹">
                    <span class="theme-icon">🪵</span>
                    <span class="theme-name">经典木纹</span>
                  </button>
                  <button class="theme-option" data-theme="modern" title="现代简约">
                    <span class="theme-icon">✨</span>
                    <span class="theme-name">现代简约</span>
                  </button>
                  <button class="theme-option" data-theme="dark" title="深色">
                    <span class="theme-icon">🌙</span>
                    <span class="theme-name">深色</span>
                  </button>
                  <button class="theme-option" data-theme="green" title="绿色">
                    <span class="theme-icon">🌿</span>
                    <span class="theme-name">绿色</span>
                  </button>
                </div>
              </div>
              
              <!-- 棋子样式选择 -->
              <div class="stone-selector">
                <label class="settings-label">棋子样式</label>
                <div class="stone-options" id="stoneStyleOptions">
                  <button class="stone-option" data-style="round" title="圆形">
                    <span class="stone-preview stone-preview-round">⚪</span>
                    <span class="stone-name">圆形</span>
                  </button>
                  <button class="stone-option" data-style="flat" title="扁平">
                    <span class="stone-preview stone-preview-flat">🔘</span>
                    <span class="stone-name">扁平</span>
                  </button>
                  <button class="stone-option" data-style="3d" title="立体">
                    <span class="stone-preview stone-preview-3d">🪨</span>
                    <span class="stone-name">立体</span>
                  </button>
                </div>
              </div>
              
              <!-- 音效和动画开关 -->
              <div class="toggle-switches">
                <div class="toggle-item">
                  <label class="toggle-label">
                    <span>🔊 音效</span>
                    <span class="toggle-desc">落子、提子、胜利时播放音效</span>
                  </label>
                  <input type="checkbox" id="soundToggle" class="toggle-checkbox">
                  <label for="soundToggle" class="toggle-slider"></label>
                </div>
                <div class="toggle-item">
                  <label class="toggle-label">
                    <span>✨ 动画</span>
                    <span class="toggle-desc">棋盘和棋子的动画效果</span>
                  </label>
                  <input type="checkbox" id="animationToggle" class="toggle-checkbox">
                  <label for="animationToggle" class="toggle-slider"></label>
                </div>
              </div>
            </div>
            
            <div class="settings-section">
              <h3>🤖 OpenRouter API Key</h3>
              <input type="password" id="apiKeyInput" placeholder="输入 OpenRouter API Key">
              <div style="margin-top: 8px; display: flex; gap: 8px;">
                <button class="btn btn-secondary" id="testSettings">测试</button>
                <span id="apiStatus" style="font-size: 0.9rem;"></span>
              </div>
            </div>
            <div class="settings-section">
              <h3>🗑️ 清除缓存</h3>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 8px;">
                  <button class="btn btn-secondary" id="clearGamesBtn" style="flex: 1;">清除对局记录</button>
                  <button class="btn btn-secondary" id="clearPracticeBtn" style="flex: 1;">清除练习统计</button>
                </div>
                <button class="btn btn-secondary" id="clearAllBtn" style="background: var(--accent-red); border-color: var(--accent-red);">全部清除</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelSettings">取消</button>
            <button class="btn btn-primary" id="saveSettings">保存</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.bindSettingsEvents();
  }

  static bindSettingsEvents() {
    const modal = document.getElementById('settingsModal');
    if (!modal) {return;}

    const btn = document.getElementById('settingsBtn');
    const close = document.getElementById('closeSettings');
    const cancel = document.getElementById('cancelSettings');
    const save = document.getElementById('saveSettings');
    const testBtn = document.getElementById('testSettings');
    const input = document.getElementById('apiKeyInput');
    const statusEl = document.getElementById('apiStatus');

    const updateStatus = (key) => {
      if (!statusEl) {return;}
      if (key) {
        statusEl.innerHTML = '<span style="color: #2E7D32;">✓ Key已配置</span>';
      } else {
        statusEl.innerHTML = '<span style="color: #666;">未配置API Key</span>';
      }
    };

    if (input) {
      const savedKey = AIAnalyzer.getApiKey();
      input.value = savedKey;
      updateStatus(savedKey);
    }

    if (btn) {
      btn.addEventListener('click', () => {
        modal.style.display = 'flex';
        const key = AIAnalyzer.getApiKey();
        if (input) {input.value = key;}
        updateStatus(key);
        this.updateSettingsUI();
      });
    }

    const hideModal = () => modal.style.display = 'none';
    if (close) {close.addEventListener('click', hideModal);}
    if (cancel) {cancel.addEventListener('click', hideModal);}

    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const key = input.value.trim();
        if (!key) {
          showToast('请先输入 API Key', 'warning');
          return;
        }
        testBtn.disabled = true;
        testBtn.textContent = '测试中...';
        statusEl.innerHTML = '<span style="color: #1976D2;">正在测试连接...</span>';

        try {
          const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          if (response.ok) {
            statusEl.innerHTML = '<span style="color: #2E7D32;">✓ 连接成功！</span>';
            showToast('API Key 验证成功', 'success');
          } else {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error?.message || `HTTP ${response.status}`);
          }
        } catch (error) {
          statusEl.innerHTML = `<span style="color: #C62828;">✗ 连接失败: ${error.message}</span>`;
          showToast('API Key 验证失败', 'error');
        } finally {
          testBtn.disabled = false;
          testBtn.textContent = '测试';
        }
      });
    }

    // 棋盘主题选择
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        ThemeManager.setTheme(theme);
        this.updateThemeOptionsUI();
        showToast(`已切换为${ThemeManager.THEMES[theme].name}`, 'info');
      });
    });

    // 棋子样式选择
    const stoneOptions = document.querySelectorAll('.stone-option');
    stoneOptions.forEach(option => {
      option.addEventListener('click', () => {
        const style = option.dataset.style;
        ThemeManager.setStoneStyle(style);
        this.updateStoneOptionsUI();
        showToast(`已切换为${ThemeManager.STONE_STYLES[style].name}棋子`, 'info');
      });
    });

    // 音效开关
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('change', () => {
        const enabled = soundToggle.checked;
        SoundManager.enabled = enabled;
        ThemeManager.setSoundEnabled(enabled);
        showToast(enabled ? '音效已开启' : '音效已关闭', 'info');
      });
    }

    // 动画开关
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
      animationToggle.addEventListener('change', () => {
        const enabled = animationToggle.checked;
        ThemeManager.setAnimationEnabled(enabled);
        showToast(enabled ? '动画已开启' : '动画已关闭', 'info');
      });
    }

    if (save) {
      save.addEventListener('click', () => {
        const key = input.value.trim();
        AIAnalyzer.setApiKey(key);
        if (key) {
          showToast('API Key 已保存', 'success');
        } else {
          showToast('API Key 已清除', 'info');
        }
        hideModal();
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {hideModal();}
    });

    // 清除缓存
    const clearGamesBtn = document.getElementById('clearGamesBtn');
    if (clearGamesBtn) {
      clearGamesBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有对局记录吗？')) {
          Storage.clearHistory();
          if (typeof window.refreshHistory === 'function') {window.refreshHistory();}
          showToast('对局记录已清除', 'success');
        }
      });
    }

    const clearPracticeBtn = document.getElementById('clearPracticeBtn');
    if (clearPracticeBtn) {
      clearPracticeBtn.addEventListener('click', () => {
        if (confirm('确定要清除练习统计吗？')) {
          localStorage.removeItem('go_tsumego_stats');
          showToast('练习统计已清除', 'success');
        }
      });
    }

    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有缓存吗？这将删除对局记录、练习统计、API Key、用户信息、主题和音效设置。')) {
          Storage.clearHistory();
          localStorage.removeItem('go_username');
          localStorage.removeItem('go_tsumego_stats');
          localStorage.removeItem('openrouter_api_key');
          localStorage.removeItem('go_board_theme');
          localStorage.removeItem('go_stone_style');
          localStorage.removeItem('go_sound_enabled');
          localStorage.removeItem('go_animation_enabled');
          if (typeof window.refreshHistory === 'function') {window.refreshHistory();}
          hideModal();
          window.location.reload();
        }
      });
    }

    this.updateThemeOptionsUI();
    this.updateStoneOptionsUI();
  }

  static updateSettingsUI() {
    // 更新设置模态框的 UI
    this.updateThemeOptionsUI();
    this.updateStoneOptionsUI();
    
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.checked = SoundManager.isEnabled();
    }
    
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
      animationToggle.checked = ThemeManager.isAnimationEnabled();
    }
  }

  static updateThemeOptionsUI() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const currentTheme = ThemeManager.getTheme();
    
    themeOptions.forEach(option => {
      const theme = option.dataset.theme;
      if (theme === currentTheme) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  static updateStoneOptionsUI() {
    const stoneOptions = document.querySelectorAll('.stone-option');
    const currentStyle = ThemeManager.getStoneStyle();
    
    stoneOptions.forEach(option => {
      const style = option.dataset.style;
      if (style === currentStyle) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
}

// 添加设置面板样式
const settingsStyles = document.createElement('style');
settingsStyles.textContent = `
  .settings-section {
    margin-bottom: 24px;
  }

  .settings-section h3 {
    margin: 0 0 12px 0;
    font-size: 1rem;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px;
  }

  .settings-label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* 棋盘主题选项 */
  .theme-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-option:hover {
    border-color: var(--primary);
    background: var(--bg-hover);
  }

  .theme-option.active {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .theme-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
  }

  .theme-name {
    font-size: 0.75rem;
    color: var(--text-primary);
    text-align: center;
  }

  /* 棋子样式选项 */
  .stone-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stone-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .stone-option:hover {
    border-color: var(--primary);
    background: var(--bg-hover);
  }

  .stone-option.active {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .stone-preview {
    font-size: 2rem;
    margin-bottom: 4px;
  }

  .stone-preview-round {
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
  }

  .stone-preview-flat {
    opacity: 0.8;
  }

  .stone-preview-3d {
    filter: drop-shadow(3px 3px 3px rgba(0,0,0,0.4));
    transform: perspective(100px) rotateX(10deg);
  }

  .stone-name {
    font-size: 0.75rem;
    color: var(--text-primary);
  }

  /* 开关控件 */
  .toggle-switches {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .toggle-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    cursor: pointer;
    flex: 1;
  }

  .toggle-label span:first-child {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .toggle-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .toggle-checkbox {
    display: none;
  }

  .toggle-slider {
    position: relative;
    width: 48px;
    height: 26px;
    background: var(--border-color);
    border-radius: 13px;
    cursor: pointer;
    transition: background 0.3s ease;
    flex-shrink: 0;
    margin-left: 12px;
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .toggle-checkbox:checked + .toggle-slider {
    background: var(--primary);
  }

  .toggle-checkbox:checked + .toggle-slider::before {
    transform: translateX(22px);
  }

  /* 响应式调整 */
  @media (max-width: 480px) {
    .theme-options {
      grid-template-columns: repeat(2, 1fr);
    }

    .stone-options {
      grid-template-columns: repeat(3, 1fr);
    }

    .modal {
      max-width: 95%;
      margin: 10px;
    }

    .theme-option,
    .stone-option {
      padding: 10px 6px;
    }

    .theme-icon {
      font-size: 1.2rem;
    }

    .stone-preview {
      font-size: 1.5rem;
    }
  }
`;

if (document.head) {
  document.head.appendChild(settingsStyles);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(settingsStyles);
  });
}
