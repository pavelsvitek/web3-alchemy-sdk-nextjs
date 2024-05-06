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
});
