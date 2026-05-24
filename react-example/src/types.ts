export type StoneColor = 0 | 1 | 2;
export const EMPTY: StoneColor = 0;
export const BLACK: StoneColor = 1;
export const WHITE: StoneColor = 2;

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  board: StoneColor[][];
  currentPlayer: StoneColor;
  moveHistory: MoveRecord[];
  capturedByBlack: number;
  capturedByWhite: number;
  koPoint: Point | null;
  lastMove: Point | null;
}

export interface MoveRecord {
  x: number;
  y: number;
  color: StoneColor;
  captured: number;
}

export type GameResult = 'win' | 'loss' | 'draw' | 'ongoing';

export interface GameConfig {
  boardSize: number;
  playerColor: StoneColor;
  aiLevel: 'easy' | 'medium' | 'hard';
  aiType: 'online' | 'local';
  komi: number;
}

export type ThemeName = 'classic' | 'modern' | 'dark' | 'green' | 'cherry' | 'ocean' | 'bamboo' | 'stone' | 'sunset' | 'ink';

export interface ThemeConfig {
  name: string;
  icon: string;
  boardColor: string;
  boardColorLight: string;
  boardColorDark: string;
  lineColor: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  classic: { name: '经典木纹', icon: '🪵', boardColor: '#DEB887', boardColorLight: '#E8D4A8', boardColorDark: '#8B7355', lineColor: '#2C1810' },
  modern: { name: '现代简约', icon: '✨', boardColor: '#F5F5F5', boardColorLight: '#FAFAFA', boardColorDark: '#E0E0E0', lineColor: '#333333' },
  dark: { name: '深色主题', icon: '🌙', boardColor: '#2C2C2C', boardColorLight: '#3A3A3A', boardColorDark: '#1A1A1A', lineColor: '#CCCCCC' },
  green: { name: '绿色自然', icon: '🌿', boardColor: '#8FBC8F', boardColorLight: '#98D898', boardColorDark: '#6B8E6B', lineColor: '#1A3A1A' },
  cherry: { name: '樱花粉红', icon: '🌸', boardColor: '#F8E8E8', boardColorLight: '#FFF0F0', boardColorDark: '#E8C8C8', lineColor: '#8B4513' },
  ocean: { name: '深海蓝调', icon: '🌊', boardColor: '#4A90A4', boardColorLight: '#5BA3B8', boardColorDark: '#3A7A8C', lineColor: '#E8F4F8' },
  bamboo: { name: '翠竹青韵', icon: '🎋', boardColor: '#D4E5C3', boardColorLight: '#E0EDD4', boardColorDark: '#B8D4A0', lineColor: '#2D5016' },
  stone: { name: '岩石灰调', icon: '🪨', boardColor: '#9E9E9E', boardColorLight: '#BDBDBD', boardColorDark: '#757575', lineColor: '#212121' },
  sunset: { name: '落日余晖', icon: '🌅', boardColor: '#E8A87C', boardColorLight: '#F0BC94', boardColorDark: '#D4956A', lineColor: '#4A2511' },
  ink: { name: '水墨丹青', icon: '🎨', boardColor: '#F5F0E1', boardColorLight: '#FAF5E6', boardColorDark: '#E0D5C1', lineColor: '#1A1A2E' },
};
