import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from './loaders';

export function useLeaderboard(options: Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchLeaderboard>>>> = {}) {
  return useQuery({
    ...options,
    queryFn: fetchLeaderboard,
    queryKey: ['leaderboard'],
  });
}
