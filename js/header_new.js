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
        rightHtml += `<button class="btn btn-secondary" id="settingsBtn" title="设置" style="padding: 8px 14px; font-size: 0.85rem;">⚙️ 设置</button>`;
      }
      if (showUser) {
        rightHtml += `
          <div class="user-info" id="userInfo">
            <div class="user-avatar" id="userAvatar">用</div>
            <span id="userName">用户</span>
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
      if (userNameEl) userNameEl.textContent = username;
      if (userAvatarEl) userAvatarEl.textContent = username.charAt(0).toUpperCase();
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
            <h2>⚙️ 设置</h2>
            <button class="modal-close" id="closeSettings">&times;</button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <h3>🎨 棋盘主题</h3>
              <div class="theme-grid" id="themeGrid">
                <button class="theme-option" data-theme="classic">
                  <div class="theme-preview" style="background: linear-gradient(145deg, #E8D4A8 0%, #DEB887 50%, #8B7355 100%);"></div>
                  <span class="theme-name">🪵 经典木纹</span>
                </button>
                <button class="theme-option" data-theme="modern">
                  <div class="theme-preview" style="background: linear-gradient(145deg, #FAFAFA 0%, #F5F5F5 50%, #E0E0E0 100%);"></div>
                  <span class="theme-name">✨ 现代简约</span>
                </button>
                <button class="theme-option" data-theme="dark">
                  <div class="theme-preview" style="background: linear-gradient(145deg, #3A3A3A 0%, #2C2C2C 50%, #1A1A1A 100%);"></div>
                  <span class="theme-name">🌙 深色主题</span>
                </button>
                <button class="theme-option" data-theme="green">
                  <div class="theme-preview" style="background: linear-gradient(145deg, #98D898 0%, #8FBC8F 50%, #6B8E6B 100%);"></div>
                  <span class="theme-name">🌿 绿色自然</span>
                </button>
              </div>
            </div>
            
            <div class="settings-section">
              <h3>🎯 棋子样式</h3>
              <div class="stone-style-grid" id="stoneStyleGrid">
                <button class="stone-style-option" data-style="round">
                  <div class="stone-preview">
                    <div class="stone-black"></div>
                    <div class="stone-white"></div>
                  </div>
                  <span>⚪ 圆形</span>
                </button>
                <button class="stone-style-option" data-style="flat">
                  <div class="stone-preview">
                    <div class="stone-black"></div>
                    <div class="stone-white"></div>
                  </div>
                  <span>🔘 扁平</span>
                </button>
                <button class="stone-style-option" data-style="3d">
                  <div class="stone-preview">
                    <div class="stone-black"></div>
                    <div class="stone-white"></div>
                  </div>
                  <span>🪨 立体</span>
                </button>
              </div>
            </div>
            
            <div class="settings-section">
              <h3>🔊 音效与动画</h3>
              <div class="toggle-options" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="toggle-row" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-secondary); border-radius: 10px;">
                  <div class="toggle-info">
                    <div style="font-weight: 500;">音效</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">落子、提子时播放音效</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="soundToggle" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-row" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-secondary); border-radius: 10px;">
                  <div class="toggle-info">
                    <div style="font-weight: 500;">动画效果</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">落子、提子的过渡动画</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="animationToggle" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div class="settings-section">
              <h3>🤖 OpenRouter API Key</h3>
              <input type="password" id="apiKeyInput" placeholder="输入 OpenRouter API Key" class="form-input">
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
                <button class="btn btn-secondary" id="clearAllBtn" style="background: var(--accent-red); border-color: var(--accent-red); color: white;">全部清除</button>
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
    if (!modal) return;

    const btn = document.getElementById('settingsBtn');
    const close = document.getElementById('closeSettings');
    const cancel = document.getElementById('cancelSettings');
    const save = document.getElementById('saveSettings');
    const testBtn = document.getElementById('testSettings');
    const input = document.getElementById('apiKeyInput');
    const statusEl = document.getElementById('apiStatus');

    const updateStatus = (key) => {
      if (!statusEl) return;
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
        if (input) input.value = key;
        updateStatus(key);
        this.updateSettingsUI();
      });
    }

    const hideModal = () => modal.style.display = 'none';
    if (close) close.addEventListener('click', hideModal);
    if (cancel) cancel.addEventListener('click', hideModal);

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
    const themeGrid = document.getElementById('themeGrid');
    if (themeGrid) {
      themeGrid.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
          const theme = option.dataset.theme;
          ThemeManager.setTheme(theme);
          themeGrid.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
          option.classList.add('active');
          showToast(`已切换为${ThemeManager.THEMES[theme].name}`, 'success');
        });
      });
    }

    // 棋子样式选择
    const stoneStyleGrid = document.getElementById('stoneStyleGrid');
    if (stoneStyleGrid) {
      stoneStyleGrid.querySelectorAll('.stone-style-option').forEach(option => {
        option.addEventListener('click', () => {
          const style = option.dataset.style;
          ThemeManager.setStoneStyle(style);
          stoneStyleGrid.querySelectorAll('.stone-style-option').forEach(opt => opt.classList.remove('active'));
          option.classList.add('active');
          showToast(`已切换为${ThemeManager.STONE_STYLES[style].name}棋子`, 'success');
        });
      });
    }

    // 音效开关
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.checked = SoundManager.isEnabled();
      soundToggle.addEventListener('change', () => {
        SoundManager.toggle();
        showToast(soundToggle.checked ? '音效已开启' : '音效已关闭', 'info');
      });
    }

    // 动画开关
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
      animationToggle.checked = ThemeManager.isAnimationEnabled();
      animationToggle.addEventListener('change', () => {
        ThemeManager.setAnimationEnabled(animationToggle.checked);
        showToast(animationToggle.checked ? '动画效果已开启' : '动画效果已关闭', 'info');
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
      if (e.target === modal) hideModal();
    });

    // 清除缓存
    const clearGamesBtn = document.getElementById('clearGamesBtn');
    if (clearGamesBtn) {
      clearGamesBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有对局记录吗？')) {
          Storage.clearHistory();
          if (typeof window.refreshHistory === 'function') window.refreshHistory();
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
          localStorage.removeItem('go_theme');
          localStorage.removeItem('go_sound_enabled');
          localStorage.removeItem('go_stone_style');
          localStorage.removeItem('go_animation_enabled');
          if (typeof window.refreshHistory === 'function') window.refreshHistory();
          hideModal();
          window.location.reload();
        }
      });
    }
  }

  static updateSettingsUI() {
    // 更新设置模态框的 UI
    const currentTheme = ThemeManager.getTheme();
    const currentStyle = ThemeManager.getStoneStyle();
    
    // 更新棋盘主题选中状态
    const themeGrid = document.getElementById('themeGrid');
    if (themeGrid) {
      themeGrid.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === currentTheme) {
          option.classList.add('active');
        }
      });
    }
    
    // 更新棋子样式选中状态
    const stoneStyleGrid = document.getElementById('stoneStyleGrid');
    if (stoneStyleGrid) {
      stoneStyleGrid.querySelectorAll('.stone-style-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.style === currentStyle) {
          option.classList.add('active');
        }
      });
    }
    
    // 更新音效开关
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.checked = SoundManager.isEnabled();
    }
    
    // 更新动画开关
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
      animationToggle.checked = ThemeManager.isAnimationEnabled();
    }
  }
}
