import { NextApiRequest, NextApiResponse } from 'next';
import { AlchemyService } from '../../../../src/services/alchemy.service';
import { utils } from 'ethers';
import { LeaderboardService } from '../../../../src/services/leaderboard.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const address = req.query.address as string;

  if (utils.isAddress(address) === false) {
    return res.status(400).json({ message: 'Invalid EVM address format' });
  }

  const alchemyService = new AlchemyService();
  const erc20Tokens = await alchemyService.getERC20TokenListViewModel(address);

  /**
   * Note:
   * I would usually put this in a separate function or service, but for the sake of simplicity, I'm putting it here.
   * An event can be emitted here using pub-sub design principle to update the leaderboard in other place to separate logic.
   */
  const leaderboardService = new LeaderboardService();
  leaderboardService.addEntry(address, leaderboardService.calculateScore(address, erc20Tokens));

  return res.json(erc20Tokens);
}
