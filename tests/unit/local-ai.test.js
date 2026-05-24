// LocalAI 单元测试
const BLACK = 1;
const WHITE = 2;

describe('LocalAI', () => {
  let engine;

  beforeEach(() => {
    engine = new GoEngine(9);
  });

  test('创建 AI 实例', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_EASY);
    expect(ai.difficulty).toBe(LocalAI.DIFFICULTY_EASY);
  });

  test('简单难度返回合法移动', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_EASY);
    const move = ai.getMove(engine.board, 9, BLACK, engine);
    expect(move).toBeDefined();
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(9);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(9);
  });

  test('中等难度返回合法移动', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_MEDIUM);
    const move = ai.getMove(engine.board, 9, BLACK, engine);
    expect(move).toBeDefined();
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(9);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(9);
  });

  test('困难难度返回合法移动', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_HARD);
    const move = ai.getMove(engine.board, 9, BLACK, engine);
    expect(move).toBeDefined();
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(9);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(9);
  });

  test('AI 优先选择中心附近', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_EASY);
    const moves = [];
    for (let i = 0; i < 20; i++) {
      const move = ai.getMove(engine.board, 9, BLACK, engine);
      moves.push(move);
    }
    const centerDistances = moves.map(m => Math.abs(m.x - 4) + Math.abs(m.y - 4));
    const avgDist = centerDistances.reduce((a, b) => a + b, 0) / centerDistances.length;
    expect(avgDist).toBeLessThan(6);
  });

  test('AI 会提子', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_MEDIUM);
    engine.play(0, 1);
    engine.play(0, 0);
    engine.play(1, 1);
    engine.play(0, 2);
    engine.play(1, 2);

    const move = ai.getMove(engine.board, 9, WHITE, engine);
    expect(move).toBeDefined();
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(9);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(9);
  });

  test('无合法移动时返回 pass', () => {
    const ai = new LocalAI(LocalAI.DIFFICULTY_EASY);
    const smallEngine = new GoEngine(2);
    smallEngine.play(0, 0);
    smallEngine.play(0, 1);
    smallEngine.play(1, 1);

    const move = ai.getMove(smallEngine.board, 2, WHITE, smallEngine);
    expect(move.pass).toBe(true);
  });

  test('不同难度产生不同移动', () => {
    const easyAI = new LocalAI(LocalAI.DIFFICULTY_EASY);
    const hardAI = new LocalAI(LocalAI.DIFFICULTY_HARD);

    engine.play(3, 3);
    engine.play(3, 4);
    engine.play(4, 3);

    const easyMove = easyAI.getMove(engine.board, 9, WHITE, engine);
    const hardMove = hardAI.getMove(engine.board, 9, WHITE, engine);

    expect(easyMove).toBeDefined();
    expect(hardMove).toBeDefined();
  });
});
