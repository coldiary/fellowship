import React from 'react';
import { useGetAccountInfo, DappUI } from '@elrondnetwork/dapp-core';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { getTransactions } from 'apiRequests';
import { contractAddress, network } from 'config';
import TransactionsList from './TransactionsList';
import { StateType } from './types';

const Transactions = () => {
  const { apiAddress } = network;

  const [state, setState] = React.useState<StateType>({
    transactions: [],
    transactionsFetched: undefined
  });

  const account = useGetAccountInfo();
  const fetchData = () => {
    getTransactions({
      apiAddress,
      address: account.address,
      timeout: 3000,
      contractAddress
    }).then(({ data, success }) => {
      setState({
        transactions: data,
        transactionsFetched: success
      });
    });
  };

  React.useEffect(fetchData, []);

  const { transactions } = state;

  return transactions.length > 0 ? (
    <TransactionsList transactions={transactions} />
  ) : (
    <div className='my-5'>
      <DappUI.PageState
        icon={faExchangeAlt}
        className='text-muted fa-3x'
        title='No Transactions'
      />
    </div>
  );
};

export default Transactions;
