import { useState, useEffect } from 'react';
import { apiAddress } from 'config';
import { Transaction } from 'types/Transaction';

async function fetchLatestTransactionsFor(address: string): Promise<Transaction[]> {
  if (!address) return [];
  const res = await fetch(`${apiAddress}/accounts/${address}/transactions?size=5`);
  const data = await res.json();
  return data;
}

export default function useLatestTransactions(address: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setTransactions(await fetchLatestTransactionsFor(address));
    })().catch(() => setTransactions([]));
  }, [address]);

  return { transactions };
}
