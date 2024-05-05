import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '../auth/[...nextauth]';
import { AlchemyService } from '../../../src/services/alchemy.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, getAuthOptions(req));
  if (!session || !session.address) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  const alchemyService = new AlchemyService();
  const tokens = await alchemyService.getERC20TokenList(session.address);

  return res.json({ address: session.address, tokens });
}
