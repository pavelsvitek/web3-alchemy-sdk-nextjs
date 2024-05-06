import TTLCache from '@isaacs/ttlcache';
import { TokenBalanceViewModel } from './alchemy.service';

export type LeaderboardEntry = {
  address: string;
  score: number;
};

export class LeaderboardService {
  // Cache the leaderboard for 24 hours
  // This should be replaces with long-term storage like a database
  static cache: TTLCache<string, LeaderboardEntry> = new TTLCache({ ttl: 24 * 60 * 60 * 1000 });

  constructor() {
    this.addEntry('0x1234', 100);
    this.addEntry('0x5678', 200);
    this.addEntry('0x9abc', 300);
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const entries = [...LeaderboardService.cache.values()];

    // Sort the entries by score DESC
    entries.sort((a, b) => b.score - a.score);

    return entries;
  }

  addEntry(address: string, score: number): void {
    // Add the entry to the database
    LeaderboardService.cache.set(address, {
      address,
      score,
    });
  }

  deleteEntry(address: string): void {
    // Delete the entry from the database
    LeaderboardService.cache.delete(address);
  }

  calculateScore(address: string, tokens: TokenBalanceViewModel[]): number {
    // Random score calculation
    return Math.floor(tokens.reduce((acc, token) => acc + Math.random() * 1000 + Math.floor(token.balance), 0));
  }
}
