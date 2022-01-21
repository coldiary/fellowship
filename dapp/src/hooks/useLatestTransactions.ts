import { useState, useEffect } from 'react';
import { network } from 'config';
// import { Transaction } from '@elrondnetwork/erdjs/out';
import { Transaction } from 'types/Transaction';

async function fetchLatestTransactionsFor(address: string) {
  const res = await fetch(`${network.apiAddress}/accounts/${address}/transactions?size=5`);
  const data = await res.json();
  console.log(data);
  return data;
}

export default function useLatestTransactions(address: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setTransactions(await fetchLatestTransactionsFor(address));
    })().catch(() => setTransactions([]));
  }, []);

  return { transactions };
}
