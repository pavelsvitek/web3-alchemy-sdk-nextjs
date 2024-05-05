import { TokenBalanceViewModel } from '../../src/services/alchemy.service';

export function fetchAddressERC20Tokens(address: string): Promise<TokenBalanceViewModel[]> {
  return fetch(`/api/address/${address}/tokens`).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}
