import { Alchemy, TokenBalancesResponseErc20, TokenMetadataResponse } from 'alchemy-sdk';

export class AlchemyServiceError extends Error {}

export type TokenBalanceViewModel = {
  name: string;
  symbol: string;
  balance: number;
};

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

  async getERC20TokenMetadata(contractAddress: string): Promise<TokenMetadataResponse> {
    try {
      const metadata = await this.alchemyClient.core.getTokenMetadata(contractAddress);

      return metadata;
    } catch (err) {
      throw new AlchemyServiceError(`Error fetching token metadata for contract address ${contractAddress}: ${err}`);
    }
  }

  async getERC721TokenListViewModel(address: string): Promise<TokenBalanceViewModel[]> {
    try {
      const tokenList = await this.getERC20TokenList(address);
      const nonZeroBalances = tokenList.tokenBalances.filter((token) => token.tokenBalance !== '0');

      const tokenBalances: TokenBalanceViewModel[] = [];
      for (const token of nonZeroBalances) {
        const metadata = await this.getERC20TokenMetadata(token.contractAddress);
        if (!metadata.decimals || !metadata.symbol) {
          console.info(`Token metadata for contract "${token.contractAddress}": ${JSON.stringify(metadata)}`);
          console.error(`Token metadata for contract address ${token.contractAddress} is missing decimals or symbol`);
          continue;
        }

        const balance = Number(token.tokenBalance) / Math.pow(10, metadata.decimals);

        console.log(`${metadata.name}: ${balance.toFixed(2)} ${metadata.symbol}`);

        tokenBalances.push({
          name: metadata.name ?? metadata.symbol,
          symbol: metadata.symbol,
          balance,
        });
      }

      return tokenBalances;
    } catch (err) {
      console.error(`Error fetching ERC20 token list for address ${address}: ${err}`);
      throw new AlchemyServiceError(`Error fetching ERC20 token list for address ${address}: ${err}`);
    }
  }
}
