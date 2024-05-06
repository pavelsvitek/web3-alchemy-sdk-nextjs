import { NextApiRequest, NextApiResponse } from 'next';
import { LeaderboardService } from '../../src/services/leaderboard.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const leaderboardService = new LeaderboardService();

    const leaderboard = await leaderboardService.getLeaderboard();

    return res.json(leaderboard);
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || err });
  }
}
