import { TokenBalanceViewModel } from '../alchemy.service';
import { LeaderboardService } from '../leaderboard.service';

describe('LeaderboardService()', () => {
  describe('calculateScore()', () => {
    it('should return 600 for tokens whose balance add up to 600', () => {
      const leaderboardService = new LeaderboardService();
      const tokens: TokenBalanceViewModel[] = [
        { name: 'Token1', symbol: 'T1', balance: 100 },
        { name: 'Token2', symbol: 'T2', balance: 200 },
        { name: 'Token3', symbol: 'T3', balance: 300 },
      ];

      const result = leaderboardService.calculateScore(tokens);

      expect(result).toBe(600);
    });

    it('should floor token balance values and return 400', () => {
      const leaderboardService = new LeaderboardService();
      const tokens: TokenBalanceViewModel[] = [
        { name: 'Token1', symbol: 'T1', balance: 180.543 },
        { name: 'Token2', symbol: 'T2', balance: 220.123 },
      ];

      const result = leaderboardService.calculateScore(tokens);

      expect(result).toBe(400);
    });

    it('should return 0 when given an empty array of tokens', () => {
      const leaderboardService = new LeaderboardService();
      const tokens: TokenBalanceViewModel[] = [];

      const result = leaderboardService.calculateScore(tokens);

      expect(result).toBe(0);
    });
  });

  describe('addEntry()', () => {
    it('should add an entry to the leaderboard cache', () => {
      const leaderboardService = new LeaderboardService();
      const address = '0x1234';
      const score = 100;

      leaderboardService.addEntry(address, score);

      const entry = LeaderboardService.cache.get(address);

      expect(entry).toEqual({ address, score });
    });
  });

  describe('deleteEntry()', () => {
    it('should delete an entry from the leaderboard cache', () => {
      const leaderboardService = new LeaderboardService();
      const address = '0x1234';
      const score = 100;

      leaderboardService.addEntry(address, score);
      leaderboardService.deleteEntry(address);

      const entry = LeaderboardService.cache.get(address);

      expect(entry).toBeUndefined();
    });
  });

  describe('getLeaderboard()', () => {
    it('should return the leaderboard entries sorted by score in descending order', () => {
      const leaderboardService = new LeaderboardService();
      const cache = LeaderboardService.cache;

      cache.clear();
      cache.set('0x1234', { address: '0x1234', score: 100 });
      cache.set('0x5678', { address: '0x5678', score: 200 });
      cache.set('0x9abc', { address: '0x9abc', score: 300 });

      const entries = leaderboardService.getLeaderboard();

      expect(entries).toEqual([
        { address: '0x9abc', score: 300 },
        { address: '0x5678', score: 200 },
        { address: '0x1234', score: 100 },
      ]);
    });
  });
});
