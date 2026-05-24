// statistics.js 测试

const { TimeFilter, GameStats, PracticeStats, GrowthChart, RadarChart, StatisticsPanel } = require('../../js/statistics.js');

describe('TimeFilter', () => {
  test('should filter games by ALL', () => {
    const games = [
      { date: new Date().toISOString() },
      { date: new Date(Date.now() - 86400000 * 10).toISOString() }
    ];
    const filtered = TimeFilter.getFilteredGames(games, TimeFilter.ALL);
    expect(filtered.length).toBe(2);
  });

  test('should filter games by WEEK', () => {
    const games = [
      { date: new Date().toISOString() },
      { date: new Date(Date.now() - 86400000 * 8).toISOString() }
    ];
    const filtered = TimeFilter.getFilteredGames(games, TimeFilter.WEEK);
    expect(filtered.length).toBe(1);
  });

  test('should filter games by MONTH', () => {
    const games = [
      { date: new Date().toISOString() },
      { date: new Date(Date.now() - 86400000 * 35).toISOString() }
    ];
    const filtered = TimeFilter.getFilteredGames(games, TimeFilter.MONTH);
    expect(filtered.length).toBe(1);
  });

  test('should filter games by QUARTER', () => {
    const games = [
      { date: new Date().toISOString() },
      { date: new Date(Date.now() - 86400000 * 100).toISOString() }
    ];
    const filtered = TimeFilter.getFilteredGames(games, TimeFilter.QUARTER);
    expect(filtered.length).toBe(1);
  });

  test('should filter games by YEAR', () => {
    const games = [
      { date: new Date().toISOString() },
      { date: new Date(Date.now() - 86400000 * 400).toISOString() }
    ];
    const filtered = TimeFilter.getFilteredGames(games, TimeFilter.YEAR);
    expect(filtered.length).toBe(1);
  });

  test('should return all games for invalid filter', () => {
    const games = [
      { date: new Date().toISOString() },
      { date: new Date(Date.now() - 86400000 * 400).toISOString() }
    ];
    const filtered = TimeFilter.getFilteredGames(games, 'invalid-filter');
    expect(filtered.length).toBe(2);
  });
});

describe('Statistics classes', () => {
  beforeEach(() => {
    // Mock DOM element
    document.getElementById = jest.fn(() => ({
      innerHTML: '',
      querySelectorAll: () => [],
      querySelector: () => null
    }));
  });

  test('GameStats should initialize', () => {
    const gameStats = new GameStats('test-container');
    expect(gameStats).toBeDefined();
  });

  test('PracticeStats should initialize', () => {
    const practiceStats = new PracticeStats('test-container');
    expect(practiceStats).toBeDefined();
  });

  test('GrowthChart should initialize', () => {
    const growthChart = new GrowthChart('test-container');
    expect(growthChart).toBeDefined();
  });

  test('RadarChart should initialize', () => {
    const radarChart = new RadarChart('test-container');
    expect(radarChart).toBeDefined();
  });

  test('StatisticsPanel should initialize', () => {
    const panel = new StatisticsPanel('test-container');
    expect(panel).toBeDefined();
  });
});
