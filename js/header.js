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
        <div class="modal">
          <div class="modal-header">
            <h2>⚙️ 设置</h2>
            <button class="modal-close" id="closeSettings">&times;</button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <h3>🎨 外观与声音</h3>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <button class="btn btn-secondary" id="themeToggleBtn" style="padding: 8px 12px;">🌙 深色</button>
                  <span id="themeStatus"></span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <button class="btn btn-secondary" id="soundToggleBtn" style="padding: 8px 12px;">🔊 开启</button>
                  <span id="soundStatus"></span>
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

    // 音效开关
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundStatus = document.getElementById('soundStatus');
    
    const updateSoundUI = () => {
      if (!soundToggleBtn || !soundStatus) return;
      const enabled = SoundManager.isEnabled();
      soundToggleBtn.textContent = enabled ? '🔊 开启' : '🔇 关闭';
      soundStatus.textContent = enabled ? '落子、提子、胜利时播放音效' : '音效已关闭';
    };
    
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        SoundManager.toggle();
        updateSoundUI();
        showToast(SoundManager.isEnabled() ? '音效已开启' : '音效已关闭', 'info');
      });
    }

    // 主题切换
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeStatus = document.getElementById('themeStatus');

    const updateThemeUI = () => {
      if (!themeToggleBtn || !themeStatus) return;
      const isDark = ThemeManager.getTheme() === 'dark';
      themeToggleBtn.textContent = isDark ? '☀️ 浅色' : '🌙 深色';
      themeStatus.textContent = isDark ? '当前为深色主题' : '当前为浅色主题';
    };

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        ThemeManager.toggle();
        updateThemeUI();
        showToast(ThemeManager.getTheme() === 'dark' ? '已切换为深色主题' : '已切换为浅色主题', 'info');
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
          if (typeof window.refreshHistory === 'function') window.refreshHistory();
          hideModal();
          window.location.reload();
        }
      });
    }

    updateSoundUI();
    updateThemeUI();
  }

  static updateSettingsUI() {
    // 更新设置模态框的 UI
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundStatus = document.getElementById('soundStatus');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeStatus = document.getElementById('themeStatus');
    
    if (soundToggleBtn && soundStatus) {
      const enabled = SoundManager.isEnabled();
      soundToggleBtn.textContent = enabled ? '🔊 开启' : '🔇 关闭';
      soundStatus.textContent = enabled ? '落子、提子、胜利时播放音效' : '音效已关闭';
    }
    
    if (themeToggleBtn && themeStatus) {
      const isDark = ThemeManager.getTheme() === 'dark';
      themeToggleBtn.textContent = isDark ? '☀️ 浅色' : '🌙 深色';
      themeStatus.textContent = isDark ? '当前为深色主题' : '当前为浅色主题';
    }
  }
}
