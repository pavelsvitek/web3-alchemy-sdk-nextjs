import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { AlchemyService } from '../../../../src/services/alchemy.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const address = req.query.address as string;

  const alchemyService = new AlchemyService();
  const erc20Tokens = await alchemyService.getERC721TokenListViewModel(address);

  return res.json(erc20Tokens);
}
