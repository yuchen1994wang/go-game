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
  blackPlayer?: string;
  whitePlayer?: string;
  boardSize?: number;
  komi?: number;
  handicap?: number;
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
interface TsumegoStep {
  description: string;
  correctMoves: Point[];
  solution: string;
  afterMoves?: {
    black?: Point[];
    white?: Point[];
  };
}

interface TsumegoProblem {
  id: number;
  title: string;
  difficulty: '初级' | '中级' | '高级';
  location: '角部' | '边路' | '中腹';
  type: 'kill' | 'live';
  description: string;
  size: number;
  setup: {
    black: Point[];
    white: Point[];
  };
  correctMoves: Point[];
  solution: string;
  wrongMoveHint: string;
  hint: string;
  steps?: TsumegoStep[];
}

// 棋谱数据
interface KifuData {
  id: number;
  name: string;
  moves: Array<{
    x: number;
    y: number;
    color: StoneColor;
    comment?: string;
  }>;
  date: string;
  handicap?: number;
  komi?: number;
  blackPlayer?: string;
  whitePlayer?: string;
  result?: string;
}

// 棋型数据
interface PatternData {
  id: number;
  name: string;
  type: string;
  category: string;
  points: Point[];
  description?: string;
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

// 学习路径推荐
interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  url: string;
}

// 存储增强接口
interface StorageEnhancedConfig {
  useIndexedDB: boolean;
  autoSync: boolean;
}

// 成就系统
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
}

// 导出的数据格式
interface ExportData {
  version: string;
  exportedAt: string;
  games: GameHistory[];
  tsumego: Record<string, { attempts: number; correct: number }>;
  username?: string;
  apiKey?: string;
  settings?: {
    theme?: string;
    stoneStyle?: string;
    sound?: boolean;
    animation?: boolean;
  };
}

// 主题配置
interface ThemeConfig {
  boardColor: string;
  lineColor: string;
  blackStoneColor: string;
  whiteStoneColor: string;
}

// 棋盘组件配置
interface BoardComponentConfig {
  size?: number;
  cellSize?: number;
  padding?: number;
  showCoordinates?: boolean;
  showMoveNumbers?: boolean;
  onIntersectionClick?: (x: number, y: number) => void;
  onIntersectionHover?: (x: number, y: number) => void;
  enableCache?: boolean;
  autoSize?: boolean;
}

// AI 分析配置
interface AIAnalysisConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// AI 分析结果
interface AIAnalysisResult {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  moveEvaluations?: Array<{
    moveNumber: number;
    evaluation: string;
    suggestion: string;
  }>;
}

// Web Worker 消息
interface WorkerMessage {
  type: string;
  payload: any;
}
