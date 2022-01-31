import { useState, useEffect } from 'react';
import { proxyAddress } from 'config';
import { TokenDefinition } from 'types/Token';

async function fetchTokenDefinitions(): Promise<TokenDefinition[]> {
  const res = await fetch(`${proxyAddress}/tokens`);
  const data = await res.json();
  return data;
}

export default function useTokenDefinitons() {
  const [tokens, setTokens] = useState<TokenDefinition[]>([]);

  useEffect(() => {
    (async () => {
      setTokens(await fetchTokenDefinitions());
    })().catch(() => setTokens([]));
  }, []);

  return { tokens };
}
