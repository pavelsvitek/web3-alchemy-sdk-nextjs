import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';
import { fetchAddressERC20Tokens } from './loaders';
import { TokenBalanceViewModel } from '../../src/services/alchemy.service';

export function useAddressERC20Tokens(
  address: string,
  options: Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchAddressERC20Tokens>>>> = {}
) {
  return useQuery({
    ...options,
    queryFn: () => fetchAddressERC20Tokens(address),
    queryKey: ['address', address, 'erc20-tokens'],
  });
}
