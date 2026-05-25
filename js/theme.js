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
    },
    cherry: {
      name: '樱花粉红',
      icon: '🌸',
      variables: {
        '--board-wood': '#F8E8E8',
        '--board-wood-light': '#FFF0F0',
        '--board-dark': '#E8C8C8',
        '--line-color': '#8B4513'
      }
    },
    ocean: {
      name: '深海蓝调',
      icon: '🌊',
      variables: {
        '--board-wood': '#4A90A4',
        '--board-wood-light': '#5BA3B8',
        '--board-dark': '#3A7A8C',
        '--line-color': '#E8F4F8'
      }
    },
    bamboo: {
      name: '翠竹青韵',
      icon: '🎋',
      variables: {
        '--board-wood': '#D4E5C3',
        '--board-wood-light': '#E0EDD4',
        '--board-dark': '#B8D4A0',
        '--line-color': '#2D5016'
      }
    },
    stone: {
      name: '岩石灰调',
      icon: '🪨',
      variables: {
        '--board-wood': '#9E9E9E',
        '--board-wood-light': '#BDBDBD',
        '--board-dark': '#757575',
        '--line-color': '#212121'
      }
    },
    sunset: {
      name: '落日余晖',
      icon: '🌅',
      variables: {
        '--board-wood': '#E8A87C',
        '--board-wood-light': '#F0BC94',
        '--board-dark': '#D4956A',
        '--line-color': '#4A2511'
      }
    },
    ink: {
      name: '水墨丹青',
      icon: '🎨',
      variables: {
        '--board-wood': '#F5F0E1',
        '--board-wood-light': '#FAF5E6',
        '--board-dark': '#E0D5C1',
        '--line-color': '#1A1A2E'
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
  volume: 0.5,

  init() {
    this.enabled = ThemeManager.isSoundEnabled();
    this.volume = parseFloat(localStorage.getItem('go_sound_volume')) || 0.5;
  },

  isEnabled() {
    return ThemeManager.isSoundEnabled();
  },

  toggle() {
    this.enabled = !this.enabled;
    ThemeManager.setSoundEnabled(this.enabled);
  },

  getVolume() {
    return this.volume;
  },

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('go_sound_volume', this.volume);
  },

  // 落子音效 - 模拟石头落在棋盘上的声音
  playStone() {
    if (!this.enabled) return;
    this.ensureAudioContext();
    try {
      const t = this.audioContext.currentTime;
      // 主音 - 短促的木头敲击声
      this.playWoodSound(600, 0.08, 0.4, t);
      // 高频泛音 - 石头的清脆感
      this.playWoodSound(1200, 0.05, 0.15, t + 0.005);
      // 低频共鸣
      this.playWoodSound(200, 0.12, 0.2, t);
    } catch (e) {
      console.warn('Stone sound failed:', e);
    }
  },

  // 提子音效 - 多个棋子被提走的声音
  playCapture(count = 1) {
    if (!this.enabled) return;
    this.ensureAudioContext();
    try {
      const t = this.audioContext.currentTime;
      // 主要音效 - 较深的木头声
      this.playWoodSound(350, 0.15, 0.5, t);
      // 多个棋子碰撞的叠加
      for (let i = 0; i < Math.min(count, 5); i++) {
        const delay = i * 0.03;
        this.playWoodSound(500 + i * 100, 0.06, 0.2, t + delay);
      }
    } catch (e) {
      console.warn('Capture sound failed:', e);
    }
  },

  // 胜利音效 - 欢快的和弦
  playVictory() {
    if (!this.enabled) return;
    this.ensureAudioContext();
    try {
      const t = this.audioContext.currentTime;
      // 大三和弦上行
      this.playTone(523.25, 0.3, 0.4, t); // C5
      this.playTone(659.25, 0.3, 0.4, t + 0.1); // E5
      this.playTone(783.99, 0.4, 0.5, t + 0.2); // G5
      this.playTone(1046.50, 0.6, 0.6, t + 0.3); // C6
    } catch (e) {
      console.warn('Victory sound failed:', e);
    }
  },

  // 失败音效 - 低沉的下行
  playDefeat() {
    if (!this.enabled) return;
    this.ensureAudioContext();
    try {
      const t = this.audioContext.currentTime;
      this.playTone(392.00, 0.4, 0.4, t); // G4
      this.playTone(349.23, 0.4, 0.4, t + 0.15); // F4
      this.playTone(329.63, 0.5, 0.4, t + 0.3); // E4
      this.playTone(293.66, 0.6, 0.5, t + 0.45); // D4
    } catch (e) {
      console.warn('Defeat sound failed:', e);
    }
  },

  // 过音效 - 轻微的风声
  playPass() {
    if (!this.enabled) return;
    this.ensureAudioContext();
    try {
      const t = this.audioContext.currentTime;
      this.playNoise(0.3, 0.15, t);
    } catch (e) {
      console.warn('Pass sound failed:', e);
    }
  },

  // 悔棋音效 - 撤销的声音
  playUndo() {
    if (!this.enabled) return;
    this.ensureAudioContext();
    try {
      const t = this.audioContext.currentTime;
      this.playTone(440, 0.1, 0.2, t);
      this.playTone(330, 0.15, 0.2, t + 0.08);
    } catch (e) {
      console.warn('Undo sound failed:', e);
    }
  },

  // 内部方法：确保 AudioContext 已创建
  ensureAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  },

  // 内部方法：播放纯音
  playTone(frequency, duration, gain, startTime) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    const vol = gain * this.volume;
    gainNode.gain.setValueAtTime(vol, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  },

  // 内部方法：播放木头/石头碰撞声
  playWoodSound(frequency, duration, gain, startTime) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.value = frequency;
    // 使用三角波更接近木头敲击声
    oscillator.type = 'triangle';
    const vol = gain * this.volume;
    gainNode.gain.setValueAtTime(vol, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  },

  // 内部方法：播放白噪声（用于过等柔和音效）
  playNoise(duration, gain, startTime) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    const vol = gain * this.volume;
    gainNode.gain.setValueAtTime(vol, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    noise.start(startTime);
    noise.stop(startTime + duration);
  }
};

// 初始化
SoundManager.init();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, SoundManager };
}
