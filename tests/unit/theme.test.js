// ThemeManager 单元测试

const BLACK = 1;
const WHITE = 2;

describe('ThemeManager', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.cssText = '';
    document.documentElement.className = '';
  });

  test('默认主题为 classic', () => {
    expect(ThemeManager.getTheme()).toBe('classic');
  });

  test('设置并获取主题', () => {
    ThemeManager.setTheme('dark');
    expect(ThemeManager.getTheme()).toBe('dark');
    expect(localStorage.getItem('go_board_theme')).toBe('dark');
  });

  test('设置无效主题返回 false', () => {
    expect(ThemeManager.setTheme('invalid')).toBe(false);
  });

  test('应用主题设置 CSS 变量', () => {
    ThemeManager.setTheme('green');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--board-wood')).toBe('#8FBC8F');
    expect(root.style.getPropertyValue('--line-color')).toBe('#1A3A1A');
  });

  test('所有新主题都有效', () => {
    const newThemes = ['cherry', 'ocean', 'bamboo', 'stone', 'sunset', 'ink'];
    for (const theme of newThemes) {
      expect(ThemeManager.setTheme(theme)).toBe(true);
      expect(ThemeManager.getTheme()).toBe(theme);
    }
  });

  test('樱花主题配色正确', () => {
    ThemeManager.setTheme('cherry');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--board-wood')).toBe('#F8E8E8');
    expect(root.style.getPropertyValue('--board-wood-light')).toBe('#FFF0F0');
  });

  test('深海主题配色正确', () => {
    ThemeManager.setTheme('ocean');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--board-wood')).toBe('#4A90A4');
    expect(root.style.getPropertyValue('--line-color')).toBe('#E8F4F8');
  });

  test('水墨主题配色正确', () => {
    ThemeManager.setTheme('ink');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--board-wood')).toBe('#F5F0E1');
    expect(root.style.getPropertyValue('--line-color')).toBe('#1A1A2E');
  });

  test('默认棋子样式为 round', () => {
    expect(ThemeManager.getStoneStyle()).toBe('round');
  });

  test('设置棋子样式', () => {
    ThemeManager.setStoneStyle('3d');
    expect(ThemeManager.getStoneStyle()).toBe('3d');
  });

  test('默认音效开启', () => {
    expect(ThemeManager.isSoundEnabled()).toBe(true);
  });

  test('设置音效开关', () => {
    ThemeManager.setSoundEnabled(false);
    expect(ThemeManager.isSoundEnabled()).toBe(false);
    ThemeManager.setSoundEnabled(true);
    expect(ThemeManager.isSoundEnabled()).toBe(true);
  });

  test('默认动画开启', () => {
    expect(ThemeManager.isAnimationEnabled()).toBe(true);
  });

  test('设置动画开关', () => {
    ThemeManager.setAnimationEnabled(false);
    expect(ThemeManager.isAnimationEnabled()).toBe(false);
    expect(document.documentElement.classList.contains('no-animation')).toBe(true);
  });
});
