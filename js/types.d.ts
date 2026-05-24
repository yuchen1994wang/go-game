/**
 * 围棋项目类型定义
 */

// 棋子颜色
type StoneColor = 0 | 1 | 2;
const EMPTY: StoneColor = 0;
const BLACK: StoneColor = 1;
const WHITE: StoneColor = 2;

// 坐标点
interface Point {
  x: number;
  y: number;
}

// 游戏结果
type GameResult = 'win' | 'loss' | 'draw' | 'ongoing';

// 游戏历史记录
interface GameHistory {
  id: number;
  date: string;
  result: GameResult;
  moves?: number;
  player?: 'black' | 'white';
  phase?: string;
  territory?: {
    black: number;
    white: number;
  };
  savedAt: string;
}

// 棋盘数据
type Board = StoneColor[][];

// 棋组
interface Group {
  stones: Point[];
  liberties: number;
  color: StoneColor;
}

// 围棋引擎配置
interface GoEngineConfig {
  size?: number;
  komi?: number;
}

// 存储管理器接口
interface StorageManager {
  getHistory(): GameHistory[];
  saveHistory(history: GameHistory[]): void;
  addGame(gameData: Partial<GameHistory>): GameHistory[];
  deleteGame(id: number): GameHistory[];
  clearHistory(): void;
}

// Toast 消息类型
type ToastType = 'info' | 'success' | 'error' | 'warning';

// 死活题数据
interface TsumegoData {
  id: number;
  board: Board;
  solution: Point[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

// 棋谱数据
interface KifuData {
  id: number;
  name: string;
  moves: Array<{
    x: number;
    y: number;
    color: StoneColor;
  }>;
  date: string;
  handicap?: number;
  komi?: number;
}

// 棋型数据
interface PatternData {
  id: number;
  name: string;
  type: string;
  category: string;
  points: Point[];
}

// 统计数据
interface Statistics {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  totalTsumego: number;
  correctTsumego: number;
  streakDays: number;
  winRate: number;
}

// 时间过滤器
type TimeFilterType = 'all' | 'week' | 'month' | 'quarter' | 'year';

// 能力评分
interface AbilityScore {
  name: string;
  score: number;
  color: string;
}
