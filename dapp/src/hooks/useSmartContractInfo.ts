import { useState, useEffect } from 'react';

import { network } from 'config';
import { ContractInfo } from 'types/Contract';

async function fetchContractInfo(address: string): Promise<ContractInfo | undefined> {
  if (!address) return undefined;
  const res = await fetch(`${network.apiAddress}/accounts/${address}`);
  const data = await res.json();
  return data;
}

export default function useSmartContractInfo(contractAddress: string) {
  const [info, setInfo] = useState<ContractInfo | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setInfo(await fetchContractInfo(contractAddress));
    })().catch(() => setInfo(undefined));
  }, []);

  return info;
}
