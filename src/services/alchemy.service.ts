import { Alchemy, TokenBalancesResponseErc20 } from 'alchemy-sdk';

export class AlchemyServiceError extends Error {}

export class AlchemyService {
  private apiKey: string;
  private alchemyClient: Alchemy;

  static errors = {
    AlchemyServiceError,
  };

  constructor() {
    this.apiKey = process.env.ALCHEMY_API_KEY as string;
    this.alchemyClient = new Alchemy({
      apiKey: this.apiKey,
    });
  }

  async getERC20TokenList(address: string): Promise<TokenBalancesResponseErc20> {
    try {
      const erc20TokenList = await this.alchemyClient.core.getTokenBalances(address);

      return erc20TokenList;
    } catch (err) {
      throw new AlchemyServiceError(`Error fetching ERC20 token list for address ${address}: ${err}`);
    }
  }
}
