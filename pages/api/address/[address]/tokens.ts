import { NextApiRequest, NextApiResponse } from 'next';
import { AlchemyService } from '../../../../src/services/alchemy.service';
import { utils } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const address = req.query.address as string;

  if (utils.isAddress(address) === false) {
    return res.status(400).json({ message: 'Invalid EVM address format' });
  }

  const alchemyService = new AlchemyService();
  const erc20Tokens = await alchemyService.getERC721TokenListViewModel(address);

  return res.json(erc20Tokens);
}
