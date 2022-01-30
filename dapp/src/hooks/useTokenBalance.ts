import { useState, useEffect } from 'react';
import { network } from 'config';
import { TokenAsset } from 'types/Token';

async function fetchTokenBalanceFor(address: string): Promise<TokenAsset[]> {
  if (!address) return [];
  const res = await fetch(`${network.apiAddress}/accounts/${address}/tokens`);
  const data = await res.json();
  return data;
}

export default function useTokenBalance(address: string) {
  const [tokens, setBalance] = useState<TokenAsset[]>([]);

  useEffect(() => {
    (async () => {
      setBalance(await fetchTokenBalanceFor(address));
    })().catch(() => setBalance([]));
  }, []);

  return { tokens };
}
