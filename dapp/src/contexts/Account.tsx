import React, { createContext, FC, useMemo } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

import useLatestTransactions from 'hooks/useLatestTransactions';
import useTokenBalance from 'hooks/useTokenBalance';
import { TokenAsset } from 'types/Token';
import { Transaction } from 'types/Transaction';

export type AccountContextType = {
    address: null
} | {
    address: string;
    balance: string;
    transactions: Transaction[];
    tokens: TokenAsset[];
}

export const AccountContext = createContext<AccountContextType>({ address: null });


export const AccountContextProvider: FC = ({ children }) => {
    const { address, account } = useGetAccountInfo();
    const { tokens } = useTokenBalance(address);
    const { transactions } = useLatestTransactions(address);

    const value = useMemo(() => ({ address, balance: account.balance, tokens, transactions }), [address, account, tokens, transactions]);

    return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
