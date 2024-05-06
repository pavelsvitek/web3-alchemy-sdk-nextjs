import { LeaderboardEntry } from '../../src/services/leaderboard.service';

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch('/api/leaderboard');
  const data = await response.json();
  return data;
}
