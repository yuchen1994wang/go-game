// 主题管理
const ThemeManager = {
  STORAGE_KEYS: {
    THEME: 'go_board_theme',
    STONE_STYLE: 'go_stone_style',
    SOUND: 'go_sound_enabled',
    ANIMATION: 'go_animation_enabled'
  },

  THEMES: {
    classic: {
      name: '经典木纹',
      icon: '🪵',
      variables: {
        '--board-wood': '#DEB887',
        '--board-wood-light': '#E8D4A8',
        '--board-dark': '#8B7355',
        '--line-color': '#2C1810'
      }
    },
    modern: {
      name: '现代简约',
      icon: '✨',
      variables: {
        '--board-wood': '#F5F5F5',
        '--board-wood-light': '#FAFAFA',
        '--board-dark': '#E0E0E0',
        '--line-color': '#333333'
      }
    },
    dark: {
      name: '深色主题',
      icon: '🌙',
      variables: {
        '--board-wood': '#2C2C2C',
        '--board-wood-light': '#3A3A3A',
        '--board-dark': '#1A1A1A',
        '--line-color': '#CCCCCC'
      }
    },
    green: {
      name: '绿色自然',
      icon: '🌿',
      variables: {
        '--board-wood': '#8FBC8F',
        '--board-wood-light': '#98D898',
        '--board-dark': '#6B8E6B',
        '--line-color': '#1A3A1A'
      }
    }
  },

  STONE_STYLES: {
    round: { name: '圆形', icon: '⚪', class: 'stone-round' },
    flat: { name: '扁平', icon: '🔘', class: 'stone-flat' },
    '3d': { name: '立体', icon: '🪨', class: 'stone-3d' }
  },

  init() {
    this.applyTheme();
    this.applyStoneStyle();
    this.applyAnimation();
  },

  getTheme() {
    return localStorage.getItem(this.STORAGE_KEYS.THEME) || 'classic';
  },

  setTheme(theme) {
    if (this.THEMES[theme]) {
      localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
      this.applyTheme();
      return true;
    }
    return false;
  },

  applyTheme() {
    const theme = this.getTheme();
    const themeConfig = this.THEMES[theme];
    if (themeConfig) {
      const root = document.documentElement;
      Object.entries(themeConfig.variables).forEach(([variable, value]) => {
        root.style.setProperty(variable, value);
      });
    }
  },

  getStoneStyle() {
    return localStorage.getItem(this.STORAGE_KEYS.STONE_STYLE) || 'round';
  },

  setStoneStyle(style) {
    if (this.STONE_STYLES[style]) {
      localStorage.setItem(this.STORAGE_KEYS.STONE_STYLE, style);
      this.applyStoneStyle();
      return true;
    }
    return false;
  },

  applyStoneStyle() {
    const style = this.getStoneStyle();
    const root = document.documentElement;
    Object.values(this.STONE_STYLES).forEach(s => {
      root.classList.remove(s.class);
    });
    const stoneConfig = this.STONE_STYLES[style];
    if (stoneConfig) {
      root.classList.add(stoneConfig.class);
    }
  },

  isSoundEnabled() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.SOUND);
    return stored === null ? true : stored === 'true';
  },

  setSoundEnabled(enabled) {
    localStorage.setItem(this.STORAGE_KEYS.SOUND, enabled);
  },

  isAnimationEnabled() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.ANIMATION);
    return stored === null ? true : stored === 'true';
  },

  setAnimationEnabled(enabled) {
    localStorage.setItem(this.STORAGE_KEYS.ANIMATION, enabled);
    this.applyAnimation();
  },

  applyAnimation() {
    const enabled = this.isAnimationEnabled();
    const root = document.documentElement;
    if (enabled) {
      root.classList.remove('no-animation');
    } else {
      root.classList.add('no-animation');
    }
  }
};

// 音效管理
const SoundManager = {
  audioContext: null,
  enabled: true,

  init() {
    this.enabled = ThemeManager.isSoundEnabled();
  },

  isEnabled() {
    return ThemeManager.isSoundEnabled();
  },

  toggle() {
    this.enabled = !this.enabled;
    ThemeManager.setSoundEnabled(this.enabled);
  },

  playStone() {
    if (!this.enabled) return;
    this.playTone(800, 0.1);
  },

  playCapture() {
    if (!this.enabled) return;
    this.playTone(400, 0.15);
  },

  playVictory() {
    if (!this.enabled) return;
    this.playTone(1000, 0.3);
    setTimeout(() => this.playTone(1200, 0.3), 150);
  },

  playTone(frequency, duration) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }
};

// 初始化
SoundManager.init();
