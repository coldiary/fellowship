import { useState, useEffect } from 'react';
import { proxyAddress } from 'config';
import { TokenDefinition } from 'types/Token';

async function fetchTokenDefinitions(address: string): Promise<TokenDefinition[]> {
  if (!address) return [];
  const res = await fetch(`${proxyAddress}/tokens`);
  const data = await res.json();
  return data;
}

export default function useTokenDefinitons(address: string) {
  const [tokens, setTokens] = useState<any>([]);

  useEffect(() => {
    (async () => {
      console.log(await fetchTokenDefinitions(address));
    })().catch(() => setTokens([]));
  }, []);

  return { tokens };
}
