import useSWR from 'swr';
import { apiAddress } from 'config';
import { TokenDefinition } from 'types/Token';

export default function useTokenDefinitons() {
  const { data: tokens } = useSWR('tokens', async (): Promise<TokenDefinition[]> => {
    const res = await fetch(`${apiAddress}/tokens`);
    const data = await res.json();
    return data;
  });

  return { tokens: tokens ?? [] };
}
