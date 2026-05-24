require('fake-indexeddb/auto');
const { IndexedDBManager } = require('../../js/indexed-db.js');

describe('IndexedDBManager', () => {
  let dbManager;

  beforeAll(async () => {
    dbManager = new IndexedDBManager('TestDB', 1);
    await dbManager.open();
  });

  afterAll(async () => {
    if (dbManager.db) {
      await dbManager.clear('games');
      await dbManager.clear('tsumego');
      dbManager.db.close();
    }
  });

  describe('Basic Operations', () => {
    test('should open database successfully', () => {
      expect(dbManager.db).toBeDefined();
      expect(dbManager.db.name).toBe('TestDB');
    });

    test('should add data to games store', async () => {
      const game = {
        date: '2024-01-01',
        result: 'win',
        moves: 100,
        player: 'black'
      };

      const id = await dbManager.add('games', game);
      expect(id).toBeGreaterThan(0);
    });

    test('should retrieve data by id', async () => {
      const game = {
        date: '2024-01-02',
        result: 'loss',
        moves: 80,
        player: 'white'
      };

      const id = await dbManager.add('games', game);
      const retrieved = await dbManager.get('games', id);

      expect(retrieved).toBeDefined();
      expect(retrieved.result).toBe('loss');
      expect(retrieved.moves).toBe(80);
    });

    test('should get all data from store', async () => {
      const allGames = await dbManager.getAll('games');
      expect(Array.isArray(allGames)).toBe(true);
      expect(allGames.length).toBeGreaterThan(0);
    });

    test('should update data using put', async () => {
      const game = {
        date: '2024-01-03',
        result: 'draw',
        moves: 120,
        player: 'black'
      };

      const id = await dbManager.add('games', game);
      const toUpdate = await dbManager.get('games', id);
      toUpdate.result = 'win';

      await dbManager.put('games', toUpdate);
      const updated = await dbManager.get('games', id);

      expect(updated.result).toBe('win');
    });

    test('should delete data', async () => {
      const game = {
        date: '2024-01-04',
        result: 'loss',
        moves: 90,
        player: 'white'
      };

      const id = await dbManager.add('games', game);
      await dbManager.delete('games', id);
      const retrieved = await dbManager.get('games', id);

      expect(retrieved).toBeUndefined();
    });

    test('should clear all data from store', async () => {
      await dbManager.clear('games');
      const allGames = await dbManager.getAll('games');

      expect(allGames.length).toBe(0);
    });
  });

  describe('Query Operations', () => {
    beforeAll(async () => {
      const games = [
        { date: '2024-01-10', result: 'win', moves: 100 },
        { date: '2024-01-11', result: 'loss', moves: 80 },
        { date: '2024-01-12', result: 'win', moves: 120 },
        { date: '2024-01-13', result: 'win', moves: 90 },
      ];

      for (const game of games) {
        await dbManager.add('games', game);
      }
    });

    test('should query data by filter function', async () => {
      const wins = await dbManager.query('games', game => game.result === 'win');

      expect(wins.length).toBeGreaterThanOrEqual(3);
      wins.forEach(game => {
        expect(game.result).toBe('win');
      });
    });

    test('should count records', async () => {
      const count = await dbManager.count('games');
      expect(count).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Data Export/Import', () => {
    test('should export all data', async () => {
      const data = await dbManager.exportData();

      expect(data).toBeDefined();
      expect(data.games).toBeDefined();
      expect(Array.isArray(data.games)).toBe(true);
    });

    test('should import data', async () => {
      const exportData = {
        games: [
          { date: '2024-02-01', result: 'win', moves: 150 }
        ]
      };

      await dbManager.importData(exportData);
      const games = await dbManager.getAll('games');

      expect(games.length).toBeGreaterThan(0);
    });
  });
});
