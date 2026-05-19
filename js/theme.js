// 主题管理
class ThemeManager {
  static STORAGE_KEYS = {
    THEME: 'go_board_theme',
    STONE_STYLE: 'go_stone_style',
    SOUND: 'go_sound_enabled',
    ANIMATION: 'go_animation_enabled'
  };

  static THEMES = {
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
  };

  static STONE_STYLES = {
    round: {
      name: '圆形',
      icon: '⚪',
      class: 'stone-round'
    },
    flat: {
      name: '扁平',
      icon: '🔘',
      class: 'stone-flat'
    },
    '3d': {
      name: '立体',
      icon: '🪨',
      class: 'stone-3d'
    }
  };

  static init() {
    this.applyTheme();
    this.applyStoneStyle();
    this.applyAnimation();
  }

  static getTheme() {
    return localStorage.getItem(this.STORAGE_KEYS.THEME) || 'classic';
  }

  static setTheme(theme) {
    if (this.THEMES[theme]) {
      localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
      this.applyTheme();
      return true;
    }
    return false;
  }

  static applyTheme() {
    const theme = this.getTheme();
    const themeConfig = this.THEMES[theme];

    if (themeConfig) {
      const root = document.documentElement;
      Object.entries(themeConfig.variables).forEach(([variable, value]) => {
        root.style.setProperty(variable, value);
      });
    }
  }

  static getStoneStyle() {
    return localStorage.getItem(this.STORAGE_KEYS.STONE_STYLE) || 'round';
  }

  static setStoneStyle(style) {
    if (this.STONE_STYLES[style]) {
      localStorage.setItem(this.STORAGE_KEYS.STONE_STYLE, style);
      this.applyStoneStyle();
      return true;
    }
    return false;
  }

  static applyStoneStyle() {
    const style = this.getStoneStyle();
    const root = document.documentElement;

    Object.values(this.STONE_STYLES).forEach(s => {
      root.classList.remove(s.class);
    });

    const stoneConfig = this.STONE_STYLES[style];
    if (stoneConfig) {
      root.classList.add(stoneConfig.class);
    }
  }

  static isSoundEnabled() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.SOUND);
    return stored === null ? true : stored === 'true';
  }

  static setSoundEnabled(enabled) {
    localStorage.setItem(this.STORAGE_KEYS.SOUND, enabled);
  }

  static isAnimationEnabled() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.ANIMATION);
    return stored === null ? true : stored === 'true';
  }

  static setAnimationEnabled(enabled) {
    localStorage.setItem(this.STORAGE_KEYS.ANIMATION, enabled);
    this.applyAnimation();
  }

  static applyAnimation() {
    const enabled = this.isAnimationEnabled();
    const root = document.documentElement;

    if (enabled) {
      root.classList.remove('no-animation');
    } else {
      root.classList.add('no-animation');
    }
  }
}

// 音效管理
class SoundManager {
  static init() {
    this.audioContext = null;
    this.enabled = ThemeManager.isSoundEnabled();
  }

  static isEnabled() {
    return ThemeManager.isSoundEnabled();
  }

  static toggle() {
    this.enabled = !this.enabled;
    ThemeManager.setSoundEnabled(this.enabled);
  }

  static playStone() {
    if (!this.enabled) return;
    this.playTone(800, 0.1);
  }

  static playCapture() {
    if (!this.enabled) return;
    this.playTone(400, 0.15);
  }

  static playVictory() {
    if (!this.enabled) return;
    this.playTone(1000, 0.3);
    setTimeout(() => this.playTone(1200, 0.3), 150);
  }

  static playTone(frequency, duration) {
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
}

// 初始化音效管理器
SoundManager.init();

if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
  window.SoundManager = SoundManager;
}
