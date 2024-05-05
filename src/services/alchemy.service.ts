import TTLCache from '@isaacs/ttlcache';
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

  static tokenMetadataCache: TTLCache<string, TokenMetadataResponse> = new TTLCache({ ttl: 24 * 60 * 60 * 1000 }); // 24 hours
  static tokenBalancesCache: TTLCache<string, TokenBalanceViewModel[]> = new TTLCache({
    ttl: 10 * 60 * 1000,
  }); // 10 minutes

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
      // Check if the token metadata is cached
      if (AlchemyService.tokenMetadataCache.has(contractAddress)) {
        return AlchemyService.tokenMetadataCache.get(contractAddress) as TokenMetadataResponse;
      }

      const metadata = await this.alchemyClient.core.getTokenMetadata(contractAddress);

      // Cache the token metadata
      AlchemyService.tokenMetadataCache.set(contractAddress, metadata);

      return metadata;
    } catch (err) {
      throw new AlchemyServiceError(`Error fetching token metadata for contract address ${contractAddress}: ${err}`);
    }
  }

  async getERC721TokenListViewModel(address: string): Promise<TokenBalanceViewModel[]> {
    try {
      // Check if the token balances are cached
      if (AlchemyService.tokenBalancesCache.has(address)) {
        return AlchemyService.tokenBalancesCache.get(address) as TokenBalanceViewModel[];
      }

      const tokenList = await this.getERC20TokenList(address);
      const nonZeroBalances = tokenList.tokenBalances.filter((token) => token.tokenBalance !== '0');

      const tokenBalances: TokenBalanceViewModel[] = [];
      for (const token of nonZeroBalances) {
        const metadata = await this.getERC20TokenMetadata(token.contractAddress);
        if (metadata.decimals === null || !metadata.symbol) {
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

      // Cache the token balances
      AlchemyService.tokenBalancesCache.set(address, tokenBalances);

      return tokenBalances;
    } catch (err) {
      console.error(`Error fetching ERC20 token list for address ${address}: ${err}`);
      throw new AlchemyServiceError(`Error fetching ERC20 token list for address ${address}: ${err}`);
    }
  }
}
